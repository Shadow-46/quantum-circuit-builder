// Utilities for comparing quantum circuits

// Calculate circuit depth (critical path length)
export const calculateCircuitDepth = (gates) => {
  if (gates.length === 0) return 0;
  return Math.max(...gates.map((g) => g.step || 0)) + 1;
};

// Calculate gate count by type
export const calculateGateCountByType = (gates) => {
  const counts = {};
  gates.forEach((gate) => {
    const type = gate.type;
    counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
};

// Calculate two-qubit gate count
export const calculateTwoQubitGateCount = (gates) => {
  const twoQubitGates = ['CNOT', 'CZ', 'CY', 'SWAP', 'CRX', 'CRY', 'CRZ', 'CH', 'Toffoli', 'Fredkin'];
  return gates.filter((g) => twoQubitGates.includes(g.type)).length;
};

// Calculate T-gate count (important for fault-tolerant quantum computing)
export const calculateTGateCount = (gates) => {
  return gates.filter((g) => g.type === 'T').length;
};

// Estimate circuit execution time (simplified model)
export const estimateExecutionTime = (gates, backend = 'simulator') => {
  // Gate execution times in microseconds (approximate)
  const gateTimes = {
    simulator: { single: 0.001, two: 0.002 },
    ibm: { single: 0.03, two: 0.3 },
    google: { single: 0.025, two: 0.2 },
    rigetti: { single: 0.05, two: 0.5 },
    ionq: { single: 10, two: 200 },
  };

  const times = gateTimes[backend] || gateTimes.simulator;
  const twoQubitGates = ['CNOT', 'CZ', 'CY', 'SWAP', 'CRX', 'CRY', 'CRZ', 'CH', 'Toffoli', 'Fredkin'];

  let totalTime = 0;
  gates.forEach((gate) => {
    if (twoQubitGates.includes(gate.type)) {
      totalTime += times.two;
    } else {
      totalTime += times.single;
    }
  });

  return totalTime; // in microseconds
};

// Calculate circuit complexity score
export const calculateComplexityScore = (gates, numQubits) => {
  const depth = calculateCircuitDepth(gates);
  const twoQubitCount = calculateTwoQubitGateCount(gates);
  const tGateCount = calculateTGateCount(gates);

  // Weighted complexity score
  return (
    gates.length * 1 + // total gates
    depth * 2 + // depth is more important
    twoQubitCount * 5 + // two-qubit gates are expensive
    tGateCount * 3 + // T gates are costly for fault-tolerance
    numQubits * 10 // more qubits = more complex
  );
};

// Find differences between two circuits
export const findCircuitDifferences = (circuit1, circuit2) => {
  const diffs = {
    qubitCountDiff: circuit2.numQubits - circuit1.numQubits,
    gateCountDiff: circuit2.gates.length - circuit1.gates.length,
    depthDiff: calculateCircuitDepth(circuit2.gates) - calculateCircuitDepth(circuit1.gates),
    addedGates: [],
    removedGates: [],
    modifiedGates: [],
  };

  // Simple diff: find gates that are different
  const maxLength = Math.max(circuit1.gates.length, circuit2.gates.length);

  for (let i = 0; i < maxLength; i++) {
    const gate1 = circuit1.gates[i];
    const gate2 = circuit2.gates[i];

    if (!gate1 && gate2) {
      diffs.addedGates.push({ index: i, gate: gate2 });
    } else if (gate1 && !gate2) {
      diffs.removedGates.push({ index: i, gate: gate1 });
    } else if (gate1 && gate2) {
      if (!gatesEqual(gate1, gate2)) {
        diffs.modifiedGates.push({
          index: i,
          from: gate1,
          to: gate2,
        });
      }
    }
  }

  return diffs;
};

// Check if two gates are equal
const gatesEqual = (gate1, gate2) => {
  if (gate1.type !== gate2.type) return false;
  if (gate1.qubit !== gate2.qubit) return false;
  if (gate1.targetQubit !== gate2.targetQubit) return false;
  if (gate1.targetQubit2 !== gate2.targetQubit2) return false;
  if (gate1.step !== gate2.step) return false;

  // Check angle for rotation gates
  if (gate1.angle !== undefined && gate2.angle !== undefined) {
    return Math.abs(gate1.angle - gate2.angle) < 0.0001;
  }

  return true;
};

// Generate comparison metrics
export const generateComparisonMetrics = (circuit1, circuit2) => {
  const metrics = {
    circuit1: {
      name: circuit1.name || 'Circuit 1',
      numQubits: circuit1.numQubits,
      totalGates: circuit1.gates.length,
      depth: calculateCircuitDepth(circuit1.gates),
      twoQubitGates: calculateTwoQubitGateCount(circuit1.gates),
      tGates: calculateTGateCount(circuit1.gates),
      gatesByType: calculateGateCountByType(circuit1.gates),
      executionTime: estimateExecutionTime(circuit1.gates),
      complexityScore: calculateComplexityScore(circuit1.gates, circuit1.numQubits),
    },
    circuit2: {
      name: circuit2.name || 'Circuit 2',
      numQubits: circuit2.numQubits,
      totalGates: circuit2.gates.length,
      depth: calculateCircuitDepth(circuit2.gates),
      twoQubitGates: calculateTwoQubitGateCount(circuit2.gates),
      tGates: calculateTGateCount(circuit2.gates),
      gatesByType: calculateGateCountByType(circuit2.gates),
      executionTime: estimateExecutionTime(circuit2.gates),
      complexityScore: calculateComplexityScore(circuit2.gates, circuit2.numQubits),
    },
    differences: findCircuitDifferences(circuit1, circuit2),
  };

  // Calculate percentage differences
  metrics.percentageDifferences = {
    totalGates: calculatePercentageDiff(
      metrics.circuit1.totalGates,
      metrics.circuit2.totalGates
    ),
    depth: calculatePercentageDiff(metrics.circuit1.depth, metrics.circuit2.depth),
    twoQubitGates: calculatePercentageDiff(
      metrics.circuit1.twoQubitGates,
      metrics.circuit2.twoQubitGates
    ),
    executionTime: calculatePercentageDiff(
      metrics.circuit1.executionTime,
      metrics.circuit2.executionTime
    ),
    complexityScore: calculatePercentageDiff(
      metrics.circuit1.complexityScore,
      metrics.circuit2.complexityScore
    ),
  };

  return metrics;
};

// Calculate percentage difference
const calculatePercentageDiff = (val1, val2) => {
  if (val1 === 0 && val2 === 0) return 0;
  if (val1 === 0) return 100;
  return ((val2 - val1) / val1) * 100;
};

// Format execution time for display
export const formatExecutionTime = (microseconds) => {
  if (microseconds < 1) {
    return `${(microseconds * 1000).toFixed(2)} ns`;
  } else if (microseconds < 1000) {
    return `${microseconds.toFixed(2)} μs`;
  } else if (microseconds < 1000000) {
    return `${(microseconds / 1000).toFixed(2)} ms`;
  } else {
    return `${(microseconds / 1000000).toFixed(2)} s`;
  }
};

// Get color for percentage difference
export const getDiffColor = (percentage) => {
  if (percentage < -10) return '#10b981'; // Green (improvement)
  if (percentage < -5) return '#84cc16'; // Light green
  if (percentage < 5) return '#6b7280'; // Gray (neutral)
  if (percentage < 10) return '#f59e0b'; // Orange
  return '#ef4444'; // Red (worse)
};

// Get improvement/degradation text
export const getDiffText = (percentage) => {
  if (percentage < -10) return '⬇️ Significant improvement';
  if (percentage < -5) return '⬇️ Improvement';
  if (percentage < 5) return '↔️ Neutral';
  if (percentage < 10) return '⬆️ Increase';
  return '⬆️ Significant increase';
};

// Export comparison report as JSON
export const exportComparisonReport = (metrics) => {
  return JSON.stringify(
    {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      comparison: metrics,
    },
    null,
    2
  );
};

// Generate comparison summary text
export const generateComparisonSummary = (metrics) => {
  const { circuit1, circuit2, percentageDifferences } = metrics;

  let summary = `Comparison Summary:\n\n`;
  summary += `${circuit1.name} vs ${circuit2.name}\n`;
  summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  summary += `Qubits: ${circuit1.numQubits} → ${circuit2.numQubits}\n`;
  summary += `Total Gates: ${circuit1.totalGates} → ${circuit2.totalGates} (${percentageDifferences.totalGates.toFixed(1)}%)\n`;
  summary += `Circuit Depth: ${circuit1.depth} → ${circuit2.depth} (${percentageDifferences.depth.toFixed(1)}%)\n`;
  summary += `Two-Qubit Gates: ${circuit1.twoQubitGates} → ${circuit2.twoQubitGates} (${percentageDifferences.twoQubitGates.toFixed(1)}%)\n`;
  summary += `T-Gates: ${circuit1.tGates} → ${circuit2.tGates}\n`;
  summary += `Execution Time: ${formatExecutionTime(circuit1.executionTime)} → ${formatExecutionTime(circuit2.executionTime)} (${percentageDifferences.executionTime.toFixed(1)}%)\n`;
  summary += `Complexity Score: ${circuit1.complexityScore} → ${circuit2.complexityScore} (${percentageDifferences.complexityScore.toFixed(1)}%)\n`;

  return summary;
};
