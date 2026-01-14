import { memo, useMemo } from 'react';

export default memo(function CircuitCanvas({ gates, numQubits, onRemove }) {
  const getGateColor = useMemo(() => (type) => {
    const colors = {
      'H': '#667eea',
      'X': '#f093fb',
      'Y': '#4facfe',
      'Z': '#43e97b',
      'S': '#fa709a',
      'T': '#fee140',
      'CNOT': '#667eea',
      'CX': '#667eea',
      'SWAP': '#764ba2',
      'RX': '#f093fb',
      'RY': '#4facfe',
      'RZ': '#43e97b',
      'TOFFOLI': '#a8edea',
      'FREDKIN': '#fed6e3',
      'CZ': '#43e97b',
      'CY': '#4facfe',
      'CH': '#667eea',
      'CRX': '#f093fb',
      'CRY': '#4facfe',
      'CRZ': '#43e97b',
    };
    return colors[type] || '#667eea';
  }, []);
  };

  const renderGate = (g, idx, xOffset) => {
    const isThreeQubit = g.qubits.length === 3;
    const isTwoQubit = g.qubits.length === 2;
    const color = getGateColor(g.type);
    
    // Handle 3-qubit gates (Toffoli, Fredkin)
    if (isThreeQubit) {
      if (g.type === "TOFFOLI") {
        // Toffoli: 2 controls + 1 target
        const [control1, control2, target] = g.qubits;
        const minQ = Math.min(...g.qubits);
        const maxQ = Math.max(...g.qubits);
        
        return (
          <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
            {/* Vertical line connecting all qubits */}
            <line
              x1="25"
              y1={50 + minQ * 60}
              x2="25"
              y2={50 + maxQ * 60}
              stroke={color}
              strokeWidth="2"
            />
            {/* Control dots */}
            <circle cx="25" cy={50 + control1 * 60} r="6" fill={color} />
            <circle cx="25" cy={50 + control2 * 60} r="6" fill={color} />
            {/* Target circle with X */}
            <circle cx="25" cy={50 + target * 60} r="15" fill="white" stroke={color} strokeWidth="2" />
            <circle cx="25" cy={50 + target * 60} r="12" fill="none" stroke={color} strokeWidth="2" />
            <line x1="25-8" y1={50 + target * 60 - 8} x2="25+8" y2={50 + target * 60 + 8} stroke={color} strokeWidth="2" />
            <line x1="25-8" y1={50 + target * 60 + 8} x2="25+8" y2={50 + target * 60 - 8} stroke={color} strokeWidth="2" />
            <title>Toffoli (CCNOT) - Click to remove</title>
          </g>
        );
      } else if (g.type === "FREDKIN") {
        // Fredkin: 1 control + 2 swap targets
        const [control, target1, target2] = g.qubits;
        const minQ = Math.min(...g.qubits);
        const maxQ = Math.max(...g.qubits);
        
        return (
          <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
            {/* Vertical line connecting all qubits */}
            <line
              x1="25"
              y1={50 + minQ * 60}
              x2="25"
              y2={50 + maxQ * 60}
              stroke={color}
              strokeWidth="2"
            />
            {/* Control dot */}
            <circle cx="25" cy={50 + control * 60} r="6" fill={color} />
            {/* SWAP symbols on targets */}
            <circle cx="25" cy={50 + target1 * 60} r="10" fill="white" stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + target1 * 60 - 6} x2="25+6" y2={50 + target1 * 60 + 6} stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + target1 * 60 + 6} x2="25+6" y2={50 + target1 * 60 - 6} stroke={color} strokeWidth="2" />
            <circle cx="25" cy={50 + target2 * 60} r="10" fill="white" stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + target2 * 60 - 6} x2="25+6" y2={50 + target2 * 60 + 6} stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + target2 * 60 + 6} x2="25+6" y2={50 + target2 * 60 - 6} stroke={color} strokeWidth="2" />
            <title>Fredkin (CSWAP) - Click to remove</title>
          </g>
        );
      }
    }
    
    // Handle 2-qubit gates
    if (isTwoQubit) {
      const [q1, q2] = g.qubits;
      const minQ = Math.min(q1, q2);
      const maxQ = Math.max(q1, q2);
      
      // Controlled gates (CNOT, CX, CZ, CY, CH, CRX, CRY, CRZ)
      if (g.type.startsWith('C') && g.type !== 'CSWAP') {
        const isControlledRotation = g.type.startsWith('CR');
        const baseGate = g.type.substring(1); // Remove 'C' prefix
        
        return (
          <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
            {/* Vertical line connecting control and target */}
            <line
              x1="25"
              y1={50 + minQ * 60}
              x2="25"
              y2={50 + maxQ * 60}
              stroke={color}
              strokeWidth="2"
            />
            {/* Control dot (always on first qubit) */}
            <circle cx="25" cy={50 + q1 * 60} r="6" fill={color} />
            
            {/* Target representation based on gate type */}
            {(g.type === 'CNOT' || g.type === 'CX') ? (
              <>
                <circle cx="25" cy={50 + q2 * 60} r="15" fill="white" stroke={color} strokeWidth="2" />
                <circle cx="25" cy={50 + q2 * 60} r="12" fill="none" stroke={color} strokeWidth="2" />
                <line x1="25" y1={50 + q2 * 60 - 8} x2="25" y2={50 + q2 * 60 + 8} stroke={color} strokeWidth="2" />
                <line x1="17" y1={50 + q2 * 60} x2="33" y2={50 + q2 * 60} stroke={color} strokeWidth="2" />
              </>
            ) : (
              <>
                <rect x="0" y={50 + q2 * 60 - 20} width="50" height="40" fill={color} rx="5" />
                <text x="25" y={50 + q2 * 60 + 5} fill="white" textAnchor="middle" fontSize="12">{baseGate}</text>
              </>
            )}
            <title>Click to remove {g.type} gate</title>
          </g>
        );
      }
      
      // SWAP gate
      if (g.type === 'SWAP') {
        return (
          <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
            <line x1="25" y1={50 + q1 * 60} x2="25" y2={50 + q2 * 60} stroke={color} strokeWidth="2" />
            <circle cx="25" cy={50 + q1 * 60} r="10" fill="white" stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + q1 * 60 - 6} x2="25+6" y2={50 + q1 * 60 + 6} stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + q1 * 60 + 6} x2="25+6" y2={50 + q1 * 60 - 6} stroke={color} strokeWidth="2" />
            <circle cx="25" cy={50 + q2 * 60} r="10" fill="white" stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + q2 * 60 - 6} x2="25+6" y2={50 + q2 * 60 + 6} stroke={color} strokeWidth="2" />
            <line x1="25-6" y1={50 + q2 * 60 + 6} x2="25+6" y2={50 + q2 * 60 - 6} stroke={color} strokeWidth="2" />
            <title>Click to remove {g.type} gate</title>
          </g>
        );
      }
    }
    
    // Single-qubit gate
    const q = g.qubits[0];
    const gateLabel = g.params && g.params.length > 0 
      ? `${g.type}(${(g.params[0] / Math.PI).toFixed(2)}π)`
      : g.type;
    
    return (
      <g key={idx} transform={`translate(${xOffset},0)`} onClick={() => onRemove(idx)} style={{ cursor: 'pointer' }}>
        <rect x="0" y={50 + q * 60 - 20} width="50" height="40" fill={color} rx="5" />
        <text x="25" y={50 + q * 60 + 5} fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">{g.type}</text>
        {g.params && g.params.length > 0 && (
          <text x="25" y={50 + q * 60 + 18} fill="white" textAnchor="middle" fontSize="9">
            {(g.params[0] / Math.PI).toFixed(2)}π
          </text>
        )}
        <title>{gateLabel} - Click to remove</title>
      </g>
    );
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
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.numQubits === nextProps.numQubits &&
    prevProps.gates.length === nextProps.gates.length &&
    prevProps.gates.every((gate, idx) => gate === nextProps.gates[idx])
  );
});
