/**
 * Circuit Transpiler Engine
 * Handles circuit transpilation, qubit mapping, and routing for different hardware backends
 */

import { decomposeGate, BASIS_SETS, transpileCircuit as basicTranspile } from './gateDecomposition';

/**
 * Hardware topology definitions
 */
export const HARDWARE_TOPOLOGIES = {
  'ibm': {
    name: 'IBM Heavy-Hex',
    qubits: 127,
    connectivity: 'heavy-hex',
    couplingMap: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
      [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
      // Simplified coupling map for demonstration
      // Real IBM has complex heavy-hex topology
    ]
  },
  'google': {
    name: 'Google Sycamore',
    qubits: 53,
    connectivity: '2d-grid',
    couplingMap: [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
      [5, 6], [6, 7], [7, 8], [8, 9],
      // Simplified 2D grid
    ]
  },
  'rigetti': {
    name: 'Rigetti Aspen',
    qubits: 32,
    connectivity: 'octagon',
    couplingMap: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
      // Octagonal connectivity
    ]
  },
  'ionq': {
    name: 'IonQ',
    qubits: 11,
    connectivity: 'all-to-all',
    couplingMap: [] // All-to-all connectivity
  }
};

/**
 * Check if two qubits are connected in the hardware topology
 */
function areQubitsConnected(qubit1, qubit2, topology) {
  if (topology === 'all-to-all') return true;
  
  const couplingMap = HARDWARE_TOPOLOGIES[topology]?.couplingMap || [];
  return couplingMap.some(
    ([a, b]) => (a === qubit1 && b === qubit2) || (a === qubit2 && b === qubit1)
  );
}

/**
 * Find shortest path between two qubits (for SWAP insertion)
 */
