from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.schemas import Gate

router = APIRouter()


class ExportRequest(BaseModel):
    num_qubits: int
    gates: List[Gate]
    format: str = "qiskit"  # Future: "cirq", "pyquil", etc.


def generate_qiskit_code(num_qubits: int, gates: List[dict]) -> str:
    """Generate Qiskit Python code from circuit definition."""
    lines = [
        "from qiskit import QuantumCircuit",
        "from qiskit_aer import AerSimulator",
        "import numpy as np",
        "",
        f"# Create quantum circuit with {num_qubits} qubits",
        f"qc = QuantumCircuit({num_qubits}, {num_qubits})",
        "",
    ]
    
    # Add gates
    for gate in gates:
        gate_type = gate["type"].upper()
        qubits = gate["qubits"]
        params = gate.get("params") or []
        
        if gate_type == "H":
            lines.append(f"qc.h({qubits[0]})")
        elif gate_type == "X":
            lines.append(f"qc.x({qubits[0]})")
        elif gate_type == "Y":
            lines.append(f"qc.y({qubits[0]})")
        elif gate_type == "Z":
            lines.append(f"qc.z({qubits[0]})")
        elif gate_type == "S":
            lines.append(f"qc.s({qubits[0]})")
        elif gate_type == "T":
            lines.append(f"qc.t({qubits[0]})")
        elif gate_type in ["CNOT", "CX"]:
            lines.append(f"qc.cx({qubits[0]}, {qubits[1]})")
        elif gate_type == "SWAP":
            lines.append(f"qc.swap({qubits[0]}, {qubits[1]})")
        elif gate_type == "CZ":
            lines.append(f"qc.cz({qubits[0]}, {qubits[1]})")
        elif gate_type == "RX" and params:
            lines.append(f"qc.rx({params[0]}, {qubits[0]})")
        elif gate_type == "RY" and params:
            lines.append(f"qc.ry({params[0]}, {qubits[0]})")
        elif gate_type == "RZ" and params:
            lines.append(f"qc.rz({params[0]}, {qubits[0]})")
    
    lines.extend([
        "",
        "# Add measurements",
        f"qc.measure(range({num_qubits}), range({num_qubits}))",
        "",
        "# Simulate",
        "simulator = AerSimulator()",
        "job = simulator.run(qc, shots=1024)",
        "result = job.result()",
        "counts = result.get_counts(qc)",
        "",
        "# Print results",
        "print('Measurement results:')",
        "for outcome, count in counts.items():",
        "    print(f'{outcome}: {count}')",
        "",
        "# Draw circuit",
        "print('\\nCircuit:')",
        "print(qc.draw(output='text'))",
    ])
    
    return "\n".join(lines)


@router.post("/qiskit")
def export_qiskit(req: ExportRequest):
    """Export circuit as Qiskit Python code."""
    try:
        gates = [g.model_dump() for g in req.gates]
        code = generate_qiskit_code(req.num_qubits, gates)
        return {
            "code": code,
            "language": "python",
            "framework": "qiskit",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
