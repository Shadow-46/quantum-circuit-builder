/**
 * Multi-Objective Circuit Optimizer
 * Implements various optimization algorithms for quantum circuits
 */

// Optimization objectives
export const OBJECTIVES = {
  MINIMIZE_GATES: 'minimize_gates',
  MINIMIZE_DEPTH: 'minimize_depth',
  MINIMIZE_TWO_QUBIT: 'minimize_two_qubit',
  MAXIMIZE_FIDELITY: 'maximize_fidelity',
};

// Optimization algorithms
export const ALGORITHMS = {
  GREEDY: 'greedy',
  SIMULATED_ANNEALING: 'simulated_annealing',
  GENETIC: 'genetic',
  MULTI_OBJECTIVE: 'multi_objective',
};

// Hardware topologies
export const TOPOLOGIES = {
  IBM_FALCON: 'ibm_falcon_r5',
  IBM_EAGLE: 'ibm_eagle_r3',
  AWS_RIGETTI: 'aws_rigetti_aspen',
  LINEAR: 'linear',
  ALL_TO_ALL: 'all_to_all',
};

// Gate equivalence rules for decomposition
const GATE_DECOMPOSITIONS = {
  TOFFOLI: [
    { type: 'H', qubit: 2 },
    { type: 'CNOT', control: 1, target: 2 },
    { type: 'T_DAG', qubit: 2 },
    { type: 'CNOT', control: 0, target: 2 },
    { type: 'T', qubit: 2 },
    { type: 'CNOT', control: 1, target: 2 },
    { type: 'T_DAG', qubit: 2 },
    { type: 'CNOT', control: 0, target: 2 },
    { type: 'T', qubit: 1 },
    { type: 'T', qubit: 2 },
    { type: 'H', qubit: 2 },
    { type: 'CNOT', control: 0, target: 1 },
    { type: 'T', qubit: 0 },
    { type: 'T_DAG', qubit: 1 },
    { type: 'CNOT', control: 0, target: 1 },
  ],
  SWAP: [
    { type: 'CNOT', control: 0, target: 1 },
    { type: 'CNOT', control: 1, target: 0 },
    { type: 'CNOT', control: 0, target: 1 },
  ],
  CZ: [
    { type: 'H', qubit: 1 },
    { type: 'CNOT', control: 0, target: 1 },
    { type: 'H', qubit: 1 },
  ],
};

/**
 * Calculate circuit metrics
 */
export const calculateCircuitMetrics = (gates, numQubits) => {
  const metrics = {
    totalGates: gates.length,
    singleQubitGates: 0,
    twoQubitGates: 0,
    depth: 0,
    qubitUsage: new Array(numQubits).fill(0),
    gateTypes: {},
  };

  // Count gate types
  gates.forEach(gate => {
    const type = gate.type;
    metrics.gateTypes[type] = (metrics.gateTypes[type] || 0) + 1;

    if (gate.control !== undefined) {
      metrics.twoQubitGates++;
      metrics.qubitUsage[gate.control]++;
      metrics.qubitUsage[gate.target]++;
    } else {
      metrics.singleQubitGates++;
      metrics.qubitUsage[gate.qubit]++;
    }
  });

  // Calculate depth (simplified - assumes parallel execution)
  const layers = new Array(numQubits).fill(0);
  gates.forEach(gate => {
    if (gate.control !== undefined) {
      const maxLayer = Math.max(layers[gate.control], layers[gate.target]);
      layers[gate.control] = maxLayer + 1;
      layers[gate.target] = maxLayer + 1;
    } else {
      layers[gate.qubit]++;
    }
  });
  metrics.depth = Math.max(...layers);

  return metrics;
};

/**
 * Greedy optimization - remove redundant gates
 */
