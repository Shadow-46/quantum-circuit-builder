from fastapi import APIRouter, HTTPException
from app.schemas import SimulationRequest, SimulationResult
from app.services import SimulatorService
from app.utils.constants import (
    ALL_SUPPORTED_GATES,
    ROTATION_GATES,
    TWO_QUBIT_GATES,
    SINGLE_QUBIT_GATES,
)

router = APIRouter()
sim = SimulatorService()


def validate_gate(gate: dict, num_qubits: int, gate_idx: int) -> None:
    """Validate a single gate configuration."""
    gate_type = gate["type"].upper()
    qubits = gate["qubits"]
    params = gate.get("params") or []
    
    # Check if gate type is supported
    if gate_type not in ALL_SUPPORTED_GATES:
        raise HTTPException(
            status_code=400,
            detail=f"Gate #{gate_idx}: Unsupported gate type '{gate_type}'. "
                   f"Supported gates: {', '.join(sorted(ALL_SUPPORTED_GATES))}"
        )
    
    # Check qubit indices are valid
    for q in qubits:
        if q < 0 or q >= num_qubits:
            raise HTTPException(
                status_code=400,
                detail=f"Gate #{gate_idx} ({gate_type}): Invalid qubit index {q}. "
                       f"Must be between 0 and {num_qubits - 1}."
            )
    
    # Check correct number of qubits for gate type
    if gate_type in SINGLE_QUBIT_GATES or gate_type in ROTATION_GATES:
        if len(qubits) != 1:
            raise HTTPException(
                status_code=400,
                detail=f"Gate #{gate_idx} ({gate_type}): Single-qubit gate requires exactly 1 qubit, got {len(qubits)}."
            )
    elif gate_type in TWO_QUBIT_GATES:
        if len(qubits) != 2:
            raise HTTPException(
                status_code=400,
                detail=f"Gate #{gate_idx} ({gate_type}): Two-qubit gate requires exactly 2 qubits, got {len(qubits)}."
            )
        if qubits[0] == qubits[1]:
            raise HTTPException(
                status_code=400,
                detail=f"Gate #{gate_idx} ({gate_type}): Control and target qubits must be different."
            )
    
    # Check rotation gates have required parameters
    if gate_type in ROTATION_GATES:
        if not params or len(params) < 1:
            raise HTTPException(
                status_code=400,
                detail=f"Gate #{gate_idx} ({gate_type}): Rotation gate requires angle parameter."
            )


@router.post("/", response_model=SimulationResult)
def simulate(req: SimulationRequest):
    try:
        # Validate all gates
        for idx, gate in enumerate(req.gates):
            gate_dict = gate.model_dump()
            validate_gate(gate_dict, req.num_qubits, idx)
        
        gates = [g.model_dump() for g in req.gates]
        result = sim.simulate(gates, req.num_qubits, req.shots)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
