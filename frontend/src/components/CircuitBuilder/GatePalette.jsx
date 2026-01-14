import { useState, memo, useMemo, useCallback } from "react";
import useProgressStore from "../../store/progressStore";

export default memo(function GatePalette({ onAdd, numQubits }) {
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [selectedQubit2, setSelectedQubit2] = useState(1);
  const [selectedQubit3, setSelectedQubit3] = useState(2);
  const [rotationAngle, setRotationAngle] = useState(Math.PI / 4);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { incrementGatesUsed, incrementCircuitsCreated } = useProgressStore();

  const BASIC_GATES = [
    { type: "H", desc: "Hadamard - Create superposition", numQubits: 1, category: "basic" },
    { type: "X", desc: "Pauli-X - Quantum NOT", numQubits: 1, category: "basic" },
    { type: "Y", desc: "Pauli-Y - Rotation around Y", numQubits: 1, category: "basic" },
    { type: "Z", desc: "Pauli-Z - Phase flip", numQubits: 1, category: "basic" },
    { type: "S", desc: "Phase S - √Z gate", numQubits: 1, category: "basic" },
    { type: "T", desc: "Phase T - √S gate", numQubits: 1, category: "basic" },
    { type: "CNOT", desc: "Controlled-NOT", numQubits: 2, category: "basic" },
    { type: "SWAP", desc: "Swap two qubits", numQubits: 2, category: "basic" },
  ];

  const ROTATION_GATES = [
    { type: "RX", desc: "Rotation around X-axis", numQubits: 1, hasParam: true, category: "rotation" },
    { type: "RY", desc: "Rotation around Y-axis", numQubits: 1, hasParam: true, category: "rotation" },
    { type: "RZ", desc: "Rotation around Z-axis", numQubits: 1, hasParam: true, category: "rotation" },
    { type: "U", desc: "Universal single-qubit gate", numQubits: 1, hasParam: true, category: "rotation" },
  ];

  const ADVANCED_GATES = [
    { type: "TOFFOLI", desc: "Toffoli (CCNOT) - 3-qubit gate", numQubits: 3, category: "advanced" },
    { type: "FREDKIN", desc: "Fredkin (CSWAP) - Controlled SWAP", numQubits: 3, category: "advanced" },
    { type: "CZ", desc: "Controlled-Z", numQubits: 2, category: "advanced" },
    { type: "CY", desc: "Controlled-Y", numQubits: 2, category: "advanced" },
    { type: "CH", desc: "Controlled-Hadamard", numQubits: 2, category: "advanced" },
    { type: "CRX", desc: "Controlled Rotation-X", numQubits: 2, hasParam: true, category: "advanced" },
    { type: "CRY", desc: "Controlled Rotation-Y", numQubits: 2, hasParam: true, category: "advanced" },
    { type: "CRZ", desc: "Controlled Rotation-Z", numQubits: 2, hasParam: true, category: "advanced" },
  ];

  const ALL_GATES = useMemo(() => [...BASIC_GATES, ...ROTATION_GATES, ...ADVANCED_GATES], []);

  const handleAddGate = useCallback((gate) => {
    const params = gate.hasParam ? [rotationAngle] : [];
    
    if (gate.numQubits === 1) {
      onAdd({ type: gate.type, qubits: [selectedQubit], params });
    } else if (gate.numQubits === 2) {
      const target = selectedQubit !== selectedQubit2 ? selectedQubit2 : (selectedQubit + 1) % numQubits;
      onAdd({ type: gate.type, qubits: [selectedQubit, target], params });
    } else if (gate.numQubits === 3) {
      // For 3-qubit gates, ensure all qubits are different
      let q1 = selectedQubit;
      let q2 = selectedQubit2 !== q1 ? selectedQubit2 : (q1 + 1) % numQubits;
      let q3 = selectedQubit3;
      if (q3 === q1 || q3 === q2) {
        q3 = [0, 1, 2, 3, 4].find(q => q !== q1 && q !== q2 && q < numQubits) || 0;
      }
      onAdd({ type: gate.type, qubits: [q1, q2, q3], params });
    }
    
    // Track gate usage
    incrementGatesUsed(gate.type);
  }, [selectedQubit, selectedQubit2, selectedQubit3, rotationAngle, numQubits, onAdd, incrementGatesUsed]);

  return (
    <div className="gate-palette">
      <div className="palette-header">
        <h3>🎛️ Gate Palette</h3>
        <button 
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          title={showAdvanced ? "Hide advanced gates" : "Show advanced gates"}
        >
          {showAdvanced ? "Basic" : "Advanced"}
        </button>
      </div>

      <div className="qubit-selectors">
        <div className="qubit-selector">
          <label>Qubit 1:</label>
          <select value={selectedQubit} onChange={(e) => setSelectedQubit(Number(e.target.value))}>
            {Array.from({ length: numQubits }).map((_, i) => (
              <option key={i} value={i}>q{i}</option>
            ))}
          </select>
        </div>
        
        {showAdvanced && (
          <>
            <div className="qubit-selector">
              <label>Qubit 2:</label>
              <select value={selectedQubit2} onChange={(e) => setSelectedQubit2(Number(e.target.value))}>
                {Array.from({ length: numQubits }).map((_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
            
            <div className="qubit-selector">
              <label>Qubit 3:</label>
              <select value={selectedQubit3} onChange={(e) => setSelectedQubit3(Number(e.target.value))}>
                {Array.from({ length: numQubits }).map((_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {ALL_GATES.find(g => g.hasParam) && (
        <div className="rotation-input">
          <label>Rotation Angle (radians):</label>
          <input 
            type="number" 
            step="0.1" 
            value={rotationAngle} 
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            placeholder="π/4"
          />
          <small>{(rotationAngle / Math.PI).toFixed(2)}π</small>
        </div>
      )}

      <div className="gate-categories">
        <div className="gate-category">
          <h4>Basic Gates</h4>
          <div className="gates">
            {BASIC_GATES.map((g) => (
              <button 
                key={g.type} 
                onClick={() => handleAddGate(g)} 
                title={g.desc}
                className="gate-btn basic"
              >
                {g.type}
              </button>
            ))}
          </div>
        </div>

        <div className="gate-category">
          <h4>Rotation Gates</h4>
          <div className="gates">
            {ROTATION_GATES.map((g) => (
              <button 
                key={g.type} 
                onClick={() => handleAddGate(g)} 
                title={g.desc}
                className="gate-btn rotation"
              >
                {g.type}
              </button>
            ))}
          </div>
        </div>

        {showAdvanced && (
          <div className="gate-category">
            <h4>Advanced Gates</h4>
            <div className="gates">
              {ADVANCED_GATES.map((g) => (
                <button 
                  key={g.type} 
                  onClick={() => handleAddGate(g)} 
                  title={g.desc}
                  className="gate-btn advanced"
                  disabled={numQubits < g.numQubits}
                >
                  {g.type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.numQubits === nextProps.numQubits;
});