export const greedyOptimization = (gates, numQubits) => {
  const optimized = [];
  const history = [];

  for (let i = 0; i < gates.length; i++) {
    const gate = gates[i];
    let isRedundant = false;

    // Check for gate cancellation patterns
    if (optimized.length > 0) {
      const lastGate = optimized[optimized.length - 1];

      // H-H, X-X, Y-Y, Z-Z cancel out
      if (
        lastGate.type === gate.type &&
        lastGate.qubit === gate.qubit &&
        ['H', 'X', 'Y', 'Z'].includes(gate.type)
      ) {
        optimized.pop();
        history.push({
          action: 'removed_pair',
          gates: [lastGate, gate],
          reason: `${gate.type}-${gate.type} cancellation`,
        });
        isRedundant = true;
      }

      // CNOT-CNOT on same qubits cancel
      if (
        lastGate.type === 'CNOT' &&
        gate.type === 'CNOT' &&
        lastGate.control === gate.control &&
        lastGate.target === gate.target
      ) {
        optimized.pop();
        history.push({
          action: 'removed_pair',
          gates: [lastGate, gate],
          reason: 'CNOT-CNOT cancellation',
        });
        isRedundant = true;
      }
    }

    if (!isRedundant) {
      optimized.push({ ...gate });
    }
  }

  const beforeMetrics = calculateCircuitMetrics(gates, numQubits);
  const afterMetrics = calculateCircuitMetrics(optimized, numQubits);

  return {
    optimizedGates: optimized,
    beforeMetrics,
    afterMetrics,
    history,
    improvement: {
      gateReduction: ((beforeMetrics.totalGates - afterMetrics.totalGates) / beforeMetrics.totalGates) * 100,
      depthReduction: ((beforeMetrics.depth - afterMetrics.depth) / beforeMetrics.depth) * 100,
    },
  };
};

/**
 * Simulated Annealing optimization
 */
export const simulatedAnnealingOptimization = (gates, numQubits, options = {}) => {
  const {
    initialTemp = 100,
    coolingRate = 0.95,
    iterations = 100,
    objective = OBJECTIVES.MINIMIZE_GATES,
  } = options;

  let current = [...gates];
  let best = [...gates];
  let currentCost = calculateCost(current, numQubits, objective);
  let bestCost = currentCost;
  let temperature = initialTemp;

  const history = [];

  for (let iter = 0; iter < iterations; iter++) {
    // Generate neighbor by swapping two gates
    const neighbor = generateNeighbor(current);
    const neighborCost = calculateCost(neighbor, numQubits, objective);

    // Accept or reject
    const delta = neighborCost - currentCost;
    if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
      current = neighbor;
      currentCost = neighborCost;

      if (currentCost < bestCost) {
        best = [...current];
        bestCost = currentCost;
        history.push({
          iteration: iter,
          cost: bestCost,
          action: 'improved',
        });
      }
    }

    temperature *= coolingRate;
  }

  const beforeMetrics = calculateCircuitMetrics(gates, numQubits);
  const afterMetrics = calculateCircuitMetrics(best, numQubits);

  return {
    optimizedGates: best,
    beforeMetrics,
    afterMetrics,
    history,
    improvement: {
      gateReduction: ((beforeMetrics.totalGates - afterMetrics.totalGates) / beforeMetrics.totalGates) * 100,
      depthReduction: ((beforeMetrics.depth - afterMetrics.depth) / beforeMetrics.depth) * 100,
    },
  };
};

/**
 * Calculate cost function for optimization
 */
const calculateCost = (gates, numQubits, objective) => {
  const metrics = calculateCircuitMetrics(gates, numQubits);

  switch (objective) {
    case OBJECTIVES.MINIMIZE_GATES:
      return metrics.totalGates;
    case OBJECTIVES.MINIMIZE_DEPTH:
      return metrics.depth;
    case OBJECTIVES.MINIMIZE_TWO_QUBIT:
      return metrics.twoQubitGates * 10 + metrics.singleQubitGates;
    default:
      return metrics.totalGates + metrics.depth;
  }
};

/**
 * Generate a neighbor circuit by swapping gates
 */
