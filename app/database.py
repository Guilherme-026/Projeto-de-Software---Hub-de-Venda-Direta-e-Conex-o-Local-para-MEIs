from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from typing import Generator
from app.config import settings

# SQLite exige check_same_thread=False para threads do FastAPI
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency Injection generator para fornecer a sessão SQLAlchemy em cada requisição.
    Garante fechamento seguro da conexão ao final do ciclo de vida da request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
