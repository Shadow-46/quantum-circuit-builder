// AI-powered natural language processing for quantum circuit generation

// Pattern database for circuit generation
const CIRCUIT_PATTERNS = {
  'bell state': {
    description: 'Create entangled Bell state (|00⟩ + |11⟩)/√2',
    requiredQubits: 2,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 }
    ],
    category: 'entanglement',
    difficulty: 'beginner',
  },
  'ghz state': {
    description: 'Create GHZ state with maximum entanglement',
    requiredQubits: 3,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 1 },
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 2 }
    ],
    category: 'entanglement',
    difficulty: 'intermediate',
  },
  'superposition': {
    description: 'Put qubit(s) in superposition',
    requiredQubits: 1,
    gates: [
      { type: 'H', qubit: 0, step: 0 }
    ],
    category: 'basic',
    difficulty: 'beginner',
  },
  'quantum teleportation': {
    description: 'Quantum teleportation protocol',
    requiredQubits: 3,
    gates: [
      { type: 'H', qubit: 1, step: 0 },
      { type: 'CNOT', qubit: 1, targetQubit: 2, step: 1 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 2 },
      { type: 'H', qubit: 0, step: 3 },
    ],
    category: 'protocol',
    difficulty: 'advanced',
  },
  'deutsch algorithm': {
    description: "Deutsch's algorithm for function evaluation",
    requiredQubits: 2,
    gates: [
      { type: 'X', qubit: 1, step: 0 },
      { type: 'H', qubit: 0, step: 1 },
      { type: 'H', qubit: 1, step: 1 },
      { type: 'CNOT', qubit: 0, targetQubit: 1, step: 2 },
      { type: 'H', qubit: 0, step: 3 },
    ],
    category: 'algorithm',
    difficulty: 'intermediate',
  },
  'grover': {
    description: "Grover's search algorithm",
    requiredQubits: 2,
    gates: [
      { type: 'H', qubit: 0, step: 0 },
      { type: 'H', qubit: 1, step: 0 },
      { type: 'CZ', qubit: 0, targetQubit: 1, step: 1 },
      { type: 'H', qubit: 0, step: 2 },
      { type: 'H', qubit: 1, step: 2 },
      { type: 'X', qubit: 0, step: 3 },
      { type: 'X', qubit: 1, step: 3 },
      { type: 'CZ', qubit: 0, targetQubit: 1, step: 4 },
      { type: 'X', qubit: 0, step: 5 },
      { type: 'X', qubit: 1, step: 5 },
      { type: 'H', qubit: 0, step: 6 },
      { type: 'H', qubit: 1, step: 6 },
    ],
    category: 'algorithm',
    difficulty: 'advanced',
  },
};

// Intent classification
export const classifyIntent = (input) => {
  const lowerInput = input.toLowerCase().trim();

  // Create patterns
  const createPatterns = ['create', 'make', 'build', 'generate', 'add'];
  const explainPatterns = ['explain', 'what is', 'how does', 'tell me about'];
  const optimizePatterns = ['optimize', 'improve', 'reduce', 'minimize'];
  const analyzePatterns = ['analyze', 'check', 'find errors', 'debug'];

  if (createPatterns.some(p => lowerInput.includes(p))) {
    return { intent: 'create', confidence: 0.9 };
  } else if (explainPatterns.some(p => lowerInput.includes(p))) {
    return { intent: 'explain', confidence: 0.85 };
  } else if (optimizePatterns.some(p => lowerInput.includes(p))) {
    return { intent: 'optimize', confidence: 0.8 };
  } else if (analyzePatterns.some(p => lowerInput.includes(p))) {
    return { intent: 'analyze', confidence: 0.8 };
  }

  return { intent: 'unknown', confidence: 0.5 };
};

// Extract circuit pattern from natural language
export const extractCircuitPattern = (input) => {
  const lowerInput = input.toLowerCase();

  for (const [pattern, config] of Object.entries(CIRCUIT_PATTERNS)) {
    if (lowerInput.includes(pattern)) {
      return {
        pattern,
        config,
        confidence: 0.9,
      };
    }
  }

  // Check for individual keywords
  if (lowerInput.includes('entangle') || lowerInput.includes('entanglement')) {
    return { pattern: 'bell state', config: CIRCUIT_PATTERNS['bell state'], confidence: 0.75 };
  }
  if (lowerInput.includes('superposition')) {
    return { pattern: 'superposition', config: CIRCUIT_PATTERNS['superposition'], confidence: 0.8 };
  }
  if (lowerInput.includes('search')) {
    return { pattern: 'grover', config: CIRCUIT_PATTERNS['grover'], confidence: 0.7 };
  }

  return null;
};

