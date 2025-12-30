from typing import Dict, List
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector, DensityMatrix
import numpy as np

class SimulatorService:
    def __init__(self):
        self.sim = AerSimulator()

    def build_circuit(self, gates: List[Dict], num_qubits: int, add_measurement: bool = True) -> QuantumCircuit:
        qc = QuantumCircuit(num_qubits, num_qubits if add_measurement else 0)
        for gate in gates:
            t = gate["type"].upper()
            qs = gate["qubits"]
            params = gate.get("params") or []
            if t == "X":
                qc.x(qs[0])
            elif t == "Y":
                qc.y(qs[0])
            elif t == "Z":
                qc.z(qs[0])
            elif t == "H":
                qc.h(qs[0])
            elif t == "CNOT" or t == "CX":
                qc.cx(qs[0], qs[1])
            elif t == "SWAP":
                qc.swap(qs[0], qs[1])
            elif t == "RX" and params:
                qc.rx(params[0], qs[0])
            elif t == "RY" and params:
                qc.ry(params[0], qs[0])
            elif t == "RZ" and params:
                qc.rz(params[0], qs[0])
            elif t == "S":
                qc.s(qs[0])
            elif t == "T":
                qc.t(qs[0])
            elif t == "CZ":
                qc.cz(qs[0], qs[1])
        if add_measurement:
            qc.measure(range(num_qubits), range(num_qubits))
        return qc

    def simulate(self, gates: List[Dict], num_qubits: int, shots: int) -> Dict:
        qc = self.build_circuit(gates, num_qubits)
        job = self.sim.run(qc, shots=shots)
        result = job.result()
        counts = {k: int(v) for k, v in result.get_counts(qc).items()}
        probs = {k: v / shots for k, v in counts.items()}
        return {"counts": counts, "probabilities": probs, "total_shots": shots}

    def get_statevector(self, gates: List[Dict], num_qubits: int) -> Dict:
        """Get the statevector of the circuit without measurement."""
        qc = self.build_circuit(gates, num_qubits, add_measurement=False)
        statevector = Statevector.from_instruction(qc)
        
        # Convert to list format with real and imaginary parts
        state_data = []
        for i, amp in enumerate(statevector.data):
            state_data.append({
                "index": i,
                "basis": format(i, f'0{num_qubits}b'),
                "real": float(np.real(amp)),
                "imag": float(np.imag(amp)),
                "magnitude": float(np.abs(amp)),
                "phase": float(np.angle(amp)),
                "probability": float(np.abs(amp) ** 2)
            })
        
        return {
            "num_qubits": num_qubits,
            "dimension": 2 ** num_qubits,
            "statevector": state_data
        }

    def get_bloch_vector(self, gates: List[Dict], qubit_index: int = 0) -> Dict:
        """Calculate Bloch sphere coordinates for a single qubit."""
        # For single qubit, get the statevector
        num_qubits = max(max(g["qubits"]) for g in gates) + 1 if gates else 1
        
        qc = self.build_circuit(gates, num_qubits, add_measurement=False)
        statevector = Statevector.from_instruction(qc)
        
        # Get density matrix for the specific qubit (trace out others)
        if num_qubits == 1:
            rho = DensityMatrix(statevector)
        else:
            # Partial trace to get single qubit state
            qubits_to_trace = [i for i in range(num_qubits) if i != qubit_index]
            rho = DensityMatrix(statevector).partial_trace(qubits_to_trace)
        
        # Calculate Bloch vector coordinates
        # For a single qubit: |ψ⟩ = α|0⟩ + β|1⟩
        # Bloch coordinates: x = 2Re(α*β), y = 2Im(α*β), z = |α|² - |β|²
        rho_matrix = rho.data
        
        x = 2 * np.real(rho_matrix[0, 1])
        y = 2 * np.imag(rho_matrix[0, 1])
        z = np.real(rho_matrix[0, 0] - rho_matrix[1, 1])
        
        return {
            "qubit_index": qubit_index,
            "x": float(x),
            "y": float(y),
            "z": float(z),
            "is_pure": float(np.trace(rho_matrix @ rho_matrix).real) > 0.999
        }

    def get_density_matrix(self, gates: List[Dict], num_qubits: int) -> Dict:
        """Get the density matrix of the circuit."""
        qc = self.build_circuit(gates, num_qubits, add_measurement=False)
        statevector = Statevector.from_instruction(qc)
        rho = DensityMatrix(statevector)
        
        # Convert to nested list format
        matrix_data = []
        for i in range(rho.dim):
            row = []
            for j in range(rho.dim):
                val = rho.data[i, j]
                row.append({
                    "real": float(np.real(val)),
                    "imag": float(np.imag(val)),
                    "magnitude": float(np.abs(val))
                })
            matrix_data.append(row)
        
        return {
            "num_qubits": num_qubits,
            "dimension": rho.dim,
            "matrix": matrix_data,
            "purity": float(np.trace(rho.data @ rho.data).real)
        }
