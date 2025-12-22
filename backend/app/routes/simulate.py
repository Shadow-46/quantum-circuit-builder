from fastapi import APIRouter, HTTPException
from app.schemas import SimulationRequest, SimulationResult
from app.services import SimulatorService

router = APIRouter()
sim = SimulatorService()

@router.post("/", response_model=SimulationResult)
def simulate(req: SimulationRequest):
    try:
        gates = [g.model_dump() for g in req.gates]
        result = sim.simulate(gates, req.num_qubits, req.shots)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
