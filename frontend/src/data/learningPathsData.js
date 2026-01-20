/**
 * Learning Paths Data
 * Structured curriculum for quantum computing education
 */

export const LEARNING_PATHS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

export const LESSON_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const learningPathsData = {
  [LEARNING_PATHS.BEGINNER]: {
    id: LEARNING_PATHS.BEGINNER,
    title: 'Beginner: Quantum Basics',
    description: 'Start your quantum journey with fundamental concepts',
    icon: '🌱',
    difficulty: 1,
    estimatedHours: 12,
    lessons: [
      {
        id: 'beginner-1',
        title: 'What is Quantum Computing?',
        description: 'Introduction to quantum mechanics and quantum computers',
        duration: 45,
        topics: ['Superposition', 'Quantum Bits', 'Classical vs Quantum'],
        circuit: null,
        quiz: [
          {
            question: 'What is a qubit?',
            options: [
              'A quantum bit that can be 0 or 1',
              'A quantum bit that can be in superposition',
              'A classical bit',
              'A quantum gate',
            ],
            correct: 1,
          },
          {
            question: 'How many states can a classical bit have?',
            options: ['1', '2', '3', 'Infinite'],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-2',
        title: 'Your First Quantum Gate',
        description: 'Learn about the Hadamard gate and superposition',
        duration: 60,
        topics: ['Hadamard Gate', 'Superposition', 'Measurement'],
        circuit: {
          numQubits: 1,
          gates: [{ type: 'H', qubit: 0 }],
        },
        quiz: [
          {
            question: 'What does the Hadamard gate create?',
            options: ['Entanglement', 'Superposition', 'Measurement', 'Interference'],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-3',
        title: 'Pauli Gates (X, Y, Z)',
        description: 'Understand single-qubit rotation gates',
        duration: 60,
        topics: ['X Gate', 'Y Gate', 'Z Gate', 'Bit Flip', 'Phase Flip'],
        circuit: {
          numQubits: 1,
          gates: [
            { type: 'X', qubit: 0 },
            { type: 'Y', qubit: 0 },
            { type: 'Z', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'Which gate flips the qubit state?',
            options: ['H', 'X', 'Z', 'T'],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-4',
        title: 'Quantum Measurement',
        description: 'Learn how measurement collapses quantum states',
        duration: 50,
        topics: ['Measurement', 'Collapse', 'Probability', 'Observables'],
        circuit: {
          numQubits: 1,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'MEASURE', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'What happens when you measure a qubit?',
            options: [
              'Nothing',
              'It stays in superposition',
              'The state collapses to 0 or 1',
              'It becomes entangled',
            ],
            correct: 2,
          },
        ],
      },
      {
        id: 'beginner-5',
        title: 'Two-Qubit Systems',
        description: 'Introduction to multi-qubit quantum states',
        duration: 75,
        topics: ['Two Qubits', 'Tensor Product', 'Basis States'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
          ],
        },
        quiz: [
          {
            question: 'How many basis states does a 2-qubit system have?',
            options: ['2', '4', '8', '16'],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-6',
        title: 'CNOT Gate',
        description: 'Learn about controlled operations and entanglement',
        duration: 70,
        topics: ['CNOT', 'Controlled Gates', 'Control/Target Qubits'],
        circuit: {
          numQubits: 2,
          gates: [{ type: 'CNOT', control: 0, target: 1 }],
        },
        quiz: [
          {
            question: 'What does CNOT stand for?',
            options: [
              'Controlled-NOT',
              'Control Number Of Times',
              'Classical NOT',
              'Continuous NOT',
            ],
            correct: 0,
          },
        ],
      },
      {
        id: 'beginner-7',
        title: 'Creating Entanglement',
        description: 'Build your first entangled state',
        duration: 80,
        topics: ['Entanglement', 'Bell State', 'EPR Pairs'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'CNOT', control: 0, target: 1 },
          ],
        },
        quiz: [
          {
            question: 'What is a Bell state?',
            options: [
              'A superposition state',
              'A maximally entangled state',
              'A measurement',
              'A classical state',
            ],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-8',
        title: 'Phase Gates (S, T)',
        description: 'Understanding phase in quantum states',
        duration: 60,
        topics: ['S Gate', 'T Gate', 'Phase', 'Complex Numbers'],
        circuit: {
          numQubits: 1,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'S', qubit: 0 },
            { type: 'T', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'What do phase gates modify?',
            options: ['Amplitude', 'Phase', 'Measurement', 'Entanglement'],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-9',
        title: 'Quantum Interference',
        description: 'Discover how quantum phases create interference',
        duration: 70,
        topics: ['Interference', 'Constructive', 'Destructive', 'Amplitudes'],
        circuit: {
          numQubits: 1,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'Z', qubit: 0 },
            { type: 'H', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'What enables quantum algorithms to be faster?',
            options: ['Measurement', 'Interference', 'Classical gates', 'Random noise'],
            correct: 1,
          },
        ],
      },
      {
        id: 'beginner-10',
        title: 'Building Simple Circuits',
        description: 'Combine gates to create meaningful quantum circuits',
        duration: 90,
        topics: ['Circuit Design', 'Gate Sequences', 'Best Practices'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'X', qubit: 1 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'H', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'Why is gate order important?',
            options: [
              'It affects the final state',
              'It looks better',
              'Gates are commutative',
              'It doesnt matter',
            ],
            correct: 0,
          },
        ],
      },
    ],
  },

  [LEARNING_PATHS.INTERMEDIATE]: {
    id: LEARNING_PATHS.INTERMEDIATE,
    title: 'Intermediate: Quantum Algorithms',
    description: 'Master fundamental quantum algorithms',
    icon: '🚀',
    difficulty: 2,
    estimatedHours: 20,
    prerequisite: LEARNING_PATHS.BEGINNER,
    lessons: [
      {
        id: 'intermediate-1',
        title: 'Deutsch-Jozsa Algorithm',
        description: 'Your first quantum advantage algorithm',
        duration: 90,
        topics: ['Oracle', 'Quantum Advantage', 'Function Evaluation'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'X', qubit: 1 },
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'H', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'What does Deutsch-Jozsa determine?',
            options: [
              'If a function is constant or balanced',
              'Prime numbers',
              'Factorization',
              'Database search',
            ],
            correct: 0,
          },
        ],
      },
      {
        id: 'intermediate-2',
        title: "Grover's Algorithm Basics",
        description: 'Quantum search algorithm fundamentals',
        duration: 120,
        topics: ['Amplitude Amplification', 'Oracle', 'Diffusion Operator'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
            { type: 'Z', qubit: 0 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
            { type: 'X', qubit: 0 },
            { type: 'X', qubit: 1 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'X', qubit: 0 },
            { type: 'X', qubit: 1 },
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
          ],
        },
        quiz: [
          {
            question: "What is Grover's algorithm used for?",
            options: ['Sorting', 'Unstructured search', 'Factoring', 'Simulation'],
            correct: 1,
          },
        ],
      },
      {
        id: 'intermediate-3',
        title: 'Quantum Fourier Transform',
        description: 'The quantum version of the FFT',
        duration: 100,
        topics: ['QFT', 'Phase Estimation', 'Periodicity'],
        circuit: {
          numQubits: 3,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'S', qubit: 0 },
            { type: 'H', qubit: 1 },
            { type: 'T', qubit: 1 },
            { type: 'H', qubit: 2 },
          ],
        },
        quiz: [
          {
            question: 'QFT is a key component of which algorithm?',
            options: ['Grover', 'Shor', 'Deutsch', 'Bernstein-Vazirani'],
            correct: 1,
          },
        ],
      },
      {
        id: 'intermediate-4',
        title: 'Quantum Teleportation',
        description: 'Transfer quantum states without moving qubits',
        duration: 110,
        topics: ['Teleportation', 'Bell States', 'Classical Communication'],
        circuit: {
          numQubits: 3,
          gates: [
            { type: 'H', qubit: 1 },
            { type: 'CNOT', control: 1, target: 2 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'H', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'Does quantum teleportation transmit matter?',
            options: ['Yes', 'No, only quantum information', 'Sometimes', 'It transmits energy'],
            correct: 1,
          },
        ],
      },
      {
        id: 'intermediate-5',
        title: 'Superdense Coding',
        description: 'Send 2 classical bits using 1 qubit',
        duration: 80,
        topics: ['Dense Coding', 'Entanglement', 'Information Theory'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'Z', qubit: 0 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'H', qubit: 0 },
          ],
        },
        quiz: [
          {
            question: 'How many classical bits can superdense coding send?',
            options: ['1', '2', '3', '4'],
            correct: 1,
          },
        ],
      },
    ],
  },

  [LEARNING_PATHS.ADVANCED]: {
    id: LEARNING_PATHS.ADVANCED,
    title: 'Advanced: Applications',
    description: 'Apply quantum computing to real problems',
    icon: '⚡',
    difficulty: 3,
    estimatedHours: 25,
    prerequisite: LEARNING_PATHS.INTERMEDIATE,
    lessons: [
      {
        id: 'advanced-1',
        title: "Shor's Algorithm",
        description: 'Factor large numbers exponentially faster',
        duration: 150,
        topics: ['Factoring', 'Period Finding', 'RSA', 'Number Theory'],
        circuit: {
          numQubits: 4,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
            { type: 'H', qubit: 2 },
            { type: 'H', qubit: 3 },
          ],
        },
        quiz: [
          {
            question: "What is Shor's algorithm famous for breaking?",
            options: ['AES', 'RSA encryption', 'SHA-256', 'DES'],
            correct: 1,
          },
        ],
      },
      {
        id: 'advanced-2',
        title: 'Variational Quantum Eigensolver',
        description: 'Find ground state energies of molecules',
        duration: 140,
        topics: ['VQE', 'Hybrid Algorithm', 'Chemistry', 'Optimization'],
        circuit: {
          numQubits: 2,
          gates: [
            { type: 'RX', qubit: 0, theta: 0.5 },
            { type: 'RY', qubit: 1, theta: 1.0 },
            { type: 'CNOT', control: 0, target: 1 },
          ],
        },
        quiz: [
          {
            question: 'VQE is a what type of algorithm?',
            options: ['Pure quantum', 'Hybrid quantum-classical', 'Classical', 'Simulated'],
            correct: 1,
          },
        ],
      },
      {
        id: 'advanced-3',
        title: 'QAOA for Optimization',
        description: 'Solve combinatorial optimization problems',
        duration: 130,
        topics: ['QAOA', 'MaxCut', 'Combinatorial', 'Variational'],
        circuit: {
          numQubits: 3,
          gates: [
            { type: 'H', qubit: 0 },
            { type: 'H', qubit: 1 },
            { type: 'H', qubit: 2 },
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'CNOT', control: 1, target: 2 },
          ],
        },
        quiz: [
          {
            question: 'What does QAOA stand for?',
            options: [
              'Quantum Approximate Optimization Algorithm',
              'Quantum Advanced Operation Algorithm',
              'Quick Algorithm Optimization Approach',
              'Quantum Annealing Optimization Algorithm',
            ],
            correct: 0,
          },
        ],
      },
    ],
  },

  [LEARNING_PATHS.EXPERT]: {
    id: LEARNING_PATHS.EXPERT,
    title: 'Expert: Error Correction',
    description: 'Build fault-tolerant quantum computers',
    icon: '🛡️',
    difficulty: 4,
    estimatedHours: 30,
    prerequisite: LEARNING_PATHS.ADVANCED,
    lessons: [
      {
        id: 'expert-1',
        title: 'Quantum Error Models',
        description: 'Understand decoherence and noise in quantum systems',
        duration: 120,
        topics: ['Decoherence', 'Noise Models', 'Fidelity', 'T1/T2'],
        circuit: null,
        quiz: [
          {
            question: 'What is decoherence?',
            options: [
              'A quantum gate',
              'Loss of quantum information to environment',
              'A measurement',
              'An algorithm',
            ],
            correct: 1,
          },
        ],
      },
      {
        id: 'expert-2',
        title: 'Bit Flip Code',
        description: 'The simplest quantum error correction code',
        duration: 140,
        topics: ['Bit Flip', '3-Qubit Code', 'Syndrome', 'Recovery'],
        circuit: {
          numQubits: 3,
          gates: [
            { type: 'CNOT', control: 0, target: 1 },
            { type: 'CNOT', control: 0, target: 2 },
          ],
        },
        quiz: [
          {
            question: 'How many qubits does the bit flip code use?',
            options: ['1', '2', '3', '5'],
            correct: 2,
          },
        ],
      },
    ],
  },
};

// Achievement badges
export const ACHIEVEMENTS = {
  FIRST_LESSON: {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    points: 10,
  },
  PATH_COMPLETE: {
    id: 'path_complete',
    title: 'Path Master',
    description: 'Complete an entire learning path',
    icon: '🏆',
    points: 100,
  },
  PERFECT_QUIZ: {
    id: 'perfect_quiz',
    title: 'Quiz Master',
    description: 'Get 100% on a quiz',
    icon: '💯',
    points: 25,
  },
  WEEK_STREAK: {
    id: 'week_streak',
    title: 'Dedicated Learner',
    description: 'Learn for 7 days in a row',
    icon: '🔥',
    points: 50,
  },
  CIRCUIT_BUILDER: {
    id: 'circuit_builder',
    title: 'Circuit Builder',
    description: 'Build 10 circuits from lessons',
    icon: '🔧',
    points: 30,
  },
};
