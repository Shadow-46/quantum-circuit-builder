/**
 * Quantum Noise Models for Circuit Simulation
 * Implements various realistic quantum noise channels
 */

/**
 * Apply depolarizing noise to a quantum state
 * With probability p, applies a random Pauli error (X, Y, or Z)
 * @param {Array} state - Quantum state vector
 * @param {number} qubitIndex - Index of qubit to apply noise to
 * @param {number} probability - Error probability (0-1)
 * @returns {Array} Noisy state vector
 */
export function applyDepolarizingNoise(state, qubitIndex, probability) {
  if (probability === 0 || Math.random() > probability) {
    return state;
  }

  // Randomly choose which Pauli error to apply
  const errorType = Math.floor(Math.random() * 3); // 0=X, 1=Y, 2=Z
  
  const n = Math.log2(state.length);
  const newState = [...state];
  
  for (let i = 0; i < state.length; i++) {
    const bit = (i >> qubitIndex) & 1;
    
    if (errorType === 0) {
      // Pauli X (bit flip)
      const flipped = i ^ (1 << qubitIndex);
      newState[flipped] = state[i];
      newState[i] = state[flipped];
    } else if (errorType === 1) {
      // Pauli Y (bit flip + phase flip)
      const flipped = i ^ (1 << qubitIndex);
      const phase = bit ? -1 : 1;
      newState[flipped] = { 
        re: phase * state[i].re, 
        im: phase * state[i].im 
      };
    } else {
      // Pauli Z (phase flip)
      if (bit === 1) {
        newState[i] = { re: -state[i].re, im: -state[i].im };
      }
    }
  }
  
  return newState;
}

/**
 * Apply amplitude damping noise (energy loss/relaxation)
 * Models T1 relaxation time
 * @param {Array} state - Quantum state vector
 * @param {number} qubitIndex - Index of qubit to apply noise to
 * @param {number} gamma - Damping parameter (0-1)
 * @returns {Array} Noisy state vector
 */
export function applyAmplitudeDamping(state, qubitIndex, gamma) {
  if (gamma === 0) return state;

  const n = Math.log2(state.length);
  const newState = state.map(() => ({ re: 0, im: 0 }));
  
  for (let i = 0; i < state.length; i++) {
    const bit = (i >> qubitIndex) & 1;
    
    if (bit === 0) {
      // |0⟩ state: gets contribution from damped |1⟩
      const flipped = i | (1 << qubitIndex);
      newState[i].re = state[i].re + gamma * state[flipped].re;
      newState[i].im = state[i].im + gamma * state[flipped].im;
    } else {
      // |1⟩ state: loses amplitude
      newState[i].re = Math.sqrt(1 - gamma) * state[i].re;
      newState[i].im = Math.sqrt(1 - gamma) * state[i].im;
    }
  }
  
  return newState;
}

/**
 * Apply phase damping noise (dephasing)
 * Models T2 dephasing time
 * @param {Array} state - Quantum state vector
 * @param {number} qubitIndex - Index of qubit to apply noise to
 * @param {number} gamma - Dephasing parameter (0-1)
 * @returns {Array} Noisy state vector
 */
export function applyPhaseDamping(state, qubitIndex, gamma) {
  if (gamma === 0) return state;

  const newState = [...state];
  
  for (let i = 0; i < state.length; i++) {
    const bit = (i >> qubitIndex) & 1;
    
    if (bit === 1) {
      // Apply phase damping to |1⟩ component
      const factor = Math.sqrt(1 - gamma);
      newState[i] = {
        re: factor * state[i].re,
        im: factor * state[i].im
      };
    }
  }
  
  return newState;
}

/**
 * Apply bit flip noise
 * @param {Array} state - Quantum state vector
 * @param {number} qubitIndex - Index of qubit to apply noise to
 * @param {number} probability - Flip probability (0-1)
 * @returns {Array} Noisy state vector
 */
export function applyBitFlipNoise(state, qubitIndex, probability) {
  if (probability === 0 || Math.random() > probability) {
    return state;
  }

  const newState = [...state];
  
  for (let i = 0; i < state.length; i++) {
    const flipped = i ^ (1 << qubitIndex);
    if (i < flipped) {
      [newState[i], newState[flipped]] = [state[flipped], state[i]];
    }
  }
  
  return newState;
}

