/**
 * Gate Decomposition Library
 * Decomposes complex gates into basis gate sets for different quantum hardware backends
 */

// Common basis gate sets for different quantum hardware platforms
export const BASIS_SETS = {
  // IBM Quantum (basis: {id, rz, sx, cx})
  ibm: {
    name: 'IBM Quantum',
    basis: ['id', 'rz', 'sx', 'cx', 'x'],
    native: ['rz', 'sx', 'cx'],
    coupling: 'heavy-hex', // Heavy-hexagon topology
    description: 'IBM quantum processors use RZ, SX (√X), and CX gates'
  },
  
  // Google Sycamore (basis: {√X, √Y, CZ})
  google: {
    name: 'Google Sycamore',
    basis: ['sx', 'sy', 'rz', 'cz'],
    native: ['sx', 'sy', 'cz'],
    coupling: 'grid-2d',
    description: 'Google uses √X, √Y rotations and CZ gates'
  },
  
  // Rigetti (basis: {RX, RZ, CZ})
  rigetti: {
    name: 'Rigetti',
    basis: ['rx', 'rz', 'cz'],
    native: ['rx', 'rz', 'cz'],
    coupling: 'grid-octagon',
    description: 'Rigetti systems use parametric RX, RZ, and CZ gates'
  },
  
  // IonQ (basis: {RXX, RZ, RX, RY})
  ionq: {
    name: 'IonQ',
    basis: ['rx', 'ry', 'rz', 'rxx'],
    native: ['rx', 'ry', 'rz', 'rxx'],
    coupling: 'all-to-all',
    description: 'IonQ trapped-ion systems have all-to-all connectivity'
  },
  
  // Universal set (common gates)
  universal: {
    name: 'Universal',
    basis: ['h', 'x', 'y', 'z', 's', 't', 'rx', 'ry', 'rz', 'cx', 'cz', 'swap'],
    native: ['h', 'x', 'cx'],
    coupling: 'all-to-all',
    description: 'Universal gate set with all common gates'
  }
};

/**
 * Decompose Hadamard gate into basis gates
 */
export function decomposeHadamard(basisSet) {
  switch (basisSet) {
    case 'ibm':
      // H = RZ(π) SX RZ(π/2)
      return [
        { type: 'rz', angle: Math.PI },
        { type: 'sx' },
        { type: 'rz', angle: Math.PI / 2 }
      ];
    case 'google':
      // H = SY RZ(π/2) SY
      return [
        { type: 'sy' },
        { type: 'rz', angle: Math.PI / 2 },
        { type: 'sy' }
      ];
    case 'rigetti':
      // H = RZ(π/2) RX(π/2) RZ(π/2)
      return [
        { type: 'rz', angle: Math.PI / 2 },
        { type: 'rx', angle: Math.PI / 2 },
        { type: 'rz', angle: Math.PI / 2 }
      ];
    case 'ionq':
      // H = RY(π/2) RX(π)
      return [
        { type: 'ry', angle: Math.PI / 2 },
        { type: 'rx', angle: Math.PI }
      ];
    default:
      return [{ type: 'h' }];
  }
}

/**
 * Decompose Pauli-X gate into basis gates
 */
export function decomposeX(basisSet) {
  switch (basisSet) {
    case 'ibm':
      // X = SX SX
      return [
        { type: 'sx' },
        { type: 'sx' }
      ];
    case 'google':
      // X = SX SX
      return [
        { type: 'sx' },
        { type: 'sx' }
      ];
    case 'rigetti':
      // X = RX(π)
      return [{ type: 'rx', angle: Math.PI }];
    case 'ionq':
      // X = RX(π)
      return [{ type: 'rx', angle: Math.PI }];
    default:
      return [{ type: 'x' }];
  }
}

/**
 * Decompose Pauli-Y gate into basis gates
 */
export function decomposeY(basisSet) {
  switch (basisSet) {
    case 'ibm':
      // Y = RZ(π) SX SX
      return [
        { type: 'rz', angle: Math.PI },
        { type: 'sx' },
        { type: 'sx' }
      ];
    case 'google':
      // Y = SY SY
      return [
        { type: 'sy' },
        { type: 'sy' }
      ];
    case 'rigetti':
      // Y = RZ(π) RX(π)
      return [
        { type: 'rz', angle: Math.PI },
        { type: 'rx', angle: Math.PI }
      ];
    case 'ionq':
      // Y = RY(π)
      return [{ type: 'ry', angle: Math.PI }];
    default:
      return [{ type: 'y' }];
  }
}