function findShortestPath(start, end, couplingMap) {
  if (start === end) return [start];
  
  // BFS to find shortest path
  const queue = [[start]];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    // Get neighbors
    const neighbors = couplingMap
      .filter(([a, b]) => a === current || b === current)
      .map(([a, b]) => a === current ? b : a);
    
    for (const neighbor of neighbors) {
      if (neighbor === end) {
        return [...path, neighbor];
      }
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  
  return null; // No path found
}

/**
 * Insert SWAP gates to route qubits
 */
function insertSwaps(gate, currentMapping, couplingMap) {
  const control = currentMapping[gate.qubit];
  const target = currentMapping[gate.target];
  
  if (areQubitsConnected(control, target, couplingMap)) {
    return { swaps: [], gate };
  }
  
  // Find path and insert SWAPs
  const path = findShortestPath(control, target, couplingMap);
  const swaps = [];
  
  if (!path || path.length < 2) {
    return { swaps: [], gate };
  }
  
  // Insert SWAPs along the path
  for (let i = 0; i < path.length - 2; i++) {
    swaps.push({
      type: 'swap',
      qubit: path[i],
      target: path[i + 1]
    });
    
    // Update mapping
    const temp = currentMapping[gate.qubit];
    currentMapping[gate.qubit] = path[i + 1];
  }
  
  return { swaps, gate: { ...gate, qubit: currentMapping[gate.qubit], target: currentMapping[gate.target] } };
}

/**
 * Simple greedy qubit mapping algorithm
 */
function mapQubits(circuit, numPhysicalQubits) {
  const numLogicalQubits = Math.max(...circuit.flatMap(g => [g.qubit, g.target, g.target2].filter(q => q !== undefined))) + 1;
  
  if (numLogicalQubits > numPhysicalQubits) {
    throw new Error(`Circuit requires ${numLogicalQubits} qubits but hardware only has ${numPhysicalQubits}`);
  }
  
  // Initial mapping (identity)
  const mapping = {};
  for (let i = 0; i < numLogicalQubits; i++) {
    mapping[i] = i;
  }
  
  return mapping;
}

/**
 * Apply qubit routing for hardware connectivity constraints
 */
function applyRouting(circuit, topology, initialMapping) {
  const currentMapping = { ...initialMapping };
  const routedCircuit = [];
  
  for (const gate of circuit) {
    if (gate.target !== undefined) {
      // Two-qubit gate - may need routing
      const { swaps, gate: routedGate } = insertSwaps(gate, currentMapping, topology);
      routedCircuit.push(...swaps, routedGate);
    } else {
      // Single-qubit gate - just update qubit index
      routedCircuit.push({
        ...gate,
        qubit: currentMapping[gate.qubit]
      });
    }
  }
  
  return routedCircuit;
}

/**
 * Optimize transpiled circuit (simple peephole optimizations)
 */
function optimizeTranspiledCircuit(circuit) {
  const optimized = [];
  let i = 0;
  
  while (i < circuit.length) {
    const current = circuit[i];
    const next = circuit[i + 1];
    
    // Remove identity gates
    if (current.type === 'id') {
      i++;
      continue;
    }
    
    // Combine adjacent RZ gates on same qubit
    if (current.type === 'rz' && next?.type === 'rz' && current.qubit === next.qubit) {
      optimized.push({
        ...current,
        angle: current.angle + next.angle
      });
      i += 2;
      continue;
    }
    
    // Remove zero-angle rotations
    if ((current.type === 'rx' || current.type === 'ry' || current.type === 'rz') && 
        Math.abs(current.angle) < 1e-10) {
      i++;
      continue;
    }
    
    optimized.push(current);
    i++;
  }
  
  return optimized;
}

/**
 * Main transpilation function
 * Transpiles a circuit to run on specific hardware backend
 */
export function transpileCircuit(gates, backend = 'universal', options = {}) {
  const {
    optimization_level = 1,
    routing = true,
    initial_layout = null
  } = options;
  
  // Step 1: Decompose gates to basis set
  const basisSet = backend.toLowerCase();
  let transpiledGates = basicTranspile(gates, basisSet);
  
  // Step 2: Apply qubit mapping (if needed)
  const topology = HARDWARE_TOPOLOGIES[backend];
  let mapping = initial_layout;
  
  if (!mapping && topology) {
    mapping = mapQubits(transpiledGates, topology.qubits);
  }
  
  // Step 3: Apply routing (if needed and enabled)
  if (routing && topology && topology.connectivity !== 'all-to-all') {
    transpiledGates = applyRouting(transpiledGates, backend, mapping);
  }
  
  // Step 4: Optimization
  if (optimization_level > 0) {
    transpiledGates = optimizeTranspiledCircuit(transpiledGates);
  }
  
  return {
    gates: transpiledGates,
    mapping,
    backend: backend,
    basisSet: BASIS_SETS[basisSet],
    stats: {
      originalGateCount: gates.length,
      transpiledGateCount: transpiledGates.length,
      expansionFactor: (transpiledGates.length / gates.length).toFixed(2)
    }
  };
}

/**
 * Get transpilation options for a backend
 */
export function getBackendInfo(backend) {
  const basisSet = BASIS_SETS[backend];
  const topology = HARDWARE_TOPOLOGIES[backend];
  
  return {
    name: basisSet?.name || backend,
    basisGates: basisSet?.basis || [],
    nativeGates: basisSet?.native || [],
    coupling: topology?.connectivity || 'all-to-all',
    qubits: topology?.qubits || 'unlimited',
    description: basisSet?.description || 'Custom backend'
  };
}

/**
 * Validate if circuit can run on backend
 */
export function validateCircuitForBackend(gates, backend) {
  const errors = [];
  const warnings = [];
  
  // Check number of qubits
  const topology = HARDWARE_TOPOLOGIES[backend];
  if (topology) {
    const maxQubit = Math.max(...gates.flatMap(g => [g.qubit, g.target, g.target2].filter(q => q !== undefined)));
    if (maxQubit >= topology.qubits) {
      errors.push(`Circuit requires ${maxQubit + 1} qubits but ${backend} only has ${topology.qubits}`);
    }
  }
  
  // Check if gates need decomposition
  const basisSet = BASIS_SETS[backend];
  if (basisSet) {
    gates.forEach((gate, idx) => {
      if (!basisSet.basis.includes(gate.type.toLowerCase())) {
        warnings.push(`Gate ${gate.type} at position ${idx} will be decomposed`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Compare different transpilation strategies
 */
export function compareBackends(gates, backends = ['ibm', 'google', 'rigetti', 'ionq']) {
  const results = backends.map(backend => {
    try {
      const result = transpileCircuit(gates, backend);
      return {
        backend,
        success: true,
        ...result.stats,
        basisGates: BASIS_SETS[backend]?.native.length || 0
      };
    } catch (error) {
      return {
        backend,
        success: false,
        error: error.message
      };
    }
  });
  
  return results;
}

/**
 * Estimate circuit execution time on hardware
 */
export function estimateExecutionTime(gates, backend) {
  const gateTimes = {
    ibm: { single: 0.03, two: 0.3 }, // microseconds
    google: { single: 0.025, two: 0.032 },
    rigetti: { single: 0.02, two: 0.2 },
    ionq: { single: 0.1, two: 0.2 }
  };
  
  const times = gateTimes[backend] || { single: 0.05, two: 0.5 };
  let totalTime = 0;
  
  gates.forEach(gate => {
    if (gate.target !== undefined || gate.target2 !== undefined) {
      totalTime += times.two;
    } else {
      totalTime += times.single;
    }
  });
  
  return {
    totalTime: totalTime.toFixed(2),
    unit: 'μs',
    gates: gates.length
  };
}
