import pytest
from pydantic import ValidationError
from app.schemas import (
    PedidoCreate,
    PedidoStatusUpdate,
    TurnoSOSCreate,
    TurnoValidarPIN,
    EstabelecimentoCreate
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
