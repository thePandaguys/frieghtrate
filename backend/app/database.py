from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


class Base(DeclarativeBase):
    pass


_engine = None
_factory = None


def _get_factory():
    global _engine, _factory
    if _factory is None:
        url = get_settings().database_url
        if not url:
            return None
        try:
            _engine = create_engine(url, pool_pre_ping=True, connect_args={"check_same_thread": False} if url.startswith("sqlite") else {})
            _factory = sessionmaker(bind=_engine, autoflush=False, autocommit=False)
        except Exception:
            # Fallback to local SQLite if postgresql driver or server is unavailable
            sqlite_path = Path(__file__).resolve().parents[2] / 'freight_history.db'
            fallback_url = f"sqlite:///{sqlite_path.as_posix()}"
            _engine = create_engine(fallback_url, pool_pre_ping=True, connect_args={"check_same_thread": False})
            _factory = sessionmaker(bind=_engine, autoflush=False, autocommit=False)
    return _factory


def init_db() -> None:
    """Create all tables at startup (zero-config persistence)."""
    factory = _get_factory()
    if factory is None:
        return
    from . import history_models  # noqa: F401  (register mappers)
    from .database import Base
    Base.metadata.create_all(_engine)


def get_db() -> Generator[Session, None, None]:
    factory = _get_factory()
    if factory is None:
        raise RuntimeError("DATABASE_URL is not configured")
    db = factory()
    try:
        yield db
    finally:
        db.close()