const generateNeighbor = (gates) => {
  if (gates.length < 2) return gates;

  const neighbor = [...gates];
  const i = Math.floor(Math.random() * gates.length);
  const j = Math.floor(Math.random() * gates.length);

  // Swap gates
  [neighbor[i], neighbor[j]] = [neighbor[j], neighbor[i]];

  return neighbor;
};

/**
 * Multi-objective optimization using Pareto frontier
 */
export const multiObjectiveOptimization = (gates, numQubits, objectives = []) => {
  const population = generateInitialPopulation(gates, 20);
  const paretoFront = [];

  // Evaluate all solutions
  population.forEach(individual => {
    const metrics = calculateCircuitMetrics(individual, numQubits);
    const scores = objectives.map(obj => {
      switch (obj) {
        case OBJECTIVES.MINIMIZE_GATES:
          return metrics.totalGates;
        case OBJECTIVES.MINIMIZE_DEPTH:
          return metrics.depth;
        case OBJECTIVES.MINIMIZE_TWO_QUBIT:
          return metrics.twoQubitGates;
        default:
          return metrics.totalGates;
      }
    });

    // Check if solution is non-dominated
    const isDominated = population.some(other => {
      if (other === individual) return false;
      const otherMetrics = calculateCircuitMetrics(other, numQubits);
      const otherScores = objectives.map(obj => {
        switch (obj) {
          case OBJECTIVES.MINIMIZE_GATES:
            return otherMetrics.totalGates;
          case OBJECTIVES.MINIMIZE_DEPTH:
            return otherMetrics.depth;
          case OBJECTIVES.MINIMIZE_TWO_QUBIT:
            return otherMetrics.twoQubitGates;
          default:
            return otherMetrics.totalGates;
        }
      });

      return otherScores.every((s, i) => s <= scores[i]) && 
             otherScores.some((s, i) => s < scores[i]);
    });

    if (!isDominated) {
      paretoFront.push({
        gates: individual,
        metrics,
        scores,
      });
    }
  });

  return {
    paretoFront,
    population,
    objectives,
  };
};

/**
 * Generate initial population for genetic algorithm
 */
const generateInitialPopulation = (gates, size) => {
  const population = [gates]; // Include original

  for (let i = 1; i < size; i++) {
    let individual = [...gates];
    
    // Apply random optimizations
    const numMutations = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numMutations; j++) {
      individual = mutateCircuit(individual);
    }

    population.push(individual);
  }

  return population;
};

/**
 * Mutate circuit (for genetic algorithm)
 */
