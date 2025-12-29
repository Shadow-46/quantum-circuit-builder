export default function CircuitStats({ gates, numQubits }) {
  const calculateDepth = () => {
    if (!gates.length) return 0;
    
    // Track the last time each qubit was used
    const qubitLastUsed = Array(numQubits).fill(-1);
    const gateDepths = [];
    
    gates.forEach((gate, idx) => {
      // Find the maximum depth among all qubits this gate uses
      const maxPrevDepth = Math.max(...gate.qubits.map(q => qubitLastUsed[q]));
      const thisDepth = maxPrevDepth + 1;
      gateDepths.push(thisDepth);
      
      // Update all qubits used by this gate
      gate.qubits.forEach(q => {
        qubitLastUsed[q] = thisDepth;
      });
    });
    
    return Math.max(...gateDepths);
  };
  
  const countGateTypes = () => {
    const counts = {};
    gates.forEach(g => {
      counts[g.type] = (counts[g.type] || 0) + 1;
    });
    return counts;
  };
  
  const depth = calculateDepth();
  const gateTypes = countGateTypes();
  const totalGates = gates.length;
  
  if (totalGates === 0) {
    return (
      <div className="circuit-stats">
        <h3>Circuit Statistics</h3>
        <p className="empty-state">No gates added yet</p>
      </div>
    );
  }
  
  return (
    <div className="circuit-stats">
      <h3>Circuit Statistics</h3>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Total Gates:</span>
          <span className="stat-value">{totalGates}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Circuit Depth:</span>
          <span className="stat-value">{depth}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Qubits Used:</span>
          <span className="stat-value">{numQubits}</span>
        </div>
      </div>
      <div className="gate-breakdown">
        <h4>Gate Breakdown</h4>
        <ul>
          {Object.entries(gateTypes).map(([type, count]) => (
            <li key={type}>
              <strong>{type}:</strong> {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
