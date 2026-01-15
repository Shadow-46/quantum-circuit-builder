// Pre-built quantum algorithm templates and building blocks

export const TEMPLATE_CATEGORIES = {
  ALGORITHMS: 'algorithms',
  BUILDING_BLOCKS: 'building_blocks',
  BENCHMARKS: 'benchmarks',
  TUTORIALS: 'tutorials',
};

export const CIRCUIT_TEMPLATES = {
  // ==================== ALGORITHMS ====================
  bell_state: {
    id: 'bell_state',
    name: 'Bell State (EPR Pair)',
    category: TEMPLATE_CATEGORIES.ALGORITHMS,
    description: 'Creates a maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
    numQubits: 2,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
    ],
    complexity: 'Beginner',
    gateCount: 2,
    depth: 2,
    tags: ['entanglement', 'fundamental', 'tutorial'],
    learningOutcome: 'Demonstrates quantum entanglement and superposition',
  },

  grover_2qubit: {
    id: 'grover_2qubit',
    name: "Grover's Algorithm (2-qubit)",
    category: TEMPLATE_CATEGORIES.ALGORITHMS,
    description: 'Database search algorithm for finding marked item in unsorted database',
    numQubits: 2,
    gates: [
      // Initialize to |11⟩ state
      { type: 'X', qubit: 0, step: 0 },
      { type: 'X', qubit: 1, step: 0 },
      // Hadamard all qubits
      { type: 'H', qubit: 0, step: 1 },
      { type: 'H', qubit: 1, step: 1 },
      // Oracle (marks |11⟩ state)
      { type: 'CZ', qubit: 0, targetQubit: 1, step: 2 },
      // Diffusion operator
      { type: 'H', qubit: 0, step: 3 },
      { type: 'H', qubit: 1, step: 3 },
      { type: 'X', qubit: 0, step: 4 },
      { type: 'X', qubit: 1, step: 4 },
      { type: 'CZ', qubit: 0, targetQubit: 1, step: 5 },
      { type: 'X', qubit: 0, step: 6 },
      { type: 'X', qubit: 1, step: 6 },
      { type: 'H', qubit: 0, step: 7 },
      { type: 'H', qubit: 1, step: 7 },
    ],
    complexity: 'Intermediate',
    gateCount: 14,
    depth: 8,
    tags: ['search', 'algorithm', 'amplitude-amplification'],
    learningOutcome: 'Demonstrates quantum search speedup (O(√N) vs O(N))',
  },

  qft_3qubit: {
    id: 'qft_3qubit',
    name: 'Quantum Fourier Transform (3-qubit)',
    category: TEMPLATE_CATEGORIES.ALGORITHMS,
    description: 'Quantum analogue of discrete Fourier transform, key component in many algorithms',
    numQubits: 3,
    gates: [
      // QFT on qubit 0
      { type: 'H', qubit: 0, step: 0 },
      { type: 'CRZ', qubit: 1, targetQubit: 0, angle: Math.PI / 2, step: 1 },
      { type: 'CRZ', qubit: 2, targetQubit: 0, angle: Math.PI / 4, step: 2 },
      // QFT on qubit 1
      { type: 'H', qubit: 1, step: 3 },
      { type: 'CRZ', qubit: 2, targetQubit: 1, angle: Math.PI / 2, step: 4 },
      // QFT on qubit 2
      { type: 'H', qubit: 2, step: 5 },
      // Swap qubits for correct ordering
      { type: 'SWAP', qubit: 0, targetQubit: 2, step: 6 },
    ],
    complexity: 'Advanced',
    gateCount: 7,
    depth: 7,
    tags: ['fourier', 'transform', 'fundamental'],
    learningOutcome: 'Foundation for Shor\'s algorithm and quantum phase estimation',
  },

  deutsch_jozsa: {
    id: 'deutsch_jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: TEMPLATE_CATEGORIES.ALGORITHMS,
    description: 'Determines if a function is constant or balanced with one query',
    numQubits: 3,
    gates: [
      // Initialize ancilla qubit to |1⟩
      { type: 'X', qubit: 2, step: 0 },
      // Hadamard all qubits
      { type: 'H', qubit: 0, step: 1 },
      { type: 'H', qubit: 1, step: 1 },
      { type: 'H', qubit: 2, step: 1 },
      // Oracle (balanced function example)
      { type: 'CNOT', qubit: 0, targetQubit: 2, step: 2 },
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 },
      // Hadamard on input qubits
      { type: 'H', qubit: 0, step: 3 },
      { type: 'H', qubit: 1, step: 3 },
    ],
    complexity: 'Intermediate',
    gateCount: 8,
    depth: 4,
    tags: ['algorithm', 'oracle', 'query'],
    learningOutcome: 'First algorithm showing quantum speedup over classical',
  },

  bernstein_vazirani: {
    id: 'bernstein_vazirani',
    name: 'Bernstein-Vazirani Algorithm',
    category: TEMPLATE_CATEGORIES.ALGORITHMS,
    description: 'Finds hidden binary string in one query (classical needs n queries)',
    numQubits: 3,
    gates: [
      // Initialize ancilla to |1⟩
      { type: 'X', qubit: 2, step: 0 },
      // Hadamard all qubits
      { type: 'H', qubit: 0, step: 1 },
      { type: 'H', qubit: 1, step: 1 },
      { type: 'H', qubit: 2, step: 1 },
      // Oracle for hidden string "11" (both CNOTs fire)
      { type: 'CNOT', qubit: 0, targetQubit: 2, step: 2 },
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 },
      // Hadamard on input qubits
      { type: 'H', qubit: 0, step: 3 },
      { type: 'H', qubit: 1, step: 3 },
    ],
    complexity: 'Intermediate',
    gateCount: 8,
    depth: 4,
    tags: ['algorithm', 'hidden-string', 'oracle'],
    learningOutcome: 'Demonstrates exponential speedup in query complexity',
  },

  // ==================== BUILDING BLOCKS ====================
  superposition: {
    id: 'superposition',
    name: 'Equal Superposition State',
    category: TEMPLATE_CATEGORIES.BUILDING_BLOCKS,
    description: 'Creates equal superposition |+⟩ = (|0⟩ + |1⟩)/√2 on all qubits',
    numQubits: 3,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'H', qubit: 1, step: 0 },
      { type: 'H', qubit: 2, step: 0 },
    ],
    complexity: 'Beginner',
    gateCount: 3,
    depth: 1,
    tags: ['superposition', 'initialization', 'fundamental'],
    learningOutcome: 'Basic quantum state preparation',
  },

  ghz_state: {
    id: 'ghz_state',
    name: 'GHZ State (3-qubit)',
    category: TEMPLATE_CATEGORIES.BUILDING_BLOCKS,
    description: 'Creates Greenberger-Horne-Zeilinger state: (|000⟩ + |111⟩)/√2',
    numQubits: 3,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 },
    ],
    complexity: 'Beginner',
    gateCount: 3,
    depth: 3,
    tags: ['entanglement', 'ghz', 'fundamental'],
    learningOutcome: 'Multi-qubit entanglement, used in quantum communication',
  },

  w_state: {
    id: 'w_state',
    name: 'W State (3-qubit)',
    category: TEMPLATE_CATEGORIES.BUILDING_BLOCKS,
    description: 'Creates W state: (|100⟩ + |010⟩ + |001⟩)/√3',
    numQubits: 3,
    gates: [
      // Approximation using controlled rotations
      { type: 'RY', qubit: 0, angle: 1.9106, step: 0 }, // arccos(√(1/3))
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
      { type: 'X', qubit: 0, step: 2 },
      { type: 'CRY', qubit: 0, targetQubit: 2, angle: 1.5708, step: 3 }, // π/4
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 4 },
    ],
    complexity: 'Advanced',
    gateCount: 5,
    depth: 5,
    tags: ['entanglement', 'w-state', 'robust'],
    learningOutcome: 'Robust entanglement, maintains entanglement if one qubit is lost',
  },

  quantum_adder: {
    id: 'quantum_adder',
    name: 'Quantum Half-Adder',
    category: TEMPLATE_CATEGORIES.BUILDING_BLOCKS,
    description: 'Adds two qubits: |a⟩|b⟩ → |a⟩|a⊕b⟩',
    numQubits: 2,
    gates: [
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 0 },
    ],
    complexity: 'Beginner',
    gateCount: 1,
    depth: 1,
    tags: ['arithmetic', 'building-block', 'addition'],
    learningOutcome: 'Basic quantum arithmetic operation',
  },

  phase_kickback: {
    id: 'phase_kickback',
    name: 'Phase Kickback Demo',
    category: TEMPLATE_CATEGORIES.BUILDING_BLOCKS,
    description: 'Demonstrates phase kickback mechanism used in many algorithms',
    numQubits: 2,
    gates: [
      // Prepare control in superposition
      { type: 'H', qubit: 0, step: 0 },
      // Prepare target in |-⟩ state
      { type: 'X', qubit: 1, step: 1 },
      { type: 'H', qubit: 1, step: 2 },
      // Controlled operation
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 3 },
      // Measure control to see phase
      { type: 'H', qubit: 0, step: 4 },
    ],
    complexity: 'Intermediate',
    gateCount: 5,
    depth: 5,
    tags: ['phase', 'interference', 'fundamental'],
    learningOutcome: 'Key mechanism in Shor\'s and other quantum algorithms',
  },

  // ==================== BENCHMARKS ====================
  random_circuit_small: {
    id: 'random_circuit_small',
    name: 'Random Circuit (Small)',
    category: TEMPLATE_CATEGORIES.BENCHMARKS,
    description: 'Small random circuit for testing simulator performance',
    numQubits: 3,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'H', qubit: 1, step: 0 },
      { type: 'H', qubit: 2, step: 0 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
      { type: 'T', qubit: 2, step: 1 },
      { type: 'RZ', qubit: 1, angle: 0.5, step: 2 },
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 3 },
      { type: 'S', qubit: 0, step: 3 },
    ],
    complexity: 'Beginner',
    gateCount: 8,
    depth: 4,
    tags: ['benchmark', 'testing', 'random'],
    learningOutcome: 'Performance testing and validation',
  },

  supremacy_inspired: {
    id: 'supremacy_inspired',
    name: 'Quantum Supremacy Pattern',
    category: TEMPLATE_CATEGORIES.BENCHMARKS,
    description: 'Inspired by Google\'s quantum supremacy experiment pattern',
    numQubits: 4,
    gates: [
      // Layer 1: Single-qubit gates
      { type: 'H', qubit: 0, step: 0 },
      { type: 'H', qubit: 1, step: 0 },
      { type: 'H', qubit: 2, step: 0 },
      { type: 'H', qubit: 3, step: 0 },
      // Layer 2: Two-qubit gates (even pairs)
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
      { type: 'CNOT', qubit: 2, targetQubit: 3, step: 1 },
      // Layer 3: Single-qubit rotations
      { type: 'RX', qubit: 0, angle: 0.7, step: 2 },
      { type: 'RY', qubit: 1, angle: 1.2, step: 2 },
      { type: 'RX', qubit: 2, angle: 0.5, step: 2 },
      { type: 'RY', qubit: 3, angle: 0.9, step: 2 },
      // Layer 4: Two-qubit gates (odd pairs)
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 3 },
      // Layer 5: Final rotations
      { type: 'RZ', qubit: 0, angle: 0.3, step: 4 },
      { type: 'RZ', qubit: 1, angle: 0.6, step: 4 },
      { type: 'RZ', qubit: 2, angle: 0.4, step: 4 },
      { type: 'RZ', qubit: 3, angle: 0.8, step: 4 },
    ],
    complexity: 'Advanced',
    gateCount: 15,
    depth: 5,
    tags: ['benchmark', 'supremacy', 'deep-circuit'],
    learningOutcome: 'Understanding quantum computational advantage',
  },

  // ==================== TUTORIALS ====================
  single_qubit_gates: {
    id: 'single_qubit_gates',
    name: 'Single-Qubit Gates Tutorial',
    category: TEMPLATE_CATEGORIES.TUTORIALS,
    description: 'Demonstrates common single-qubit gates: X, Y, Z, H, S, T',
    numQubits: 6,
    gates: [
      // Qubit 0: Pauli X (bit flip)
      { type: 'X', qubit: 0, step: 0 },
      // Qubit 1: Pauli Y
      { type: 'Y', qubit: 1, step: 0 },
      // Qubit 2: Pauli Z (phase flip)
      { type: 'Z', qubit: 2, step: 0 },
      // Qubit 3: Hadamard (superposition)
      { type: 'H', qubit: 3, step: 0 },
      // Qubit 4: S gate (π/2 phase)
      { type: 'S', qubit: 4, step: 0 },
      // Qubit 5: T gate (π/4 phase)
      { type: 'T', qubit: 5, step: 0 },
    ],
    complexity: 'Beginner',
    gateCount: 6,
    depth: 1,
    tags: ['tutorial', 'gates', 'basics'],
    learningOutcome: 'Understanding basic single-qubit operations',
  },

  two_qubit_gates: {
    id: 'two_qubit_gates',
    name: 'Two-Qubit Gates Tutorial',
    category: TEMPLATE_CATEGORIES.TUTORIALS,
    description: 'Demonstrates two-qubit gates: CNOT, CZ, SWAP',
    numQubits: 4,
    gates: [
      // Initialize qubits
      { type: 'X', qubit: 0, step: 0 },
      { type: 'X', qubit: 2, step: 0 },
      // CNOT demonstration
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
      // CZ demonstration
      { type: 'CZ', qubit: 2, targetQubit: 3, step: 2 },
      // SWAP demonstration
      { type: 'SWAP', qubit: 1, targetQubit: 2, step: 3 },
    ],
    complexity: 'Beginner',
    gateCount: 5,
    depth: 4,
    tags: ['tutorial', 'two-qubit', 'entanglement'],
    learningOutcome: 'Understanding two-qubit interactions',
  },

  measurement_basics: {
    id: 'measurement_basics',
    name: 'Measurement Basics',
    category: TEMPLATE_CATEGORIES.TUTORIALS,
    description: 'Understanding quantum measurement and probability',
    numQubits: 3,
    gates: [
      // Qubit 0: Always measures 0 (no gates)
      // Qubit 1: Always measures 1
      { type: 'X', qubit: 1, step: 0 },
      // Qubit 2: 50/50 superposition
      { type: 'H', qubit: 2, step: 0 },
    ],
    complexity: 'Beginner',
    gateCount: 2,
    depth: 1,
    tags: ['tutorial', 'measurement', 'probability'],
    learningOutcome: 'Understanding quantum measurement collapse',
  },
};