const mutateCircuit = (gates) => {
  if (gates.length < 2) return gates;

  const mutationType = Math.random();
  let mutated = [...gates];

  if (mutationType < 0.4) {
    // Swap two gates
    const i = Math.floor(Math.random() * gates.length);
    const j = Math.floor(Math.random() * gates.length);
    [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
  } else if (mutationType < 0.7) {
    // Remove redundant gate if exists
    for (let i = mutated.length - 1; i > 0; i--) {
      const curr = mutated[i];
      const prev = mutated[i - 1];
      if (
        curr.type === prev.type &&
        curr.qubit === prev.qubit &&
        ['H', 'X', 'Y', 'Z'].includes(curr.type)
      ) {
        mutated.splice(i - 1, 2);
        break;
      }
    }
  }

  return mutated;
};

/**
 * Hardware-specific topology mapping
 */
export const hardwareTopologyMapping = (gates, numQubits, topology) => {
  // Get connectivity graph for topology
  const connectivity = getTopologyConnectivity(topology, numQubits);
  
  const mapped = [];
  const swapHistory = [];
  const virtualToPhysical = Array.from({ length: numQubits }, (_, i) => i);

  gates.forEach(gate => {
    if (gate.control !== undefined) {
      // Two-qubit gate - check if qubits are connected
      const physControl = virtualToPhysical[gate.control];
      const physTarget = virtualToPhysical[gate.target];

      if (!isConnected(physControl, physTarget, connectivity)) {
        // Need to insert SWAP gates
        const swaps = findSwapPath(physControl, physTarget, connectivity);
        swaps.forEach(swap => {
          mapped.push({ type: 'SWAP', control: swap[0], target: swap[1] });
          // Update mapping
          const idx1 = virtualToPhysical.indexOf(swap[0]);
          const idx2 = virtualToPhysical.indexOf(swap[1]);
          [virtualToPhysical[idx1], virtualToPhysical[idx2]] = 
            [virtualToPhysical[idx2], virtualToPhysical[idx1]];
        });
        swapHistory.push({
          originalGate: gate,
          swapsInserted: swaps.length,
        });
      }

      mapped.push({
        ...gate,
        control: virtualToPhysical[gate.control],
        target: virtualToPhysical[gate.target],
      });
    } else {
      mapped.push({
        ...gate,
        qubit: virtualToPhysical[gate.qubit],
      });
    }
  });

  const beforeMetrics = calculateCircuitMetrics(gates, numQubits);
  const afterMetrics = calculateCircuitMetrics(mapped, numQubits);

  return {
    mappedGates: mapped,
    beforeMetrics,
    afterMetrics,
    swapHistory,
    topology,
    overhead: {
      extraGates: mapped.length - gates.length,
      extraSWAPs: swapHistory.reduce((sum, h) => sum + h.swapsInserted, 0),
    },
  };
};

/**
 * Get connectivity graph for hardware topology
 */
const getTopologyConnectivity = (topology, numQubits) => {
  switch (topology) {
    case TOPOLOGIES.IBM_FALCON:
      // 5-qubit T-shaped connectivity
      return {
        0: [1],
        1: [0, 2, 3],
        2: [1],
        3: [1, 4],
        4: [3],
      };
    case TOPOLOGIES.LINEAR:
      // Linear chain
      const linear = {};
      for (let i = 0; i < numQubits; i++) {
        linear[i] = [];
        if (i > 0) linear[i].push(i - 1);
        if (i < numQubits - 1) linear[i].push(i + 1);
      }
      return linear;
    case TOPOLOGIES.ALL_TO_ALL:
      // Fully connected
      const allToAll = {};
      for (let i = 0; i < numQubits; i++) {
        allToAll[i] = Array.from({ length: numQubits }, (_, j) => j).filter(j => j !== i);
      }
      return allToAll;
    default:
      return getTopologyConnectivity(TOPOLOGIES.LINEAR, numQubits);
  }
};

/**
 * Check if two qubits are connected in topology
 */
const isConnected = (q1, q2, connectivity) => {
  return connectivity[q1]?.includes(q2) || connectivity[q2]?.includes(q1);
};

/**
 * Find SWAP path between two qubits (simplified BFS)
 */
const findSwapPath = (start, end, connectivity) => {
  // Simplified: just one SWAP to nearest connected qubit
  // In reality, should use full path finding
  const neighbors = connectivity[start] || [];
  if (neighbors.length === 0) return [];

  const nearest = neighbors[0];
  return [[start, nearest]];
};

/**
 * Decompose complex gates
 */
export const decomposeComplexGates = (gates) => {
  const decomposed = [];
  let decompositionCount = 0;

  gates.forEach(gate => {
    if (GATE_DECOMPOSITIONS[gate.type]) {
      const decomposition = GATE_DECOMPOSITIONS[gate.type];
      decomposition.forEach(dGate => {
        decomposed.push({
          ...dGate,
          qubit: dGate.qubit !== undefined ? gate.qubit + dGate.qubit : undefined,
          control: dGate.control !== undefined ? gate.qubit + dGate.control : undefined,
          target: dGate.target !== undefined ? gate.qubit + dGate.target : undefined,
        });
      });
      decompositionCount++;
    } else {
      decomposed.push({ ...gate });
    }
  });

  return {
    decomposedGates: decomposed,
    decompositionCount,
  };
};
