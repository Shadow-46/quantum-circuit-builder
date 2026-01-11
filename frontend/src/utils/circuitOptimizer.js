// Circuit Optimization Utilities
// Optimizes quantum circuits by removing redundant gates and simplifying patterns

/**
 * Optimize a quantum circuit by applying various optimization rules
 * @param {Array} gates - Array of gate objects
 * @returns {Object} - {optimizedGates: Array, report: Object}
 */
export const optimizeCircuit = (gates) => {
  const report = {
    originalGateCount: gates.length,
    optimizedGateCount: 0,
    removedGates: 0,
    optimizations: [],
  };

  let optimized = [...gates];
  
  // Apply optimization passes
  optimized = removeIdentityGates(optimized, report);
  optimized = combineSingleQubitGates(optimized, report);
  optimized = removeAdjacentInverses(optimized, report);
  optimized = optimizeCNOTChains(optimized, report);
  optimized = removeRedundantHadamards(optimized, report);
  
  report.optimizedGateCount = optimized.length;
  report.removedGates = report.originalGateCount - report.optimizedGateCount;
  report.reductionPercentage = ((report.removedGates / report.originalGateCount) * 100).toFixed(1);

  return { optimizedGates: optimized, report };
};

/**
 * Remove identity gates (gates that cancel out)
 */
const removeIdentityGates = (gates, report) => {
  const identityPairs = [
    ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],
    ['H', 'H'], ['S', 'S', 'S', 'S'],
    ['T', 'T', 'T', 'T', 'T', 'T', 'T', 'T']
  ];

  let optimized = [...gates];
  let removed = 0;

  for (let i = 0; i < optimized.length - 1; i++) {
    const current = optimized[i];
    const next = optimized[i + 1];

    // Check if same gate on same qubit
    if (current && next &&
        current.type === next.type &&
        current.qubit === next.qubit &&
        !current.target && !next.target) {
      
      // Check identity pairs
      for (const pair of identityPairs) {
        if (pair.length === 2 && current.type === pair[0]) {
          optimized.splice(i, 2);
          removed += 2;
          report.optimizations.push({
            type: 'identity_removal',
            gates: `${current.type} + ${next.type}`,
            qubit: current.qubit,
          });
          i--; // Recheck this position
          break;
        }
      }
    }
  }

  return optimized;
};

/**
 * Combine adjacent single-qubit rotations
 */
const combineSingleQubitGates = (gates, report) => {
  const rotationGates = ['RX', 'RY', 'RZ'];
  let optimized = [...gates];
  let combined = 0;

  for (let i = 0; i < optimized.length - 1; i++) {
    const current = optimized[i];
    const next = optimized[i + 1];

    if (current && next &&
        rotationGates.includes(current.type) &&
        current.type === next.type &&
        current.qubit === next.qubit &&
        current.angle !== undefined &&
        next.angle !== undefined) {
      
      // Combine rotation angles
      const combinedAngle = (current.angle + next.angle) % (2 * Math.PI);
      
      if (Math.abs(combinedAngle) < 0.0001) {
        // Angles cancel out completely
        optimized.splice(i, 2);
        combined += 2;
      } else {
        // Combine into single gate
        optimized[i] = { ...current, angle: combinedAngle };
        optimized.splice(i + 1, 1);
        combined++;
      }
      
      report.optimizations.push({
        type: 'rotation_combination',
        gates: `${current.type}(${current.angle.toFixed(3)}) + ${next.type}(${next.angle.toFixed(3)})`,
        qubit: current.qubit,
      });
      i--; // Recheck this position
    }
  }

  return optimized;
};

/**
 * Remove adjacent inverse gates (e.g., CNOT followed by CNOT)
 */
const removeAdjacentInverses = (gates, report) => {
  let optimized = [...gates];
  let removed = 0;

  for (let i = 0; i < optimized.length - 1; i++) {
    const current = optimized[i];
    const next = optimized[i + 1];

    // CNOT is its own inverse
    if (current && next &&
        current.type === 'CNOT' &&
        next.type === 'CNOT' &&
        current.qubit === next.qubit &&
        current.target === next.target) {
      
      optimized.splice(i, 2);
      removed += 2;
      report.optimizations.push({
        type: 'inverse_removal',
        gates: 'CNOT + CNOT',
        qubits: `${current.qubit} → ${current.target}`,
      });
      i--; // Recheck this position
    }

    // SWAP is its own inverse
    if (current && next &&
        current.type === 'SWAP' &&
        next.type === 'SWAP' &&
        current.qubit === next.qubit &&
        current.target === next.target) {
      
      optimized.splice(i, 2);
      removed += 2;
      report.optimizations.push({
        type: 'inverse_removal',
        gates: 'SWAP + SWAP',
        qubits: `${current.qubit} ↔ ${current.target}`,
      });
      i--; // Recheck this position
    }
  }

  return optimized;
};

/**
 * Optimize CNOT chains (e.g., CNOT cascades)
 */
