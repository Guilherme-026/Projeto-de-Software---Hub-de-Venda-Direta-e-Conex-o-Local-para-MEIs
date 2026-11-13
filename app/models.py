import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    CheckConstraint
)
from sqlalchemy.orm import relationship
from app.database import Base


class Estabelecimento(Base):
    __tablename__ = "estabelecimento"

    id = Column(Integer, primary_key=True, index=True)
    nome_fantasia = Column(String(120), nullable=False)
    email_login = Column(String(120), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    chave_pix = Column(String(100), nullable=False)
    endereco_base = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(20), default="ativo", nullable=False)  # "ativo" ou "inativo"
    criado_em = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    pedidos = relationship("Pedido", back_populates="estabelecimento", cascade="all, delete-orphan")
    turnos = relationship("Turno", back_populates="estabelecimento", cascade="all, delete-orphan")


class Pedido(Base):
    __tablename__ = "pedido"

    id = Column(Integer, primary_key=True, index=True)
    estabelecimento_id = Column(Integer, ForeignKey("estabelecimento.id", ondelete="CASCADE"), nullable=False)
    turno_id = Column(Integer, ForeignKey("turno.id", ondelete="SET NULL"), nullable=True)
    
    # Minimização LGPD: Não coletar CPF nem dados de pagamento sensíveis
    nome_cliente = Column(String(100), nullable=False)
    telefone_cliente = Column(String(30), nullable=False)
    endereco_entrega = Column(String(255), nullable=False)
    resumo_itens = Column(String(1000), nullable=False)
    valor_total = Column(Float, nullable=False)
    status_pedido = Column(String(30), default="aguardando_pix", nullable=False)
    # Status permitidos: "aguardando_pix", "em_preparo", "saiu_entrega", "concluido"
    criado_em = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("valor_total > 0", name="chk_pedido_valor_positivo"),
    )

    estabelecimento = relationship("Estabelecimento", back_populates="pedidos")
    turno = relationship("Turno", back_populates="pedidos")


class Entregador(Base):
    __tablename__ = "entregador"

    id = Column(Integer, primary_key=True, index=True)
    nome_completo = Column(String(120), nullable=False)
    telefone_whatsapp = Column(String(30), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    chave_pix = Column(String(100), nullable=False)
    strikes_acumulados = Column(Integer, default=0, nullable=False)
    bloqueado_ate = Column(DateTime, nullable=True)  # Se strikes >= 3, bloqueio temporário (ex: 7 dias)
    disponivel_sos = Column(Boolean, default=True, nullable=False)
    latitude_atual = Column(Float, nullable=True)
    longitude_atual = Column(Float, nullable=True)
    criado_em = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    turnos = relationship("Turno", back_populates="entregador")

    @property
    def esta_bloqueado(self) -> bool:
        if self.bloqueado_ate and self.bloqueado_ate > datetime.datetime.utcnow():
            return True
        return False


class Turno(Base):
    __tablename__ = "turno"

    id = Column(Integer, primary_key=True, index=True)
    estabelecimento_id = Column(Integer, ForeignKey("estabelecimento.id", ondelete="CASCADE"), nullable=False)
    entregador_id = Column(Integer, ForeignKey("entregador.id", ondelete="SET NULL"), nullable=True)
    
    tipo_chamado = Column(String(30), default="sos_emergencia", nullable=False)
    # "turno_agendado" ou "sos_emergencia"
    valor_diaria = Column(Float, nullable=False)
    pin_balcao = Column(String(4), nullable=False)  # PIN de 4 dígitos para validação presencial
    pin_validado = Column(Boolean, default=False, nullable=False)
    entregas_realizadas = Column(Integer, default=0, nullable=False)
    status_turno = Column(String(30), default="aberto", nullable=False)
    # "aberto", "aceito", "em_andamento", "concluido", "cancelado"
    criado_em = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    iniciado_em = Column(DateTime, nullable=True)
    finalizado_em = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint("valor_diaria > 0", name="chk_turno_valor_positivo"),
    )

    estabelecimento = relationship("Estabelecimento", back_populates="turnos")
    entregador = relationship("Entregador", back_populates="turnos")
    pedidos = relationship("Pedido", back_populates="turno")
