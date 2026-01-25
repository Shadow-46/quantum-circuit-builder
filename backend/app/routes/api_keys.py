from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.models.api_key import APIKey, generate_api_key, hash_api_key
from app.utils.auth import get_current_active_user

router = APIRouter()

# Schemas
class APIKeyCreate(BaseModel):
    name: str
    rate_limit: int = 1000
    expires_in_days: int | None = None

class APIKeyOut(BaseModel):
    id: str
    name: str
    key_prefix: str
    is_active: bool
    rate_limit: int
    created_at: datetime
    last_used_at: datetime | None
    expires_at: datetime | None
    
    class Config:
        from_attributes = True

class APIKeyWithSecret(APIKeyOut):
    key: str  # Only returned once on creation

class APIKeyUpdate(BaseModel):
    name: str | None = None
    is_active: bool | None = None
    rate_limit: int | None = None

# Routes
@router.post("/api-keys", response_model=APIKeyWithSecret)
def create_api_key(
    body: APIKeyCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new API key for the authenticated user"""
    # Check if user already has 10 active keys (limit)
    active_keys_count = db.query(APIKey).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).count()
    
    if active_keys_count >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum number of active API keys (10) reached"
        )
    
    # Generate new API key
    api_key = generate_api_key()
    key_prefix = api_key[:12]  # qcb_XXXXXXXX
    key_hash = hash_api_key(api_key)
    
    # Calculate expiration
    expires_at = None
    if body.expires_in_days:
        expires_at = datetime.utcnow() + timedelta(days=body.expires_in_days)
    
    # Create API key record
    db_api_key = APIKey(
        user_id=current_user.id,
        name=body.name,
        key_prefix=key_prefix,
        key_hash=key_hash,
        rate_limit=body.rate_limit,
        expires_at=expires_at
    )
    
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    
    # Return key with secret (only time it's visible)
    result = APIKeyWithSecret(
        id=db_api_key.id,
        name=db_api_key.name,
        key_prefix=db_api_key.key_prefix,
        is_active=db_api_key.is_active,
        rate_limit=db_api_key.rate_limit,
        created_at=db_api_key.created_at,
        last_used_at=db_api_key.last_used_at,
        expires_at=db_api_key.expires_at,
        key=api_key
    )
    
    return result

@router.get("/api-keys", response_model=List[APIKeyOut])
def list_api_keys(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all API keys for the authenticated user"""
    keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id
    ).order_by(APIKey.created_at.desc()).all()
    
    return keys

@router.get("/api-keys/{key_id}", response_model=APIKeyOut)
def get_api_key(
    key_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific API key"""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    return api_key

@router.patch("/api-keys/{key_id}", response_model=APIKeyOut)
def update_api_key(
    key_id: str,
    body: APIKeyUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an API key"""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    if body.name is not None:
        api_key.name = body.name
    if body.is_active is not None:
        api_key.is_active = body.is_active
    if body.rate_limit is not None:
        api_key.rate_limit = body.rate_limit
    
    db.commit()
    db.refresh(api_key)
    
    return api_key

@router.delete("/api-keys/{key_id}")
def delete_api_key(
    key_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an API key"""
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    db.delete(api_key)
    db.commit()
    
    return {"message": "API key deleted successfully"}

@router.get("/api-keys/{key_id}/usage")
def get_api_key_usage(
    key_id: str,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get usage statistics for an API key"""
    from app.models.api_key import APIUsage
    from sqlalchemy import func
    
    # Verify ownership
    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    # Get recent usage
    recent_usage = db.query(APIUsage).filter(
        APIUsage.api_key_id == key_id
    ).order_by(APIUsage.timestamp.desc()).limit(limit).all()
    
    # Get statistics
    total_requests = db.query(func.count(APIUsage.id)).filter(
        APIUsage.api_key_id == key_id
    ).scalar()
    
    avg_response_time = db.query(func.avg(APIUsage.response_time_ms)).filter(
        APIUsage.api_key_id == key_id
    ).scalar()
    
    return {
        "total_requests": total_requests or 0,
        "avg_response_time_ms": float(avg_response_time) if avg_response_time else 0,
        "recent_usage": [
            {
                "endpoint": u.endpoint,
                "method": u.method,
                "status_code": u.status_code,
                "response_time_ms": u.response_time_ms,
                "timestamp": u.timestamp
            }
            for u in recent_usage
        ]
    }
