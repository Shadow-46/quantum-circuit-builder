from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./quantum_builder.db"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    DEBUG: bool = True
    SECRET_KEY: str = "dev-secret"

    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()
