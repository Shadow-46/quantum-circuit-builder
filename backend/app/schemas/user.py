from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from ..models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: str
    avatar_url: Optional[str]
    bio: Optional[str]
    role: UserRole
    created_at: datetime
    last_login: Optional[datetime]
    is_active: bool
    email_verified: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
