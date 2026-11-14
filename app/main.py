from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import random
import datetime

from app.config import settings
from app.database import engine, get_db, Base
from app.models import Estabelecimento, Pedido, Entregador, Turno
from app.schemas import (
    EstabelecimentoCreate, EstabelecimentoResponse,
    PedidoCreate, PedidoResponse, PedidoStatusUpdate,
    TurnoSOSCreate, TurnoValidarPIN, TurnoResponse
)

# Cria as tabelas automaticamente no SQLite/Postgres na inicialização
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hub de Venda Direta e Conexão Local para MEIs - API",
    description="API REST para venda direta sem taxas de aplicativos (RF01/RF02) e contratação emergencial de motoboys por turno com trava PIN (RF03/RF04).",
    version="1.0.0"
)

# Configuração de CORS (RNF01)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção pode restringir às URLs da Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "status": "online",
        "projeto": "Hub de Venda Direta e Conexão Local para MEIs",
        "piloto": "Marmitaria Sabor da Vila",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Endpoint para monitoramento UptimeRobot e observabilidade."""
    return {"status": "UP", "timestamp": datetime.datetime.utcnow().isoformat()}


# ==========================================
# ROTAS: ESTABELECIMENTO
# ==========================================

@app.post("/estabelecimentos", response_model=EstabelecimentoResponse, status_code=status.HTTP_201_CREATED)
def criar_estabelecimento(payload: EstabelecimentoCreate, db: Session = Depends(get_db)):
    existente = db.query(Estabelecimento).filter(Estabelecimento.email_login == payload.email_login).first()
    if existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    
    novo = Estabelecimento(
        nome_fantasia=payload.nome_fantasia,
        email_login=payload.email_login,
        senha_hash=payload.senha,  # Em produção com segurança Argon2id/bcrypt
        chave_pix=payload.chave_pix,
        endereco_base=payload.endereco_base,
        latitude=payload.latitude,
        longitude=payload.longitude
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


# ==========================================
# ROTAS: PEDIDOS (RF01 & RF02)
# ==========================================

@app.post("/pedidos", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
def criar_pedido_cliente(payload: PedidoCreate, db: Session = Depends(get_db)):
    """RF01: Rota pública para criação de pedido direto via Pix."""
    estab = db.query(Estabelecimento).filter(Estabelecimento.id == payload.estabelecimento_id).first()
    if not estab:
        # Se for teste inicial, cria estabelecimento piloto padrão
        estab = Estabelecimento(
            id=payload.estabelecimento_id,
            nome_fantasia="Marmitaria Sabor da Vila",
            email_login="sabordavila@exemplo.com",
            senha_hash="hash_padrao",
            chave_pix="sabordavila.mei@exemplo.com",
            endereco_base="Rua das Acácias, 100"
        )
        db.add(estab)
        db.commit()

    novo_pedido = Pedido(
        estabelecimento_id=payload.estabelecimento_id,
        nome_cliente=payload.nome_cliente,
        telefone_cliente=payload.telefone_cliente,
        endereco_entrega=payload.endereco_entrega,
        resumo_itens=payload.resumo_itens,
        valor_total=payload.valor_total,
        status_pedido="aguardando_pix"
    )
    db.add(novo_pedido)
    db.commit()
    db.refresh(novo_pedido)
    return novo_pedido


@app.get("/estabelecimentos/{estabelecimento_id}/pedidos", response_model=List[PedidoResponse])
def listar_pedidos_cozinha(estabelecimento_id: int, db: Session = Depends(get_db)):
    """RF02: Painel da Cozinha para gestão dos pedidos em tempo real."""
    return db.query(Pedido).filter(Pedido.estabelecimento_id == estabelecimento_id).order_by(Pedido.id.desc()).all()


@app.patch("/pedidos/{pedido_id}/status", response_model=PedidoResponse)
def atualizar_status_pedido(pedido_id: int, payload: PedidoStatusUpdate, db: Session = Depends(get_db)):
    """RF02: Avançar status na esteira da cozinha."""
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")
    pedido.status_pedido = payload.status_pedido
    db.commit()
    db.refresh(pedido)
    return pedido


# ==========================================
# ROTAS: BOTÃO SOS & TURNO 50/50 (RF03 & RF04)
# ==========================================

@app.post("/estabelecimentos/{estabelecimento_id}/turnos-sos", response_model=TurnoResponse, status_code=status.HTTP_201_CREATED)
def disparar_botao_sos(estabelecimento_id: int, payload: TurnoSOSCreate, db: Session = Depends(get_db)):
    """RF03: Disparo emergencial do Botão SOS gerando PIN de balcão de 4 dígitos."""
    pin_gerado = f"{random.randint(1000, 9999)}"
    novo_turno = Turno(
        estabelecimento_id=estabelecimento_id,
        tipo_chamado=payload.tipo_chamado,
        valor_diaria=payload.valor_diaria,
        pin_balcao=pin_gerado,
        pin_validado=False,
        status_turno="aberto"
    )
    db.add(novo_turno)
    db.commit()
    db.refresh(novo_turno)
    return novo_turno


@app.post("/turnos/{turno_id}/validar-pin", response_model=TurnoResponse)
def validar_pin_balcao(turno_id: int, payload: TurnoValidarPIN, db: Session = Depends(get_db)):
    """RF04: Validação presencial do PIN liberando regra 50/50 e ativando o turno."""
    turno = db.query(Turno).filter(Turno.id == turno_id).first()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno não encontrado.")
    
    if turno.pin_balcao != payload.pin_digitado:
        raise HTTPException(status_code=400, detail="PIN de balcão incorreto!")
    
    turno.pin_validado = True
    turno.status_turno = "em_andamento"
    turno.iniciado_em = datetime.datetime.utcnow()
    db.commit()
    db.refresh(turno)
    return turno
