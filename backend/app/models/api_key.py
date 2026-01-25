from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import secrets
from ..database import Base

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)  # User-friendly name for the key
    key_prefix = Column(String, nullable=False)  # First 8 chars for display
    key_hash = Column(String, nullable=False)  # Hashed full key
    is_active = Column(Boolean, default=True)
    rate_limit = Column(Integer, default=1000)  # Requests per hour
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")
    usage_logs = relationship("APIUsage", back_populates="api_key", cascade="all, delete-orphan")

class APIUsage(Base):
    __tablename__ = "api_usage"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    api_key_id = Column(String, ForeignKey("api_keys.id"), nullable=False)
    endpoint = Column(String, nullable=False)
    method = Column(String, nullable=False)
    status_code = Column(Integer, nullable=False)
    response_time_ms = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    api_key = relationship("APIKey", back_populates="usage_logs")

def generate_api_key():
    """Generate a secure API key"""
    # Format: qcb_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (36 chars total)
    random_part = secrets.token_urlsafe(24)  # 32 chars in base64
    return f"qcb_{random_part}"

def hash_api_key(api_key: str) -> str:
    """Hash an API key for storage"""
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(api_key)

def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """Verify an API key against its hash"""
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_key, hashed_key)
