from fastapi import APIRouter
from typing import Dict, List

router = APIRouter()

# Predefined circuit templates
TEMPLATES = {
    "bell-state": {
        "name": "Bell State",
        "description": "Creates an entangled Bell state (EPR pair) between two qubits",
        "num_qubits": 2,
        "gates": [
            {"type": "H", "qubits": [0], "params": None},
            {"type": "CNOT", "qubits": [0, 1], "params": None},
        ],
        "category": "entanglement",
        "difficulty": "beginner",
    },
    "ghz-state": {
        "name": "GHZ State",
        "description": "Creates a 3-qubit GHZ (Greenberger–Horne–Zeilinger) entangled state",
        "num_qubits": 3,
        "gates": [
            {"type": "H", "qubits": [0], "params": None},
            {"type": "CNOT", "qubits": [0, 1], "params": None},
            {"type": "CNOT", "qubits": [0, 2], "params": None},
        ],
        "category": "entanglement",
        "difficulty": "beginner",
    },
    "superposition": {
        "name": "Superposition",
        "description": "Places a single qubit in equal superposition of |0⟩ and |1⟩",
        "num_qubits": 1,
        "gates": [
            {"type": "H", "qubits": [0], "params": None},
        ],
        "category": "basics",
        "difficulty": "beginner",
    },
    "deutsch-jozsa": {
        "name": "Deutsch–Jozsa (Balanced)",
        "description": "Deutsch–Jozsa algorithm for a balanced oracle (2 qubits)",
        "num_qubits": 2,
        "gates": [
            {"type": "X", "qubits": [1], "params": None},
            {"type": "H", "qubits": [0], "params": None},
            {"type": "H", "qubits": [1], "params": None},
            {"type": "CNOT", "qubits": [0, 1], "params": None},  # Oracle (balanced)
            {"type": "H", "qubits": [0], "params": None},
        ],
        "category": "algorithms",
        "difficulty": "intermediate",
    },
    "quantum-teleportation": {
        "name": "Quantum Teleportation",
        "description": "Teleports quantum state from q0 to q2 using q1 as auxiliary",
        "num_qubits": 3,
        "gates": [
            # Prepare Bell pair between q1 and q2
            {"type": "H", "qubits": [1], "params": None},
            {"type": "CNOT", "qubits": [1, 2], "params": None},
            # Entangle q0 with q1
            {"type": "CNOT", "qubits": [0, 1], "params": None},
            {"type": "H", "qubits": [0], "params": None},
        ],
        "category": "protocols",
        "difficulty": "advanced",
    },
    "qft-3qubit": {
        "name": "Quantum Fourier Transform (3 qubits)",
        "description": "3-qubit Quantum Fourier Transform circuit",
        "num_qubits": 3,
        "gates": [
            {"type": "H", "qubits": [0], "params": None},
            {"type": "RZ", "qubits": [0], "params": [1.5708]},  # π/2
            {"type": "CNOT", "qubits": [1, 0], "params": None},
            {"type": "RZ", "qubits": [0], "params": [-1.5708]},
            {"type": "CNOT", "qubits": [1, 0], "params": None},
            {"type": "H", "qubits": [1], "params": None},
            {"type": "RZ", "qubits": [1], "params": [0.7854]},  # π/4
            {"type": "CNOT", "qubits": [2, 1], "params": None},
            {"type": "RZ", "qubits": [1], "params": [-0.7854]},
            {"type": "CNOT", "qubits": [2, 1], "params": None},
            {"type": "H", "qubits": [2], "params": None},
            {"type": "SWAP", "qubits": [0, 2], "params": None},
        ],
        "category": "algorithms",
        "difficulty": "advanced",
    },
}


@router.get("/templates")
def list_templates():
    """List all available circuit templates."""
    return {
        "templates": TEMPLATES,
        "categories": list(set(t["category"] for t in TEMPLATES.values())),
    }


@router.get("/templates/{template_id}")
def get_template(template_id: str):
    """Get a specific circuit template by ID."""
    if template_id not in TEMPLATES:
        return {"error": "Template not found"}, 404
    return TEMPLATES[template_id]


# Legacy endpoint for backward compatibility
@router.get("/")
def list_algorithms():
    """Legacy endpoint - redirects to templates."""
    return {
        "message": "Use /api/algorithms/templates for circuit templates",
        "templates": list(TEMPLATES.keys()),
    }

