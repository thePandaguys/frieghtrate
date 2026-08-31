from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"
    # Default to a local SQLite file so prediction history works with zero configuration.
    database_url: str | None = f"sqlite:///{Path(__file__).resolve().parents[2] / 'freight_history.db'}"
    cors_origins: str = "http://localhost:8081,http://localhost:19006,http://localhost:8000"
    model_directory: Path = Path(__file__).resolve().parents[2] / "models"
    market_data_mode: str = "reference-curve"   # 'reference-curve' | 'live' (adapters pending)
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
