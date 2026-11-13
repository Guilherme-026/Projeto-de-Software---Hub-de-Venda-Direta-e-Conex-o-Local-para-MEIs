import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import Estabelecimento, Pedido, Entregador, Turno

TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def db_session():
    """Cria um banco SQLite em memória isolado para cada teste."""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def test_criar_estabelecimento(db_session):
    estab = Estabelecimento(
        nome_fantasia="Marmitaria Sabor da Vila",
        email_login="contato@sabordavila.com",
        senha_hash="hash_super_seguro",
        chave_pix="12345678000199",
        endereco_base="Rua das Acácias, 100",
        latitude=-23.55052,
        longitude=-46.633308,
        status="ativo"
    )
    db_session.add(estab)
    db_session.commit()
    db_session.refresh(estab)

    assert estab.id is not None
    assert estab.nome_fantasia == "Marmitaria Sabor da Vila"
    assert estab.status == "ativo"


def test_criar_pedido_e_relacionamento(db_session):
    estab = Estabelecimento(
        nome_fantasia="Marmitaria Sabor da Vila",
        email_login="contato@sabordavila.com",
        senha_hash="hash_super_seguro",
        chave_pix="12345678000199",
        endereco_base="Rua das Acácias, 100"
    )
    db_session.add(estab)
    db_session.commit()

    pedido = Pedido(
        estabelecimento_id=estab.id,
        nome_cliente="Carlos Mendes",
        telefone_cliente="11987654321",
        endereco_entrega="Rua das Flores, 45",
        resumo_itens="2x Marmita Executivo Frango",
        valor_total=36.0,
        status_pedido="aguardando_pix"
    )
    db_session.add(pedido)
    db_session.commit()
    db_session.refresh(pedido)

    assert pedido.id is not None
    assert pedido.estabelecimento.nome_fantasia == "Marmitaria Sabor da Vila"
    assert pedido.valor_total == 36.0
    assert pedido.status_pedido == "aguardando_pix"


def test_criar_entregador_e_turno_sos(db_session):
    estab = Estabelecimento(
        nome_fantasia="Marmitaria Sabor da Vila",
        email_login="contato@sabordavila.com",
        senha_hash="hash_super_seguro",
        chave_pix="12345678000199",
        endereco_base="Rua das Acácias, 100"
    )
    entregador = Entregador(
        nome_completo="Lucas Silva",
        telefone_whatsapp="11912345678",
        senha_hash="hash_senha_motoboy",
        chave_pix="lucas@pix.com",
        disponivel_sos=True
    )
    db_session.add_all([estab, entregador])
    db_session.commit()

    turno = Turno(
        estabelecimento_id=estab.id,
        entregador_id=entregador.id,
        tipo_chamado="sos_emergencia",
        valor_diaria=80.0,
        pin_balcao="4821",
        status_turno="aceito"
    )
    db_session.add(turno)
    db_session.commit()
    db_session.refresh(turno)

    assert turno.id is not None
    assert turno.pin_balcao == "4821"
    assert turno.pin_validado is False
    assert turno.entregador.nome_completo == "Lucas Silva"
