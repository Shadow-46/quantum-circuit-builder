import { useState } from "react";

export default function GatePalette({ onAdd, numQubits }) {
  const [selectedQubit, setSelectedQubit] = useState(0);

  const GATES = [
    { type: "H", desc: "Hadamard", numQubits: 1 },
    { type: "X", desc: "Pauli-X", numQubits: 1 },
    { type: "Y", desc: "Pauli-Y", numQubits: 1 },
    { type: "Z", desc: "Pauli-Z", numQubits: 1 },
    { type: "CNOT", desc: "Controlled-NOT", numQubits: 2 },
    { type: "SWAP", desc: "Swap", numQubits: 2 },
  ];

  const handleAddGate = (gate) => {
    if (gate.numQubits === 1) {
      onAdd({ type: gate.type, qubits: [selectedQubit] });
    } else if (gate.numQubits === 2) {
      // For 2-qubit gates, use selected qubit as control, next as target
      const target = (selectedQubit + 1) % numQubits;
      onAdd({ type: gate.type, qubits: [selectedQubit, target] });
    }
  };

  return (
    <div className="gate-palette">
      <div className="qubit-selector">
        <label>Target Qubit:</label>
        <select value={selectedQubit} onChange={(e) => setSelectedQubit(Number(e.target.value))}>
          {Array.from({ length: numQubits }).map((_, i) => (
            <option key={i} value={i}>q{i}</option>
          ))}
        </select>
      </div>

      <div className="gates">
        {GATES.map((g) => (
          <button key={g.type} onClick={() => handleAddGate(g)} title={g.desc}>
            {g.type}
          </button>
        ))}
      </div>
    </div>
  );
}