/**
 * Decompose Pauli-Z gate into basis gates
 */
export function decomposeZ(basisSet) {
  switch (basisSet) {
    case 'ibm':
      // Z = RZ(π)
      return [{ type: 'rz', angle: Math.PI }];
    case 'google':
      // Z = RZ(π)
      return [{ type: 'rz', angle: Math.PI }];
    case 'rigetti':
      // Z = RZ(π)
      return [{ type: 'rz', angle: Math.PI }];
    case 'ionq':
      // Z = RZ(π)
      return [{ type: 'rz', angle: Math.PI }];
    default:
      return [{ type: 'z' }];
  }
}

/**
 * Decompose S gate (Phase gate) into basis gates
 */
export function decomposeS(basisSet) {
  switch (basisSet) {
    case 'ibm':
    case 'google':
    case 'rigetti':
    case 'ionq':
      // S = RZ(π/2)
      return [{ type: 'rz', angle: Math.PI / 2 }];
    default:
      return [{ type: 's' }];
  }
}

/**
 * Decompose T gate into basis gates
 */
export function decomposeT(basisSet) {
  switch (basisSet) {
    case 'ibm':
    case 'google':
    case 'rigetti':
    case 'ionq':
      // T = RZ(π/4)
      return [{ type: 'rz', angle: Math.PI / 4 }];
    default:
      return [{ type: 't' }];
  }
}

/**
 * Decompose CNOT gate into basis gates
 */
export function decomposeCNOT(basisSet) {
  switch (basisSet) {
    case 'ibm':
      // CNOT is native
      return [{ type: 'cx' }];
    case 'google':
      // CX = H(target) CZ H(target)
      return [
        { type: 'h', target: 'target' },
        { type: 'cz' },
        { type: 'h', target: 'target' }
      ];
    case 'rigetti':
      // CX = RZ(-π/2, target) RX(π/2, target) CZ RX(-π/2, target) RZ(π/2, target)
      return [
        { type: 'rz', angle: -Math.PI / 2, target: 'target' },
        { type: 'rx', angle: Math.PI / 2, target: 'target' },
        { type: 'cz' },
        { type: 'rx', angle: -Math.PI / 2, target: 'target' },
        { type: 'rz', angle: Math.PI / 2, target: 'target' }
      ];
    case 'ionq':
      // CX = RY(π/2, target) RXX(π/2) RX(-π/2, control) RX(-π/2, target) RY(-π/2, target)
      return [
        { type: 'ry', angle: Math.PI / 2, target: 'target' },
        { type: 'rxx', angle: Math.PI / 2 },
        { type: 'rx', angle: -Math.PI / 2, target: 'control' },
        { type: 'rx', angle: -Math.PI / 2, target: 'target' },
        { type: 'ry', angle: -Math.PI / 2, target: 'target' }
      ];
    default:
      return [{ type: 'cx' }];
  }
}

/**
 * Decompose CZ gate into basis gates
 */
export function decomposeCZ(basisSet) {
  switch (basisSet) {
    case 'ibm':
      // CZ = H(target) CX H(target)
      return [
        { type: 'h', target: 'target' },
        { type: 'cx' },
        { type: 'h', target: 'target' }
      ];
    case 'google':
      // CZ is native
      return [{ type: 'cz' }];
    case 'rigetti':
      // CZ is native
      return [{ type: 'cz' }];
    case 'ionq':
      // CZ = RX(π/2, target) RXX(π/2) RX(-π/2, control) RZ(π/2, target) RX(-π/2, target)
      return [
        { type: 'rx', angle: Math.PI / 2, target: 'target' },
        { type: 'rxx', angle: Math.PI / 2 },
        { type: 'rx', angle: -Math.PI / 2, target: 'control' },
        { type: 'rz', angle: Math.PI / 2, target: 'target' },
        { type: 'rx', angle: -Math.PI / 2, target: 'target' }
      ];
    default:
      return [{ type: 'cz' }];
  }
}

/**
 * Decompose SWAP gate into basis gates
 */
