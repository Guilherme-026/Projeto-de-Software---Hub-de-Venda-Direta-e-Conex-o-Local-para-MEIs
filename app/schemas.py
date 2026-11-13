from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


# ==========================================
# SCHEMAS: ESTABELECIMENTO
# ==========================================

class EstabelecimentoBase(BaseModel):
    nome_fantasia: str = Field(..., min_length=2, max_length=120)
    email_login: EmailStr
    chave_pix: str = Field(..., min_length=5, max_length=100)
    endereco_base: str = Field(..., min_length=5, max_length=255)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class EstabelecimentoCreate(EstabelecimentoBase):
    senha: str = Field(..., min_length=6, max_length=100)


class EstabelecimentoResponse(EstabelecimentoBase):
    id: int
    status: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMAS: PEDIDO (RF01 & RF02)
# ==========================================

class PedidoCreate(BaseModel):
    estabelecimento_id: int
    nome_cliente: str = Field(..., min_length=2, max_length=100)
    telefone_cliente: str = Field(..., min_length=8, max_length=30)
    endereco_entrega: str = Field(..., min_length=5, max_length=255)
    resumo_itens: str = Field(..., min_length=3, max_length=1000)
    valor_total: float = Field(..., gt=0, description="Valor deve ser estritamente positivo")


class PedidoStatusUpdate(BaseModel):
    status_pedido: str = Field(..., pattern="^(aguardando_pix|em_preparo|saiu_entrega|concluido)$")


class PedidoResponse(BaseModel):
    id: int
    estabelecimento_id: int
    turno_id: Optional[int] = None
    nome_cliente: str
    telefone_cliente: str
    endereco_entrega: str
    resumo_itens: str
    valor_total: float
    status_pedido: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMAS: ENTREGADOR & SOS (RF03 & RF04)
# ==========================================

class EntregadorCreate(BaseModel):
    nome_completo: str = Field(..., min_length=2, max_length=120)
    telefone_whatsapp: str = Field(..., min_length=9, max_length=30)
    senha: str = Field(..., min_length=6, max_length=100)
    chave_pix: str = Field(..., min_length=5, max_length=100)


class EntregadorResponse(BaseModel):
    id: int
    nome_completo: str
    telefone_whatsapp: str
    chave_pix: str
    strikes_acumulados: int
    disponivel_sos: bool

    model_config = ConfigDict(from_attributes=True)


class TurnoSOSCreate(BaseModel):
    tipo_chamado: str = Field(default="sos_emergencia", pattern="^(sos_emergencia|turno_agendado)$")
    valor_diaria: float = Field(..., gt=0, description="Valor da diária deve ser positivo")


class TurnoValidarPIN(BaseModel):
    pin_digitado: str = Field(..., min_length=4, max_length=4, pattern="^[0-9]{4}$")


class TurnoResponse(BaseModel):
    id: int
    estabelecimento_id: int
    entregador_id: Optional[int] = None
    tipo_chamado: str
    valor_diaria: float
    pin_balcao: str
    pin_validado: bool
    entregas_realizadas: int
    status_turno: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)
