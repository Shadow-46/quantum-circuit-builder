export const gateExplanations = {
  H: {
    name: 'Hadamard Gate',
    symbol: 'H',
    description: 'Creates an equal superposition state',
    matrix: [
      ['1/√2', '1/√2'],
      ['1/√2', '-1/√2']
    ],
    effects: [
      'H|0⟩ = (|0⟩ + |1⟩)/√2',
      'H|1⟩ = (|0⟩ - |1⟩)/√2'
    ],
    uses: [
      'Creating superposition',
      'Basis transformation',
      'Interference effects',
      'Key component in many quantum algorithms'
    ],
    blochSphere: 'Rotates state π radians (180°) around the axis (X+Z)/√2'
  },
  X: {
    name: 'Pauli-X Gate (NOT)',
    symbol: 'X',
    description: 'Quantum NOT gate - flips |0⟩ ↔ |1⟩',
    matrix: [
      ['0', '1'],
      ['1', '0']
    ],
    effects: [
      'X|0⟩ = |1⟩',
      'X|1⟩ = |0⟩'
    ],
    uses: [
      'Bit flip operation',
      'State preparation',
      'Error correction',
      'Implementing classical logic'
    ],
    blochSphere: 'Rotates π radians (180°) around the X-axis'
  },
  Y: {
    name: 'Pauli-Y Gate',
    symbol: 'Y',
    description: 'Flips and adds phase: i|1⟩ ↔ -i|0⟩',
    matrix: [
      ['0', '-i'],
      ['i', '0']
    ],
    effects: [
      'Y|0⟩ = i|1⟩',
      'Y|1⟩ = -i|0⟩'
    ],
    uses: [
      'Combined bit and phase flip',
      'Quantum error correction',
      'Implementing rotations'
    ],
    blochSphere: 'Rotates π radians (180°) around the Y-axis'
  },
  Z: {
    name: 'Pauli-Z Gate (Phase Flip)',
    symbol: 'Z',
    description: 'Adds phase: |1⟩ → -|1⟩',
    matrix: [
      ['1', '0'],
      ['0', '-1']
    ],
    effects: [
      'Z|0⟩ = |0⟩',
      'Z|1⟩ = -|1⟩'
    ],
    uses: [
      'Phase flip',
      'Creating interference',
      'Implementing controlled operations',
      'Quantum phase estimation'
    ],
    blochSphere: 'Rotates π radians (180°) around the Z-axis'
  },
  S: {
    name: 'S Gate (Phase Gate)',
    symbol: 'S',
    description: 'Adds quarter phase: |1⟩ → i|1⟩',
    matrix: [
      ['1', '0'],
      ['0', 'i']
    ],
    effects: [
      'S|0⟩ = |0⟩',
      'S|1⟩ = i|1⟩'
    ],
    uses: [
      'Phase manipulation',
      'Building T gate',
      'Quantum Fourier Transform'
    ],
    blochSphere: 'Rotates π/2 radians (90°) around the Z-axis'
  },
  T: {
    name: 'T Gate (π/8 Gate)',
    symbol: 'T',
    description: 'Adds eighth phase: |1⟩ → e^(iπ/4)|1⟩',
    matrix: [
      ['1', '0'],
      ['0', 'e^(iπ/4)']
    ],
    effects: [
      'T|0⟩ = |0⟩',
      'T|1⟩ = e^(iπ/4)|1⟩'
    ],
    uses: [
      'Universal quantum computation',
      'Implementing arbitrary rotations',
      'Fault-tolerant quantum computing'
    ],
    blochSphere: 'Rotates π/4 radians (45°) around the Z-axis'
  },
  RX: {
    name: 'X-Rotation Gate',
    symbol: 'RX(θ)',
    description: 'Rotates around X-axis by angle θ',
    effects: [
      'RX(θ) rotates the Bloch vector',
      'RX(π) = X gate'
    ],
    uses: [
      'Precise state manipulation',
      'Quantum algorithms',
      'Gate decomposition'
    ],
    blochSphere: 'Rotates θ radians around the X-axis'
  },
  RY: {
    name: 'Y-Rotation Gate',
    symbol: 'RY(θ)',
    description: 'Rotates around Y-axis by angle θ',
    effects: [
      'RY(θ) rotates the Bloch vector',
      'RY(π) = Y gate'
    ],
    uses: [
      'State preparation',
      'Variational quantum algorithms',
      'Quantum machine learning'
    ],
    blochSphere: 'Rotates θ radians around the Y-axis'
  },
  RZ: {
    name: 'Z-Rotation Gate',
    symbol: 'RZ(θ)',
    description: 'Rotates around Z-axis by angle θ',
    effects: [
      'RZ(θ) applies phase rotation',
      'RZ(π) = Z gate'
    ],
    uses: [
      'Phase manipulation',
      'Quantum Fourier Transform',
      'Phase estimation algorithms'
    ],
    blochSphere: 'Rotates θ radians around the Z-axis'
  },
  CNOT: {
    name: 'Controlled-NOT Gate',
    symbol: 'CNOT',
    description: 'Flips target if control is |1⟩',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
      ['0', '0', '1', '0']
    ],
    effects: [
      'CNOT|00⟩ = |00⟩',
      'CNOT|01⟩ = |01⟩',
      'CNOT|10⟩ = |11⟩',
      'CNOT|11⟩ = |10⟩'
    ],
    uses: [
      'Creating entanglement',
      'Bell state preparation',
      'Quantum error correction',
      'Universal quantum computation'
    ],
    note: 'Requires 2 qubits: control and target'
  },
  SWAP: {
    name: 'SWAP Gate',
    symbol: 'SWAP',
    description: 'Exchanges states of two qubits',
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1']
    ],
    effects: [
      'SWAP|00⟩ = |00⟩',
      'SWAP|01⟩ = |10⟩',
      'SWAP|10⟩ = |01⟩',
      'SWAP|11⟩ = |11⟩'
    ],
    uses: [
      'Qubit routing',
      'Quantum communication',
      'Circuit optimization'
    ],
    note: 'Requires 2 qubits'
  }
};

export function getGateExplanation(gateType) {
  return gateExplanations[gateType] || {
    name: gateType,
    description: 'Quantum gate',
    effects: [],
    uses: []
  };
}
