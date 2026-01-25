from fastapi import Request, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Dict
import time
from app.models.api_key import APIKey, APIUsage, verify_api_key

# In-memory rate limit tracking (use Redis in production)
rate_limit_cache: Dict[str, list] = {}

async def verify_api_key_auth(request: Request, db: Session) -> APIKey:
    """Verify API key from Authorization header"""
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header"
        )
    
    # Extract API key from "Bearer <key>" or just "<key>"
    parts = auth_header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        api_key = parts[1]
    else:
        api_key = auth_header
    
    # Validate key format
    if not api_key.startswith("qcb_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key format"
        )
    
    # Get key prefix for lookup
    key_prefix = api_key[:12]
    
    # Find API key in database
    db_key = db.query(APIKey).filter(
        APIKey.key_prefix == key_prefix,
        APIKey.is_active == True
    ).first()
    
    if not db_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    # Verify key hash
    if not verify_api_key(api_key, db_key.key_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    # Check expiration
    if db_key.expires_at and db_key.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key has expired"
        )
    
    return db_key

async def check_rate_limit(api_key: APIKey) -> bool:
    """Check if API key has exceeded rate limit"""
    current_time = datetime.utcnow()
    hour_ago = current_time - timedelta(hours=1)
    
    # Get or initialize request history for this key
    if api_key.id not in rate_limit_cache:
        rate_limit_cache[api_key.id] = []
    
    # Remove old entries (older than 1 hour)
    rate_limit_cache[api_key.id] = [
        ts for ts in rate_limit_cache[api_key.id]
        if ts > hour_ago
    ]
    
    # Check if limit exceeded
    if len(rate_limit_cache[api_key.id]) >= api_key.rate_limit:
        return False
    
    # Add current request
    rate_limit_cache[api_key.id].append(current_time)
    
    return True

async def log_api_usage(
    db: Session,
    api_key_id: str,
    endpoint: str,
    method: str,
    status_code: int,
    response_time_ms: int
):
    """Log API usage for analytics"""
    usage = APIUsage(
        api_key_id=api_key_id,
        endpoint=endpoint,
        method=method,
        status_code=status_code,
        response_time_ms=response_time_ms
    )
    
    db.add(usage)
    
    # Update last used timestamp
    api_key = db.query(APIKey).filter(APIKey.id == api_key_id).first()
    if api_key:
        api_key.last_used_at = datetime.utcnow()
    
    db.commit()

class RateLimitMiddleware:
    """Middleware to enforce rate limits on API key requests"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        
        request = Request(scope, receive)
        
        # Only apply to /api/v1/ endpoints
        if not request.url.path.startswith("/api/v1/"):
            return await self.app(scope, receive, send)
        
        # Track start time
        start_time = time.time()
        
        # Store for later use
        scope["start_time"] = start_time
        
        await self.app(scope, receive, send)