// Get templates by category
export const getTemplatesByCategory = (category) => {
  return Object.values(CIRCUIT_TEMPLATES).filter(
    (template) => template.category === category
  );
};

// Get template by ID
export const getTemplateById = (id) => {
  return CIRCUIT_TEMPLATES[id] || null;
};

// Search templates
export const searchTemplates = (query) => {
  const lowerQuery = query.toLowerCase();
  return Object.values(CIRCUIT_TEMPLATES).filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some((tag) => tag.includes(lowerQuery))
  );
};

// Get all unique tags
export const getAllTags = () => {
  const tags = new Set();
  Object.values(CIRCUIT_TEMPLATES).forEach((template) => {
    template.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

// Filter templates by complexity
export const filterByComplexity = (complexity) => {
  return Object.values(CIRCUIT_TEMPLATES).filter(
    (template) => template.complexity === complexity
  );
};

// Filter templates by qubit count
export const filterByQubitCount = (minQubits, maxQubits) => {
  return Object.values(CIRCUIT_TEMPLATES).filter(
    (template) =>
      template.numQubits >= minQubits && template.numQubits <= maxQubits
  );
};

// Get statistics
export const getTemplateStatistics = () => {
  const templates = Object.values(CIRCUIT_TEMPLATES);
  return {
    total: templates.length,
    byCategory: {
      algorithms: getTemplatesByCategory(TEMPLATE_CATEGORIES.ALGORITHMS).length,
      building_blocks: getTemplatesByCategory(TEMPLATE_CATEGORIES.BUILDING_BLOCKS).length,
      benchmarks: getTemplatesByCategory(TEMPLATE_CATEGORIES.BENCHMARKS).length,
      tutorials: getTemplatesByCategory(TEMPLATE_CATEGORIES.TUTORIALS).length,
    },
    byComplexity: {
      beginner: filterByComplexity('Beginner').length,
      intermediate: filterByComplexity('Intermediate').length,
      advanced: filterByComplexity('Advanced').length,
    },
    avgGateCount: Math.round(
      templates.reduce((sum, t) => sum + t.gateCount, 0) / templates.length
    ),
    avgDepth: Math.round(
      templates.reduce((sum, t) => sum + t.depth, 0) / templates.length
    ),
  };
};