const optimizeCNOTChains = (gates, report) => {
  let optimized = [...gates];
  
  // Pattern: CNOT(a,b) + CNOT(b,c) + CNOT(a,b) = CNOT(a,c)
  for (let i = 0; i < optimized.length - 2; i++) {
    const g1 = optimized[i];
    const g2 = optimized[i + 1];
    const g3 = optimized[i + 2];

    if (g1 && g2 && g3 &&
        g1.type === 'CNOT' &&
        g2.type === 'CNOT' &&
        g3.type === 'CNOT' &&
        g1.qubit === g3.qubit &&
        g1.target === g2.qubit &&
        g1.target === g3.target) {
      
      // Replace with single CNOT
      optimized[i] = {
        type: 'CNOT',
        qubit: g1.qubit,
        target: g2.target,
      };
      optimized.splice(i + 1, 2);
      
      report.optimizations.push({
        type: 'cnot_chain_optimization',
        original: 'CNOT chain (3 gates)',
        result: 'Single CNOT',
      });
      i--; // Recheck this position
    }
  }

  return optimized;
};

/**
 * Remove redundant Hadamard gates (H-X-H = Z, etc.)
 */
const removeRedundantHadamards = (gates, report) => {
  let optimized = [...gates];

  // Pattern: H-X-H = Z
  for (let i = 0; i < optimized.length - 2; i++) {
    const g1 = optimized[i];
    const g2 = optimized[i + 1];
    const g3 = optimized[i + 2];

    if (g1 && g2 && g3 &&
        g1.type === 'H' &&
        g3.type === 'H' &&
        g1.qubit === g2.qubit &&
        g2.qubit === g3.qubit) {
      
      if (g2.type === 'X') {
        // H-X-H = Z
        optimized[i] = { type: 'Z', qubit: g1.qubit };
        optimized.splice(i + 1, 2);
        report.optimizations.push({
          type: 'hadamard_simplification',
          original: 'H-X-H',
          result: 'Z',
          qubit: g1.qubit,
        });
      } else if (g2.type === 'Z') {
        // H-Z-H = X
        optimized[i] = { type: 'X', qubit: g1.qubit };
        optimized.splice(i + 1, 2);
        report.optimizations.push({
          type: 'hadamard_simplification',
          original: 'H-Z-H',
          result: 'X',
          qubit: g1.qubit,
        });
      }
      
      i--; // Recheck this position
    }
  }

  return optimized;
};

/**
 * Calculate circuit depth (longest path through circuit)
 */
export const calculateCircuitDepth = (gates, numQubits) => {
  const qubitDepths = new Array(numQubits).fill(0);
  
  gates.forEach(gate => {
    if (gate.target !== undefined) {
      // Two-qubit gate
      const maxDepth = Math.max(qubitDepths[gate.qubit], qubitDepths[gate.target]);
      qubitDepths[gate.qubit] = maxDepth + 1;
      qubitDepths[gate.target] = maxDepth + 1;
    } else {
      // Single-qubit gate
      qubitDepths[gate.qubit]++;
    }
  });

  return Math.max(...qubitDepths);
};

/**
 * Count gate types in circuit
 */
export const analyzeGateDistribution = (gates) => {
  const distribution = {};
  
  gates.forEach(gate => {
    distribution[gate.type] = (distribution[gate.type] || 0) + 1;
  });

  return distribution;
};

/**
 * Estimate circuit fidelity (simplified model)
 */
export const estimateFidelity = (gates, errorRates = {}) => {
  const defaultRates = {
    'single': 0.001,  // 0.1% error for single-qubit gates
    'two': 0.01,      // 1% error for two-qubit gates
  };

  const rates = { ...defaultRates, ...errorRates };
  let fidelity = 1.0;

  gates.forEach(gate => {
    const errorRate = gate.target !== undefined ? rates.two : rates.single;
    fidelity *= (1 - errorRate);
  });

  return {
    fidelity: fidelity,
    fidelityPercent: (fidelity * 100).toFixed(2),
    estimatedSuccess: fidelity,
  };
};

/**
 * Get optimization suggestions
 */
export const getOptimizationSuggestions = (gates, numQubits) => {
  const suggestions = [];
  const depth = calculateCircuitDepth(gates, numQubits);
  const distribution = analyzeGateDistribution(gates);

  // Check for high gate count
  if (gates.length > 50) {
    suggestions.push({
      type: 'warning',
      message: `Circuit has ${gates.length} gates. Consider optimization to reduce errors.`,
      action: 'optimize',
    });
  }

  // Check for high depth
  if (depth > 20) {
    suggestions.push({
      type: 'warning',
      message: `Circuit depth is ${depth}. High depth increases decoherence risk.`,
      action: 'reduce_depth',
    });
  }

  // Check for many two-qubit gates
  const twoQubitGates = (distribution['CNOT'] || 0) + (distribution['SWAP'] || 0) + (distribution['CZ'] || 0);
  if (twoQubitGates > gates.length * 0.5) {
    suggestions.push({
      type: 'info',
      message: `Circuit uses ${twoQubitGates} two-qubit gates (${((twoQubitGates/gates.length)*100).toFixed(0)}%). These have higher error rates.`,
      action: 'minimize_two_qubit',
    });
  }

  // Check for potential optimizations
  const { report } = optimizeCircuit(gates);
  if (report.removedGates > 0) {
    suggestions.push({
      type: 'success',
      message: `Optimization can remove ${report.removedGates} gates (${report.reductionPercentage}% reduction).`,
      action: 'apply_optimization',
    });
  }

  return suggestions;
};
