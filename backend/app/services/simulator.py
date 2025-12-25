from typing import Dict, List
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

class SimulatorService:
    def __init__(self):
        self.sim = AerSimulator()

    def build_circuit(self, gates: List[Dict], num_qubits: int) -> QuantumCircuit:
        qc = QuantumCircuit(num_qubits, num_qubits)
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
            # extend later
        qc.measure(range(num_qubits), range(num_qubits))
        return qc

    def simulate(self, gates: List[Dict], num_qubits: int, shots: int) -> Dict:
        qc = self.build_circuit(gates, num_qubits)
        job = self.sim.run(qc, shots=shots)
        result = job.result()
        counts = {k: int(v) for k, v in result.get_counts(qc).items()}
        probs = {k: v / shots for k, v in counts.items()}
        return {"counts": counts, "probabilities": probs, "total_shots": shots}