/**
 * Apply phase flip noise
 * @param {Array} state - Quantum state vector
 * @param {number} qubitIndex - Index of qubit to apply noise to
 * @param {number} probability - Flip probability (0-1)
 * @returns {Array} Noisy state vector
 */
export function applyPhaseFlipNoise(state, qubitIndex, probability) {
  if (probability === 0 || Math.random() > probability) {
    return state;
  }

  const newState = [...state];
  
  for (let i = 0; i < state.length; i++) {
    const bit = (i >> qubitIndex) & 1;
    if (bit === 1) {
      newState[i] = { 
        re: -state[i].re, 
        im: -state[i].im 
      };
    }
  }
  
  return newState;
}

/**
 * Apply thermal relaxation noise
 * Combines amplitude and phase damping
 * @param {Array} state - Quantum state vector
 * @param {number} qubitIndex - Index of qubit to apply noise to
 * @param {number} t1 - T1 relaxation time
 * @param {number} t2 - T2 dephasing time
 * @param {number} gateTime - Gate execution time
 * @returns {Array} Noisy state vector
 */
export function applyThermalRelaxation(state, qubitIndex, t1, t2, gateTime) {
  if (t1 === Infinity && t2 === Infinity) return state;

  const gammaAmplitude = 1 - Math.exp(-gateTime / t1);
  const gammaPhase = 1 - Math.exp(-gateTime / t2);
  
  let noisyState = applyAmplitudeDamping(state, qubitIndex, gammaAmplitude);
  noisyState = applyPhaseDamping(noisyState, qubitIndex, gammaPhase);
  
  return noisyState;
}

/**
 * Noise model presets based on real quantum hardware
 */
export const NOISE_PRESETS = {
  ideal: {
    name: 'Ideal (No Noise)',
    description: 'Perfect quantum computer with no errors',
    singleQubitError: 0,
    twoQubitError: 0,
    readoutError: 0,
    t1: Infinity,
    t2: Infinity,
    gateTime: 0
  },
  superconducting: {
    name: 'Superconducting Qubit',
    description: 'IBM/Google-style superconducting qubits',
    singleQubitError: 0.001,
    twoQubitError: 0.01,
    readoutError: 0.02,
    t1: 100, // microseconds
    t2: 80,  // microseconds
    gateTime: 0.05 // microseconds
  },
  trappedIon: {
    name: 'Trapped Ion',
    description: 'IonQ/Honeywell-style trapped ions',
    singleQubitError: 0.0001,
    twoQubitError: 0.003,
    readoutError: 0.001,
    t1: 1000, // milliseconds
    t2: 500,  // milliseconds
    gateTime: 0.01
  },
  photonic: {
    name: 'Photonic Qubit',
    description: 'Xanadu-style photonic qubits',
    singleQubitError: 0.0005,
    twoQubitError: 0.05,
    readoutError: 0.01,
    t1: Infinity, // photons don't decay
    t2: 100,
    gateTime: 0.001
  },
  nearTerm: {
    name: 'Near-Term NISQ',
    description: 'Noisy Intermediate-Scale Quantum devices',
    singleQubitError: 0.005,
    twoQubitError: 0.02,
    readoutError: 0.05,
    t1: 50,
    t2: 30,
    gateTime: 0.1
  },
  custom: {
    name: 'Custom',
    description: 'User-defined noise parameters',
    singleQubitError: 0.001,
    twoQubitError: 0.01,
    readoutError: 0.02,
    t1: 100,
    t2: 80,
    gateTime: 0.05
  }
};

/**
 * Apply noise to a gate based on the noise model
 * @param {Array} state - Current quantum state
 * @param {Object} gate - Gate to apply
 * @param {Object} noiseModel - Noise model parameters
 * @returns {Array} State after applying gate with noise
 */
