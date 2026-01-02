export const tutorials = [
  {
    id: 'intro-quantum-gates',
    title: 'Introduction to Quantum Gates',
    difficulty: 'beginner',
    duration: '10 min',
    description: 'Learn the basics of quantum gates and build your first quantum circuit',
    steps: [
      {
        title: 'Welcome to Quantum Computing!',
        description: 'Quantum gates are the building blocks of quantum circuits. Unlike classical bits (0 or 1), quantum bits (qubits) can exist in superposition - a combination of both states simultaneously.',
        theory: 'A qubit state is represented as |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1. The probabilities of measuring 0 or 1 are |α|² and |β|² respectively.',
      },
      {
        title: 'The Hadamard Gate (H)',
        description: 'The Hadamard gate creates superposition. It transforms |0⟩ into an equal superposition of |0⟩ and |1⟩.',
        task: 'Add a Hadamard gate to qubit 0',
        hint: 'Select qubit 0 from the dropdown, then click the H button in the gate palette',
        theory: 'H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ - |1⟩)/√2. This creates a 50-50 superposition.',
      },
      {
        title: 'Run Your Circuit',
        description: 'After adding the Hadamard gate, run the simulation to see the results.',
        task: 'Click the "Simulate" button and observe the measurement results',
        hint: 'The simulate button is in the circuit controls at the top',
        theory: 'When you measure a qubit in superposition, it collapses to either |0⟩ or |1⟩ with the probabilities determined by its quantum state.',
      },
      {
        title: 'Understanding the Results',
        description: 'You should see approximately 50% probability for state |0⟩ and 50% for state |1⟩. This confirms the qubit is in superposition!',
        theory: 'The measurement results will vary slightly due to the probabilistic nature of quantum mechanics, but over many shots, they converge to the theoretical probabilities.',
      },
      {
        title: 'The Pauli-X Gate',
        description: 'The X gate is the quantum equivalent of a classical NOT gate. It flips |0⟩ to |1⟩ and vice versa.',
        task: 'Add an X gate after the H gate on qubit 0',
        hint: 'Keep qubit 0 selected and click the X button',
        theory: 'X|0⟩ = |1⟩ and X|1⟩ = |0⟩. When applied after H, it creates the state (|0⟩ - |1⟩)/√2.',
      },
      {
        title: 'Congratulations!',
        description: 'You\'ve learned the basics of quantum gates and created your first quantum circuits! Try experimenting with other gates like Y, Z, and rotation gates.',
        theory: 'Continue exploring with more advanced tutorials to learn about entanglement, quantum algorithms, and more!',
      },
    ],
  },
  {
    id: 'bell-state',
    title: 'Creating a Bell State (Entanglement)',
    difficulty: 'beginner',
    duration: '8 min',
    description: 'Learn about quantum entanglement by creating a Bell state',
    steps: [
      {
        title: 'What is Entanglement?',
        description: 'Quantum entanglement is a phenomenon where two qubits become correlated in such a way that measuring one instantly affects the other, regardless of distance.',
        theory: 'Bell states are maximally entangled states. The most common is |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, meaning both qubits are perfectly correlated.',
      },
      {
        title: 'Set Up Two Qubits',
        description: 'First, we need a 2-qubit circuit. Bell states require at least two qubits.',
        task: 'Set the number of qubits to 2',
        hint: 'Change the "Number of Qubits" input at the top to 2',
      },
      {
        title: 'Create Superposition',
        description: 'Apply a Hadamard gate to the first qubit (qubit 0) to create superposition.',
        task: 'Add an H gate to qubit 0',
        hint: 'Select qubit 0 and click the H button',
        theory: 'This puts qubit 0 in the state (|0⟩ + |1⟩)/√2, while qubit 1 remains in |0⟩.',
      },
      {
        title: 'Create Entanglement',
        description: 'Now apply a CNOT gate with qubit 0 as control and qubit 1 as target. This creates entanglement!',
        task: 'Add a CNOT gate: control on qubit 0, target on qubit 1',
        hint: 'Select both qubits (0 and 1) in the qubit selector, then click CNOT',
        theory: 'CNOT creates entanglement: |00⟩ + |01⟩ → |00⟩ + |11⟩. The qubits are now perfectly correlated.',
      },
      {
        title: 'Verify the Bell State',
        description: 'Run the simulation to see the entanglement in action.',
        task: 'Click Simulate and observe that you only get |00⟩ and |11⟩, never |01⟩ or |10⟩',
        theory: 'The measurement results show perfect correlation: both qubits always have the same value, demonstrating entanglement.',
      },
      {
        title: 'Visualize with Statevector',
        description: 'Switch to the Statevector view to see the quantum state amplitudes.',
        task: 'Click on the "Statevector" tab to see the state (|00⟩ + |11⟩)/√2',
        theory: 'You should see equal amplitudes (≈0.707) for |00⟩ and |11⟩, and zero for |01⟩ and |10⟩.',
      },
      {
        title: 'Well Done!',
        description: 'You\'ve created your first entangled Bell state! This is the foundation for quantum teleportation, superdense coding, and quantum cryptography.',
      },
    ],
  },
  {
    id: 'deutsch-algorithm',
    title: 'The Deutsch Algorithm',
    difficulty: 'intermediate',
    duration: '15 min',
    description: 'Understand the first quantum algorithm that showed quantum advantage',
    steps: [
      {
        title: 'The Deutsch Problem',
        description: 'Given a function f(x) that takes a single bit as input, determine if it\'s constant (always 0 or always 1) or balanced (outputs 0 for one input and 1 for the other).',
        theory: 'Classically, you need to evaluate f(x) twice. Quantum mechanically, we can solve it with just ONE query using superposition!',
      },
      {
        title: 'Initialize the Circuit',
        description: 'The Deutsch algorithm uses 2 qubits: one for input and one auxiliary qubit.',
        task: 'Set up a 2-qubit circuit',
        hint: 'Set the number of qubits to 2',
      },
      {
        title: 'Prepare the Auxiliary Qubit',
        description: 'Apply an X gate to qubit 1 to initialize it to |1⟩.',
        task: 'Add an X gate to qubit 1',
        theory: 'This prepares the auxiliary qubit in |1⟩, which is needed for the phase kickback trick.',
      },
      {
        title: 'Create Superposition',
        description: 'Apply Hadamard gates to both qubits.',
        task: 'Add H gates to both qubit 0 and qubit 1',
        hint: 'Add H to qubit 0, then add another H to qubit 1',
        theory: 'This creates the state: (|0⟩ - |1⟩)/√2 ⊗ (|0⟩ + |1⟩)/√2, which allows quantum parallelism.',
      },
      {
        title: 'Apply the Oracle (Balanced Example)',
        description: 'For a balanced function, we use a CNOT gate as the oracle.',
        task: 'Add a CNOT gate with qubit 0 as control and qubit 1 as target',
        theory: 'The oracle encodes f(x). For balanced functions, CNOT flips the auxiliary qubit based on the input.',
      },
      {
        title: 'Final Hadamard',
        description: 'Apply a final Hadamard to qubit 0 to extract the result.',
        task: 'Add an H gate to qubit 0',
        theory: 'This last Hadamard creates interference that reveals whether f is constant or balanced.',
      },
      {
        title: 'Measure and Interpret',
        description: 'Simulate the circuit. If qubit 0 measures to |1⟩, the function is balanced. If |0⟩, it\'s constant.',
        task: 'Run the simulation and check the results',
        theory: 'With just ONE query to the oracle, we\'ve determined the function\'s nature - a quantum advantage!',
      },
      {
        title: 'Congratulations!',
        description: 'You\'ve implemented the Deutsch algorithm - the first quantum algorithm to demonstrate quantum speedup! This forms the basis for more complex algorithms like Deutsch-Jozsa and Grover\'s algorithm.',
      },
    ],
  },
  {
    id: 'superposition',
    title: 'Understanding Superposition',
    difficulty: 'beginner',
    duration: '12 min',
    description: 'Deep dive into quantum superposition and measurement',
    steps: [
      {
        title: 'Classical vs Quantum States',
        description: 'Classical bits are always in a definite state: 0 OR 1. Quantum bits can be in superposition: 0 AND 1 simultaneously (with different amplitudes).',
        theory: 'A qubit in superposition contains MORE information than a classical bit, but measurement collapses it to a single classical outcome.',
      },
      {
        title: 'Create Simple Superposition',
        description: 'Start with a single qubit and apply a Hadamard gate.',
        task: 'Add an H gate to qubit 0',
        theory: 'H|0⟩ = (|0⟩ + |1⟩)/√2 creates an equal superposition with 50% probability for each outcome.',
      },
      {
        title: 'Visualize the Superposition',
        description: 'Use the Statevector view to see the quantum amplitudes.',
        task: 'Switch to Statevector view and observe the amplitudes',
        theory: 'You should see amplitude ≈0.707 for both |0⟩ and |1⟩. Since 0.707² = 0.5, each has 50% probability.',
      },
      {
        title: 'Bloch Sphere Representation',
        description: 'The Bloch sphere is a geometric representation of single-qubit states.',
        task: 'Switch to Bloch Sphere view to see where your qubit is on the sphere',
        theory: 'The Hadamard state (|0⟩ + |1⟩)/√2 points along the +X axis of the Bloch sphere.',
      },
      {
        title: 'Different Superpositions',
        description: 'Different gates create different superposition states.',
        task: 'Try adding a Z gate after the H gate and observe how the Bloch sphere changes',
        theory: 'Z changes the relative phase: (|0⟩ + |1⟩)/√2 → (|0⟩ - |1⟩)/√2. Same measurement probabilities, different phase!',
      },
      {
        title: 'Measurement Collapses Superposition',
        description: 'When you measure, the superposition collapses to a single classical state.',
        task: 'Run the simulation multiple times and notice the probabilistic results',
        theory: 'Each measurement gives a random outcome according to the probabilities. The quantum information is lost after measurement.',
      },
      {
        title: 'Summary',
        description: 'Superposition is a fundamental quantum property that allows qubits to explore multiple possibilities simultaneously. It\'s key to quantum algorithms\' power!',
      },
    ],
  },
];

export function getTutorialById(id) {
  return tutorials.find(t => t.id === id);
}

export function getTutorialsByDifficulty(difficulty) {
  return tutorials.filter(t => t.difficulty === difficulty);
}
