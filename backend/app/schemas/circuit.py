from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class VisibilityEnum(str, Enum):
    PRIVATE = "private"
    UNLISTED = "unlisted"
    PUBLIC = "public"

class Gate(BaseModel):
    type: str
    qubits: List[int]
    params: Optional[List[float]] = None

class CircuitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    num_qubits: int = Field(ge=1, le=12)
    gates: List[Gate]
    visibility: Optional[VisibilityEnum] = VisibilityEnum.PRIVATE
    tags: Optional[List[str]] = []

class CircuitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    circuit_data: Optional[Dict[str, Any]] = None
    visibility: Optional[VisibilityEnum] = None
    tags: Optional[List[str]] = None

class CircuitOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    num_qubits: int
    circuit_data: Dict[str, Any]
    visibility: VisibilityEnum
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CircuitVersionCreate(BaseModel):
    commit_message: str
    circuit_data: Dict[str, Any]

class CircuitVersionOut(BaseModel):
    id: str
    circuit_id: str
    version_number: int
    commit_message: str
    circuit_data: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    text: str
    position_x: Optional[int] = None
    position_y: Optional[int] = None

class CommentOut(BaseModel):
    id: str
    circuit_id: str
    user_id: str
    text: str
    position_x: Optional[int]
    position_y: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class LearningProgressCreate(BaseModel):
    path_id: str
    lesson_id: str
    status: str
    quiz_score: Optional[int] = None

class LearningProgressUpdate(BaseModel):
    status: Optional[str] = None
    quiz_score: Optional[int] = None
    completed_at: Optional[datetime] = None

class LearningProgressOut(BaseModel):
    id: str
    user_id: str
    path_id: str
    lesson_id: str
    status: str
    quiz_score: Optional[int]
    completed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AchievementCreate(BaseModel):
    achievement_id: str
    achievement_name: str
    achievement_description: Optional[str] = None
    points: int = 0

class AchievementOut(BaseModel):
    id: str
    user_id: str
    achievement_id: str
    achievement_name: str
    achievement_description: Optional[str]
    points: int
    unlocked_at: datetime
    
    class Config:
        from_attributes = True

class SimulationRequest(BaseModel):
    num_qubits: int = Field(ge=1, le=12)
    gates: List[Gate]
    shots: int = Field(1024, ge=1, le=8192)

class SimulationResult(BaseModel):
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    total_shots: int

