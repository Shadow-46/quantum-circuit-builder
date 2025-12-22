from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class Gate(BaseModel):
    type: str
    qubits: List[int]
    params: Optional[List[float]] = None

class CircuitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    num_qubits: int = Field(ge=1, le=12)
    gates: List[Gate]

class CircuitOut(CircuitCreate):
    id: int
    created_at: datetime
    updated_at: datetime

class SimulationRequest(BaseModel):
    num_qubits: int = Field(ge=1, le=12)
    gates: List[Gate]
    shots: int = Field(1024, ge=1, le=8192)

class SimulationResult(BaseModel):
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    total_shots: int