// Generate circuit from natural language
export const generateCircuitFromNL = (input, currentNumQubits) => {
  const intent = classifyIntent(input);
  
  if (intent.intent !== 'create') {
    return {
      success: false,
      message: `I understand you want to ${intent.intent}, but I can only generate circuits from 'create' commands.`,
    };
  }

  const patternMatch = extractCircuitPattern(input);
  
  if (!patternMatch) {
    return {
      success: false,
      message: "I couldn't identify a quantum circuit pattern in your request. Try phrases like 'create a Bell state' or 'make a superposition'.",
    };
  }

  const { pattern, config } = patternMatch;

  // Check if we have enough qubits
  if (currentNumQubits < config.requiredQubits) {
    return {
      success: false,
      message: `This circuit requires ${config.requiredQubits} qubits, but you only have ${currentNumQubits}. Would you like me to adjust the qubit count?`,
      suggestedAction: {
        type: 'adjust_qubits',
        value: config.requiredQubits,
      },
    };
  }

  return {
    success: true,
    message: `Created ${pattern}: ${config.description}`,
    circuit: {
      gates: config.gates,
      requiredQubits: config.requiredQubits,
    },
    info: {
      category: config.category,
      difficulty: config.difficulty,
    },
  };
};

// Smart gate suggestions based on current circuit
export const getSmartSuggestions = (currentGates, numQubits) => {
  const suggestions = [];

  // If circuit is empty, suggest starting patterns
  if (currentGates.length === 0) {
    suggestions.push({
      type: 'pattern',
      title: 'Start with Superposition',
      description: 'Add Hadamard gate to create superposition',
      gates: [{ type: 'H', qubit: 0, step: 0 }],
      priority: 'high',
    });
    suggestions.push({
      type: 'pattern',
      title: 'Create Bell State',
      description: 'Most common entangled state',
      gates: CIRCUIT_PATTERNS['bell state'].gates,
      priority: 'medium',
    });
    return suggestions;
  }

  const lastGate = currentGates[currentGates.length - 1];
  const maxStep = Math.max(...currentGates.map(g => g.step || 0));

  // Suggest complementary gates
  if (lastGate.type === 'H') {
    suggestions.push({
      type: 'next_step',
      title: 'Add CNOT for Entanglement',
      description: 'Create entanglement between qubits',
      gates: [{ type: 'CNOT', qubit: lastGate.qubit, targetQubit: (lastGate.qubit + 1) % numQubits, step: maxStep + 1 }],
      priority: 'high',
    });
  }

  if (lastGate.type === 'CNOT') {
    suggestions.push({
      type: 'next_step',
      title: 'Measure Results',
      description: 'Your circuit looks ready for measurement',
      action: 'simulate',
      priority: 'medium',
    });
  }

  // Detect common patterns and suggest completions
  const hasHadamard = currentGates.some(g => g.type === 'H');
  const hasCNOT = currentGates.some(g => g.type === 'CNOT');
  
  if (hasHadamard && !hasCNOT && numQubits >= 2) {
    suggestions.push({
      type: 'completion',
      title: 'Complete Bell State',
      description: 'Add CNOT to complete Bell state creation',
      gates: [{ type: 'CNOT', qubit: 0, targetQubit: 1, step: maxStep + 1 }],
      priority: 'high',
    });
  }

  return suggestions;
};

