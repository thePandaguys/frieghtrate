from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from fastapi import HTTPException

from .config import get_settings


class Base(DeclarativeBase):
    pass


def get_session_factory():
    url = get_settings().database_url
    return sessionmaker(bind=create_engine(url, pool_pre_ping=True), autoflush=False, autocommit=False) if url else None


def get_db() -> Generator[Session, None, None]:
    factory = get_session_factory()
    if factory is None:
        raise HTTPException(status_code=503, detail="DATABASE_URL is not configured")
    db = factory()
    try:
        yield db
    finally:
        db.close()