export function decomposeSWAP(basisSet) {
  // SWAP = CX(A,B) CX(B,A) CX(A,B)
  const cx1 = decomposeCNOT(basisSet);
  const cx2 = decomposeCNOT(basisSet).map(g => ({
    ...g,
    target: g.target === 'control' ? 'target' : g.target === 'target' ? 'control' : g.target
  }));
  const cx3 = decomposeCNOT(basisSet);
  
  return [...cx1, ...cx2, ...cx3];
}

/**
 * Decompose Toffoli (CCNOT) gate into basis gates
 */
export function decomposeToffoli(basisSet) {
  // Toffoli decomposition using 6 CNOTs and single-qubit gates
  const gates = [];
  
  // Standard Toffoli decomposition
  gates.push({ type: 'h', target: 'target' });
  gates.push({ type: 'cx', control: 'control2', target: 'target' });
  gates.push({ type: 't', dagger: true, target: 'target' });
  gates.push({ type: 'cx', control: 'control1', target: 'target' });
  gates.push({ type: 't', target: 'target' });
  gates.push({ type: 'cx', control: 'control2', target: 'target' });
  gates.push({ type: 't', dagger: true, target: 'target' });
  gates.push({ type: 'cx', control: 'control1', target: 'target' });
  gates.push({ type: 't', target: 'control2' });
  gates.push({ type: 't', target: 'target' });
  gates.push({ type: 'cx', control: 'control1', target: 'control2' });
  gates.push({ type: 'h', target: 'target' });
  gates.push({ type: 't', target: 'control1' });
  gates.push({ type: 't', dagger: true, target: 'control2' });
  gates.push({ type: 'cx', control: 'control1', target: 'control2' });
  
  // Further decompose each gate if needed
  return gates.flatMap(gate => {
    if (gate.type === 'h') return decomposeHadamard(basisSet);
    if (gate.type === 'cx') return decomposeCNOT(basisSet);
    if (gate.type === 't') return gate.dagger ? 
      [{ type: 'rz', angle: -Math.PI / 4 }] : 
      [{ type: 'rz', angle: Math.PI / 4 }];
    return [gate];
  });
}

/**
 * Decompose Fredkin (CSWAP) gate into basis gates
 */
export function decomposeFredkin(basisSet) {
  // Fredkin = Toffoli-based decomposition
  const gates = [];
  
  gates.push({ type: 'cx', control: 'target2', target: 'target1' });
  gates.push({ type: 'ccx', control1: 'control', control2: 'target1', target: 'target2' });
  gates.push({ type: 'cx', control: 'target2', target: 'target1' });
  
  return gates.flatMap(gate => {
    if (gate.type === 'cx') return decomposeCNOT(basisSet);
    if (gate.type === 'ccx') return decomposeToffoli(basisSet);
    return [gate];
  });
}

/**
 * Decompose rotation gates into basis gates
 */
export function decomposeRotation(gateType, angle, basisSet) {
  // Most platforms support RZ natively
  if (gateType === 'rz') {
    return [{ type: 'rz', angle }];
  }
  
  // Decompose RX and RY based on platform
  if (gateType === 'rx') {
    switch (basisSet) {
      case 'ibm':
      case 'google':
        // RX(θ) = RZ(-π/2) SX RZ(θ) SX RZ(π/2)
        return [
          { type: 'rz', angle: -Math.PI / 2 },
          { type: 'sx' },
          { type: 'rz', angle },
          { type: 'sx' },
          { type: 'rz', angle: Math.PI / 2 }
        ];
      case 'rigetti':
      case 'ionq':
        return [{ type: 'rx', angle }];
      default:
        return [{ type: 'rx', angle }];
    }
  }
  
  if (gateType === 'ry') {
    switch (basisSet) {
      case 'ibm':
        // RY(θ) = SX RZ(θ) SX
        return [
          { type: 'sx' },
          { type: 'rz', angle },
          { type: 'sx' }
        ];
      case 'google':
        // RY(θ) = SY RZ(θ) SY
        return [
          { type: 'sy' },
          { type: 'rz', angle },
          { type: 'sy' }
        ];
      case 'rigetti':
        // RY(θ) = RZ(-π/2) RX(θ) RZ(π/2)
        return [
          { type: 'rz', angle: -Math.PI / 2 },
          { type: 'rx', angle },
          { type: 'rz', angle: Math.PI / 2 }
        ];
      case 'ionq':
        return [{ type: 'ry', angle }];
      default:
        return [{ type: 'ry', angle }];
    }
  }
  
  return [{ type: gateType, angle }];
}