// Analyze circuit for issues and optimization opportunities
export const analyzeCircuit = (gates, numQubits) => {
  const issues = [];
  const optimizations = [];

  if (gates.length === 0) {
    return {
      issues: [{ type: 'empty', message: 'Circuit is empty', severity: 'info' }],
      optimizations: [],
      score: 100,
    };
  }

  // Check for unused qubits
  const usedQubits = new Set(gates.map(g => g.qubit));
  gates.forEach(g => {
    if (g.targetQubit !== undefined) usedQubits.add(g.targetQubit);
  });
  
  if (usedQubits.size < numQubits) {
    issues.push({
      type: 'unused_qubits',
      message: `${numQubits - usedQubits.size} qubit(s) unused`,
      severity: 'warning',
      suggestion: `Consider reducing qubit count to ${usedQubits.size}`,
    });
  }

  // Check for redundant gates (e.g., H-H, X-X, Z-Z cancel out)
  for (let i = 0; i < gates.length - 1; i++) {
    const current = gates[i];
    const next = gates[i + 1];
    
    if (current.qubit === next.qubit && current.type === next.type &&
        ['H', 'X', 'Y', 'Z'].includes(current.type)) {
      issues.push({
        type: 'redundant',
        message: `Redundant ${current.type} gates on qubit ${current.qubit}`,
        severity: 'warning',
        suggestion: 'Remove both gates as they cancel out',
        gateIndices: [i, i + 1],
      });
    }
  }

  // Check circuit depth
  const depth = gates.length > 0 ? Math.max(...gates.map(g => g.step || 0)) + 1 : 0;
  if (depth > 20) {
    optimizations.push({
      type: 'depth',
      message: `Circuit depth is ${depth}, which may be too deep`,
      suggestion: 'Consider gate cancellation or circuit redesign',
      priority: 'medium',
    });
  }

  // Check two-qubit gate usage
  const twoQubitGates = gates.filter(g => 
    ['CNOT', 'CZ', 'SWAP', 'CRX', 'CRY', 'CRZ'].includes(g.type)
  ).length;
  
  const twoQubitRatio = twoQubitGates / gates.length;
  if (twoQubitRatio > 0.5) {
    optimizations.push({
      type: 'two_qubit_gates',
      message: `High ratio of two-qubit gates (${(twoQubitRatio * 100).toFixed(1)}%)`,
      suggestion: 'Two-qubit gates have higher error rates. Consider optimization.',
      priority: 'high',
    });
  }

  // Calculate circuit quality score
  let score = 100;
  score -= issues.filter(i => i.severity === 'error').length * 20;
  score -= issues.filter(i => i.severity === 'warning').length * 10;
  score -= optimizations.length * 5;
  score = Math.max(0, Math.min(100, score));

  return {
    issues,
    optimizations,
    score,
    stats: {
      totalGates: gates.length,
      depth,
      twoQubitGates,
      usedQubits: usedQubits.size,
    },
  };
};

// Explain circuit functionality
export const explainCircuit = (gates, numQubits) => {
  if (gates.length === 0) {
    return 'This is an empty circuit. Add gates to create quantum operations.';
  }

  let explanation = `This quantum circuit operates on ${numQubits} qubit(s).\n\n`;

  // Check for known patterns
  const gateTypes = gates.map(g => g.type).join('-');
  
  if (gateTypes === 'H-CNOT') {
    explanation += '🎯 **Bell State Creation**\n';
    explanation += 'This circuit creates a Bell state (maximally entangled state):\n';
    explanation += '1. Hadamard gate creates superposition: |0⟩ → (|0⟩ + |1⟩)/√2\n';
    explanation += '2. CNOT gate creates entanglement between qubits\n';
    explanation += 'Result: (|00⟩ + |11⟩)/√2\n';
    return explanation;
  }

  if (gates.every(g => g.type === 'H')) {
    explanation += '🎯 **Uniform Superposition**\n';
    explanation += `Hadamard gates create equal superposition of all ${Math.pow(2, gates.length)} basis states.\n`;
    return explanation;
  }

  // Generic explanation
  explanation += '**Gate Sequence:**\n';
  gates.forEach((gate, idx) => {
    explanation += `${idx + 1}. ${gate.type} gate on qubit ${gate.qubit}`;
    if (gate.targetQubit !== undefined) {
      explanation += ` → qubit ${gate.targetQubit}`;
    }
    explanation += '\n';
  });

  const analysis = analyzeCircuit(gates, numQubits);
  explanation += `\n**Circuit Quality Score:** ${analysis.score}/100\n`;
  
  if (analysis.issues.length > 0) {
    explanation += `\n⚠️ Found ${analysis.issues.length} issue(s) to review.\n`;
  }

  return explanation;
};

// Get educational resources based on circuit
export const getEducationalResources = (gates) => {
  const resources = [];

  const gateTypes = new Set(gates.map(g => g.type));

  if (gateTypes.has('H')) {
    resources.push({
      topic: 'Hadamard Gate',
      description: 'Creates superposition by rotating qubits',
      links: [
        { title: 'Nielsen & Chuang Ch. 1.3', type: 'book' },
        { title: 'Qiskit Textbook: Superposition', type: 'tutorial' },
      ],
    });
  }

  if (gateTypes.has('CNOT')) {
    resources.push({
      topic: 'CNOT Gate & Entanglement',
      description: 'Two-qubit gate that creates quantum entanglement',
      links: [
        { title: 'Nielsen & Chuang Ch. 1.3.5', type: 'book' },
        { title: 'Qiskit: Entanglement Tutorial', type: 'tutorial' },
      ],
    });
  }

  const hasGroverPattern = gates.some((g, i) => 
    g.type === 'CZ' && i > 0 && gates[i - 1].type === 'H'
  );

  if (hasGroverPattern) {
    resources.push({
      topic: "Grover's Algorithm",
      description: 'Quantum search algorithm with quadratic speedup',
      links: [
        { title: 'Nielsen & Chuang Ch. 6.1', type: 'book' },
        { title: "Qiskit: Grover's Algorithm", type: 'tutorial' },
      ],
    });
  }

  return resources;
};
