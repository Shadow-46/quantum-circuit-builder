export default function CircuitCanvas({ gates, numQubits, onRemove }) {
  const renderGate = (g, idx, xOffset) => {
    const isTwoQubit = g.qubits.length === 2;
    const is2QubitGate = isTwoQubit && (g.type === "CNOT" || g.type === "CX");
    
    if (is2QubitGate) {
      const [control, target] = g.qubits;
      const minQ = Math.min(control, target);
      const maxQ = Math.max(control, target);
      return (
        <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
          {/* Vertical line connecting control and target */}
          <line
            x1="25"
            y1={50 + minQ * 60}
            x2="25"
            y2={50 + maxQ * 60}
            stroke="#667eea"
            strokeWidth="2"
          />
          {/* Control dot */}
          <circle cx="25" cy={50 + control * 60} r="6" fill="#667eea" />
          {/* Target circle with plus */}
          <circle cx="25" cy={50 + target * 60} r="15" fill="white" stroke="#667eea" strokeWidth="2" />
          <circle cx="25" cy={50 + target * 60} r="12" fill="none" stroke="#667eea" strokeWidth="2" />
          <line x1="25" y1={50 + target * 60 - 8} x2="25" y2={50 + target * 60 + 8} stroke="#667eea" strokeWidth="2" />
          <line x1="25 - 8" y1={50 + target * 60} x2="25 + 8" y2={50 + target * 60} stroke="#667eea" strokeWidth="2" />
          {/* Delete indicator */}
          <title>Click to remove {g.type} gate</title>
        </g>
      );
    } else if (isTwoQubit) {
      // SWAP or other 2-qubit gates
      const [q1, q2] = g.qubits;
      return (
        <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
          <line x1="25" y1={50 + q1 * 60} x2="25" y2={50 + q2 * 60} stroke="#667eea" strokeWidth="2" />
          <rect x="0" y={50 + q1 * 60 - 20} width="50" height="40" fill="#667eea" />
          <rect x="0" y={50 + q2 * 60 - 20} width="50" height="40" fill="#667eea" />
          <text x="25" y={50 + q1 * 60 + 5} fill="white" textAnchor="middle">{g.type}</text>
          <title>Click to remove {g.type} gate</title>
        </g>
      );
    } else {
      // Single-qubit gate
      const q = g.qubits[0];
      return (
        <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
          <rect x="0" y={50 + q * 60 - 20} width="50" height="40" fill="#667eea" />
          <text x="25" y={50 + q * 60 + 5} fill="white" textAnchor="middle">{g.type}</text>
          <title>Click to remove {g.type} gate</title>
        </g>
      );
    }
  };

  return (
    <div className="circuit-canvas">
      <svg width="700" height={numQubits * 60 + 40}>
        {Array.from({ length: numQubits }).map((_, i) => (
          <g key={i}>
            <line
              x1="40"
              y1={50 + i * 60}
              x2="660"
              y2={50 + i * 60}
              stroke="black"
            />
            <text x="10" y={55 + i * 60}>q{i}</text>
          </g>
        ))}
        {gates.map((g, idx) => renderGate(g, idx, 120 + idx * 70))}
      </svg>
      <ul>
        {gates.map((g, i) => (
          <li key={i}>
            {g.type} on q[{g.qubits.join(",")}]{" "}
            <button onClick={() => onRemove(i)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
