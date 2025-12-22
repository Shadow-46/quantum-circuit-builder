export default function CircuitCanvas({ gates, numQubits, onRemove }) {
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
        {gates.map((g, idx) => (
          <g key={idx} transform={`translate(${120 + idx * 70},0)`}>
            {g.qubits.map((q) => (
              <rect
                key={q}
                x="0"
                y={50 + q * 60 - 20}
                width="50"
                height="40"
                fill="#667eea"
              />
            ))}
            <text
              x="25"
              y={50 + g.qubits[0] * 60 + 5}
              fill="white"
              textAnchor="middle"
            >
              {g.type}
            </text>
          </g>
        ))}
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
