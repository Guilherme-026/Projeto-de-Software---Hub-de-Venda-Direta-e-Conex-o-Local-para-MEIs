import pytest
from pydantic import ValidationError
from app.schemas import (
    PedidoCreate,
    PedidoStatusUpdate,
    TurnoSOSCreate,
    TurnoValidarPIN,
    EstabelecimentoCreate,
    EntregadorCreate
)


def test_validar_criacao_pedido_sucesso():
    dados = {
        "estabelecimento_id": 1,
        "nome_cliente": "Carlos Mendes",
        "telefone_cliente": "11987654321",
        "endereco_entrega": "Rua das Acácias, 142",
        "resumo_itens": "2x Marmita Executivo Frango",
        "valor_total": 36.00
    }
    pedido = PedidoCreate(**dados)
    assert pedido.nome_cliente == "Carlos Mendes"
    assert pedido.valor_total == 36.00


def test_validar_pedido_valor_negativo_falha():
    dados = {
        "estabelecimento_id": 1,
        "nome_cliente": "Carlos Mendes",
        "telefone_cliente": "11987654321",
        "endereco_entrega": "Rua das Acácias, 142",
        "resumo_itens": "2x Marmita Executivo Frango",
        "valor_total": -10.00
    }
    with pytest.raises(ValidationError):
        PedidoCreate(**dados)


def test_validar_pin_balcao_4_digitos():
    # PIN válido de 4 dígitos
    turno_pin = TurnoValidarPIN(pin_digitado="4821")
    assert turno_pin.pin_digitado == "4821"

    # PIN inválido com letras ou tamanho diferente
    with pytest.raises(ValidationError):
        TurnoValidarPIN(pin_digitado="12a4")

    with pytest.raises(ValidationError):
        TurnoValidarPIN(pin_digitado="123")


def test_validar_status_pedido_permitidos():
    # Status válido
    update = PedidoStatusUpdate(status_pedido="em_preparo")
    assert update.status_pedido == "em_preparo"

    # Status inexistente
    with pytest.raises(ValidationError):
        PedidoStatusUpdate(status_pedido="status_invalido_qualquer")



def test_validar_estabelecimento_sucesso():
    dados = {
        "nome_fantasia": "Marmitaria Sabor da Vila",
        "email_login": "contato@sabordavila.com",
        "senha": "senha123456super",
        "chave_pix": "12345678000199",
        "endereco_base": "Rua das Acácias, 100",
        "latitude": -23.55,
        "longitude": -46.63
    }
    estab = EstabelecimentoCreate(**dados)
    assert estab.nome_fantasia == "Marmitaria Sabor da Vila"
    assert estab.email_login == "contato@sabordavila.com"


def test_validar_estabelecimento_email_invalido():
    dados = {
        "nome_fantasia": "Marmitaria Sabor da Vila",
        "email_login": "email_sem_arroba_e_ponto",
        "senha": "senha123456super",
        "chave_pix": "12345678000199",
        "endereco_base": "Rua das Acácias, 100"
    }
    with pytest.raises(ValidationError):
        EstabelecimentoCreate(**dados)


def test_validar_entregador_e_sos():
    dados_entregador = {
        "nome_completo": "Lucas Silva",
        "telefone_whatsapp": "11912345678",
        "senha": "senha_motoboy_forte",
        "chave_pix": "lucas@pix.com"
    }
    entregador = EntregadorCreate(**dados_entregador)
    assert entregador.nome_completo == "Lucas Silva"

    sos = TurnoSOSCreate(tipo_chamado="sos_emergencia", valor_diaria=90.0)
    assert sos.valor_diaria == 90.0

    with pytest.raises(ValidationError):
        TurnoSOSCreate(tipo_chamado="chamado_invalido", valor_diaria=-50.0)
