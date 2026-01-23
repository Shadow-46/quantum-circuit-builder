from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from app.schemas import CircuitCreate, CircuitOut

router = APIRouter()

_db: dict[int, dict] = {}
_next_id = 1

@router.post("/", response_model=CircuitOut)
def create_circuit(body: CircuitCreate):
    global _next_id
    now = datetime.utcnow()
    data = {
        "id": _next_id,
        "name": body.name,
        "description": body.description,
        "num_qubits": body.num_qubits,
        "gates": [g.model_dump() for g in body.gates],
        "created_at": now,
        "updated_at": now,
    }
    _db[_next_id] = data
    _next_id += 1
    return data

@router.get("/", response_model=List[CircuitOut])
def list_circuits():
    return list(_db.values())

@router.get("/{cid}", response_model=CircuitOut)
def get_circuit(cid: int):
    if cid not in _db:
        raise HTTPException(404, "Not found")
    return _db[cid]