/**
 * Main gate decomposition function
 * Takes a gate and decomposes it into the specified basis set
 */
export function decomposeGate(gate, basisSet = 'universal') {
  const gateType = gate.type.toLowerCase();
  
  // Check if gate is already in basis set
  if (BASIS_SETS[basisSet]?.basis.includes(gateType)) {
    return [{ ...gate }];
  }
  
  // Decompose based on gate type
  switch (gateType) {
    case 'h':
      return decomposeHadamard(basisSet).map(g => ({ ...g, qubit: gate.qubit }));
    case 'x':
      return decomposeX(basisSet).map(g => ({ ...g, qubit: gate.qubit }));
    case 'y':
      return decomposeY(basisSet).map(g => ({ ...g, qubit: gate.qubit }));
    case 'z':
      return decomposeZ(basisSet).map(g => ({ ...g, qubit: gate.qubit }));
    case 's':
      return decomposeS(basisSet).map(g => ({ ...g, qubit: gate.qubit }));
    case 't':
      return decomposeT(basisSet).map(g => ({ ...g, qubit: gate.qubit }));
    case 'cx':
    case 'cnot':
      return decomposeCNOT(basisSet).map(g => ({
        ...g,
        qubit: g.target === 'control' ? gate.qubit : g.target === 'target' ? gate.target : gate.qubit,
        target: g.target === 'target' ? gate.target : undefined
      }));
    case 'cz':
      return decomposeCZ(basisSet).map(g => ({
        ...g,
        qubit: g.target === 'control' ? gate.qubit : g.target === 'target' ? gate.target : gate.qubit,
        target: g.target === 'target' ? gate.target : undefined
      }));
    case 'swap':
      return decomposeSWAP(basisSet).map((g, i) => {
        if (i % 3 === 1) {
          return { ...g, qubit: gate.target, target: gate.qubit };
        }
        return { ...g, qubit: gate.qubit, target: gate.target };
      });
    case 'toffoli':
    case 'ccx':
      return decomposeToffoli(basisSet).map(g => ({
        ...g,
        qubit: gate.qubit,
        target: gate.target,
        target2: gate.target2
      }));
    case 'fredkin':
    case 'cswap':
      return decomposeFredkin(basisSet).map(g => ({
        ...g,
        qubit: gate.qubit,
        target: gate.target,
        target2: gate.target2
      }));
    case 'rx':
    case 'ry':
    case 'rz':
      return decomposeRotation(gateType, gate.angle || 0, basisSet).map(g => ({
        ...g,
        qubit: gate.qubit
      }));
    default:
      // Gate not recognized, return as-is
      return [{ ...gate }];
  }
}

/**
 * Transpile an entire circuit to a target basis set
 */
export function transpileCircuit(gates, targetBasisSet = 'universal') {
  const transpiledGates = [];
  
  for (const gate of gates) {
    const decomposed = decomposeGate(gate, targetBasisSet);
    transpiledGates.push(...decomposed);
  }
  
  return transpiledGates;
}

/**
 * Get statistics about transpilation
 */
export function getTranspilationStats(originalGates, transpiledGates) {
  const originalCount = originalGates.length;
  const transpiledCount = transpiledGates.length;
  const expansion = transpiledCount / originalCount;
  
  // Count gate types
  const originalTypes = {};
  const transpiledTypes = {};
  
  originalGates.forEach(g => {
    originalTypes[g.type] = (originalTypes[g.type] || 0) + 1;
  });
  
  transpiledGates.forEach(g => {
    transpiledTypes[g.type] = (transpiledTypes[g.type] || 0) + 1;
  });
  
  return {
    originalCount,
    transpiledCount,
    expansion: expansion.toFixed(2),
    originalTypes,
    transpiledTypes,
    gateReduction: originalCount > transpiledCount ? 
      `${(((originalCount - transpiledCount) / originalCount) * 100).toFixed(1)}% reduction` :
      `${(((transpiledCount - originalCount) / originalCount) * 100).toFixed(1)}% increase`
  };
}
