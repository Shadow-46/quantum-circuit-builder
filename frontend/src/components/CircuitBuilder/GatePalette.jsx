const GATES = [
  { type: "H", desc: "Hadamard (superposition)" },
  { type: "X", desc: "Pauli-X" },
  { type: "Z", desc: "Pauli-Z" },
  { type: "CNOT", desc: "Controlled-NOT" },
];

export default function GatePalette({ onAdd }) {
  return (
    <div className="gate-palette">
      {GATES.map((g) => (
        <button key={g.type} onClick={() => onAdd(g.type)}>
          {g.type}
        </button>
      ))}
    </div>
  );
}