export function applyNoisyGate(state, gate, noiseModel) {
  if (!noiseModel || noiseModel.name === 'Ideal (No Noise)') {
    return state;
  }

  let noisyState = state;
  const isMultiQubit = gate.qubits.length > 1;
  const errorRate = isMultiQubit ? noiseModel.twoQubitError : noiseModel.singleQubitError;

  // Apply gate-specific noise to each qubit involved
  for (const qubitIndex of gate.qubits) {
    // Choose noise channel based on gate type
    if (noiseModel.t1 !== Infinity || noiseModel.t2 !== Infinity) {
      // Thermal relaxation (most realistic)
      noisyState = applyThermalRelaxation(
        noisyState, 
        qubitIndex, 
        noiseModel.t1, 
        noiseModel.t2, 
        noiseModel.gateTime
      );
    } else {
      // Simple depolarizing noise
      noisyState = applyDepolarizingNoise(noisyState, qubitIndex, errorRate);
    }
  }

  return noisyState;
}

/**
 * Apply measurement readout noise
 * @param {Object} results - Measurement results
 * @param {Object} noiseModel - Noise model parameters
 * @returns {Object} Results with readout errors
 */
export function applyReadoutNoise(results, noiseModel) {
  if (!noiseModel || noiseModel.readoutError === 0) {
    return results;
  }

  const noisyResults = { ...results };
  const errorProb = noiseModel.readoutError;

  Object.keys(noisyResults).forEach(state => {
    const count = noisyResults[state];
    
    // For each measurement, flip bits with readout error probability
    for (let i = 0; i < count; i++) {
      if (Math.random() < errorProb) {
        // Flip a random bit
        const bitToFlip = Math.floor(Math.random() * state.length);
        const noisyState = state.split('');
        noisyState[bitToFlip] = noisyState[bitToFlip] === '0' ? '1' : '0';
        const flippedState = noisyState.join('');
        
        noisyResults[state]--;
        noisyResults[flippedState] = (noisyResults[flippedState] || 0) + 1;
      }
    }
  });

  return noisyResults;
}

/**
 * Calculate fidelity between ideal and noisy results
 * @param {Object} idealResults - Ideal measurement results
 * @param {Object} noisyResults - Noisy measurement results
 * @returns {number} Fidelity (0-1)
 */
export function calculateFidelity(idealResults, noisyResults) {
  const allStates = new Set([
    ...Object.keys(idealResults),
    ...Object.keys(noisyResults)
  ]);

  const totalIdeal = Object.values(idealResults).reduce((a, b) => a + b, 0);
  const totalNoisy = Object.values(noisyResults).reduce((a, b) => a + b, 0);

  let fidelity = 0;
  allStates.forEach(state => {
    const pIdeal = (idealResults[state] || 0) / totalIdeal;
    const pNoisy = (noisyResults[state] || 0) / totalNoisy;
    fidelity += Math.sqrt(pIdeal * pNoisy);
  });

  return Math.pow(fidelity, 2);
}

/**
 * Estimate error accumulation for a circuit
 * @param {Array} gates - Circuit gates
 * @param {Object} noiseModel - Noise model parameters
 * @returns {Object} Error statistics
 */
export function estimateCircuitErrors(gates, noiseModel) {
  if (!noiseModel || noiseModel.name === 'Ideal (No Noise)') {
    return {
      totalError: 0,
      singleQubitErrors: 0,
      twoQubitErrors: 0,
      expectedFidelity: 1.0
    };
  }

  let singleQubitErrors = 0;
  let twoQubitErrors = 0;

  gates.forEach(gate => {
    if (gate.qubits.length === 1) {
      singleQubitErrors++;
    } else {
      twoQubitErrors++;
    }
  });

  const totalError = 
    singleQubitErrors * noiseModel.singleQubitError +
    twoQubitErrors * noiseModel.twoQubitError;

  // Estimate overall fidelity (simplified model)
  const expectedFidelity = Math.pow(
    (1 - noiseModel.singleQubitError), singleQubitErrors
  ) * Math.pow(
    (1 - noiseModel.twoQubitError), twoQubitErrors
  );

  return {
    totalError,
    singleQubitErrors,
    twoQubitErrors,
    expectedFidelity,
    estimatedDepth: gates.length
  };
}
