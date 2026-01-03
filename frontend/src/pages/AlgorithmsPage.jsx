import { useState } from 'react';
import { algorithmAPI } from '../../services/api';
import { useCircuitStore } from '../../store/circuitStore';
import { useNavigate } from 'react-router-dom';
import '../../styles/components.css';

// Predefined algorithm descriptions
const algorithmDatabase = [
  {
    id: 'bell-state',
    name: 'Bell State',
    category: 'Entanglement',
    difficulty: 'beginner',
    description: 'Creates maximum entanglement between two qubits. The qubits become perfectly correlated.',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'CNOT', qubit: 0, target: 1 },
    ],
    numQubits: 2,
    applications: ['Quantum teleportation', 'Superdense coding', 'Quantum key distribution'],
    theory: 'The Bell state is one of four maximally entangled two-qubit states. It forms the basis for many quantum information protocols.',
  },
  {
    id: 'ghz-state',
    name: 'GHZ State',
    category: 'Entanglement',
    difficulty: 'intermediate',
    description: 'Greenberger-Horne-Zeilinger state - maximum entanglement across three qubits.',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'CNOT', qubit: 1, target: 2 },
    ],
    numQubits: 3,
    applications: ['Quantum secret sharing', 'Testing quantum mechanics', 'Multiparty quantum communication'],
    theory: 'GHZ states demonstrate unique quantum correlations that cannot be explained by local hidden variable theories.',
  },
  {
    id: 'quantum-fourier-transform',
    name: 'Quantum Fourier Transform',
    category: 'Transforms',
    difficulty: 'advanced',
    description: 'Quantum version of the discrete Fourier transform, exponentially faster than classical FFT.',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'S', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'SWAP', qubit: 0, target: 1 },
    ],
    numQubits: 2,
    applications: ['Shor\'s algorithm', 'Phase estimation', 'Period finding'],
    theory: 'QFT is a key subroutine in many quantum algorithms and provides exponential speedup for certain problems.',
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: 'Oracles',
    difficulty: 'intermediate',
    description: 'Determines if a function is constant or balanced with just one query.',
    gates: [
      { type: 'X', qubit: 1 },
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'H', qubit: 0 },
    ],
    numQubits: 2,
    applications: ['Demonstrating quantum advantage', 'Oracle-based computing', 'Function analysis'],
    theory: 'First algorithm to show quantum advantage over classical computing for a specific problem.',
  },
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    category: 'Communication',
    difficulty: 'advanced',
    description: 'Transmits quantum state using entanglement and classical communication.',
    gates: [
      { type: 'H', qubit: 1 },
      { type: 'CNOT', qubit: 1, target: 2 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'H', qubit: 0 },
    ],
    numQubits: 3,
    applications: ['Quantum networks', 'Quantum computing', 'Secure communication'],
    theory: 'Demonstrates that quantum information can be transmitted without physically sending the qubit.',
  },
  {
    id: 'superdense-coding',
    name: 'Superdense Coding',
    category: 'Communication',
    difficulty: 'intermediate',
    description: 'Send two classical bits of information using just one qubit.',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'Z', qubit: 0 },
      { type: 'X', qubit: 0 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'H', qubit: 0 },
    ],
    numQubits: 2,
    applications: ['Quantum communication', 'Information theory', 'Quantum networks'],
    theory: 'Uses entanglement to encode two bits in a single qubit transmission.',
  },
  {
    id: 'w-state',
    name: 'W State',
    category: 'Entanglement',
    difficulty: 'advanced',
    description: 'Three-qubit entangled state with unique robustness properties.',
    gates: [
      { type: 'RY', qubit: 0, angle: 1.9106 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'X', qubit: 0 },
      { type: 'CNOT', qubit: 0, target: 2 },
      { type: 'X', qubit: 0 },
    ],
    numQubits: 3,
    applications: ['Quantum networking', 'Distributed quantum computing', 'Error correction'],
    theory: 'Unlike GHZ states, W states remain entangled even if one qubit is lost.',
  },
  {
    id: 'grover-iteration',
    name: 'Grover Iteration',
    category: 'Search',
    difficulty: 'advanced',
    description: 'Single iteration of Grover\'s search algorithm for unstructured search.',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'X', qubit: 0 },
      { type: 'X', qubit: 1 },
      { type: 'H', qubit: 1 },
      { type: 'CNOT', qubit: 0, target: 1 },
      { type: 'H', qubit: 1 },
      { type: 'X', qubit: 0 },
      { type: 'X', qubit: 1 },
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
    ],
    numQubits: 2,
    applications: ['Database search', 'Optimization', 'Cryptanalysis'],
    theory: 'Provides quadratic speedup for unstructured search problems.',
  },
];

export default function AlgorithmsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const { loadCircuit } = useCircuitStore();
  const navigate = useNavigate();

  const categories = ['all', ...new Set(algorithmDatabase.map(a => a.category))];
  
  const filteredAlgorithms = selectedCategory === 'all'
    ? algorithmDatabase
    : algorithmDatabase.filter(a => a.category === selectedCategory);

  const handleLoadAlgorithm = (algorithm) => {
    loadCircuit(algorithm.numQubits, algorithm.gates);
    navigate('/builder');
  };

  return (
    <div className="algorithms-page">
      <div className="algorithms-header">
        <h1>🧪 Quantum Algorithm Library</h1>
        <p className="algorithms-subtitle">
          Explore and implement famous quantum algorithms
        </p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? '📚 All' : `${category}`}
          </button>
        ))}
      </div>

      {/* Algorithms Grid */}
      <div className="algorithms-grid">
        {filteredAlgorithms.map((algorithm) => (
          <div key={algorithm.id} className="algorithm-card">
            <div className="algorithm-card-header">
              <h3>{algorithm.name}</h3>
              <span className={`difficulty-badge badge-${algorithm.difficulty}`}>
                {algorithm.difficulty}
              </span>
            </div>

            <div className="algorithm-category">{algorithm.category}</div>
            <p className="algorithm-description">{algorithm.description}</p>

            <div className="algorithm-meta">
              <span className="meta-item">
                🔬 {algorithm.numQubits} qubits
              </span>
              <span className="meta-item">
                🎯 {algorithm.gates.length} gates
              </span>
            </div>

            <div className="algorithm-actions">
              <button
                className="btn-secondary btn-sm"
                onClick={() => setSelectedAlgorithm(algorithm)}
              >
                📖 Learn More
              </button>
              <button
                className="btn-primary btn-sm"
                onClick={() => handleLoadAlgorithm(algorithm)}
              >
                🚀 Try It
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Algorithm Details Modal */}
      {selectedAlgorithm && (
        <div className="modal-overlay" onClick={() => setSelectedAlgorithm(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedAlgorithm.name}</h2>
            
            <div className="algorithm-details">
              <div className="detail-section">
                <h4>📝 Description</h4>
                <p>{selectedAlgorithm.description}</p>
              </div>

              <div className="detail-section">
                <h4>🎓 Theory</h4>
                <p>{selectedAlgorithm.theory}</p>
              </div>

              <div className="detail-section">
                <h4>🔧 Applications</h4>
                <ul>
                  {selectedAlgorithm.applications.map((app, idx) => (
                    <li key={idx}>{app}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>⚙️ Circuit Details</h4>
                <p><strong>Qubits:</strong> {selectedAlgorithm.numQubits}</p>
                <p><strong>Gates:</strong> {selectedAlgorithm.gates.length}</p>
                <div className="gates-list">
                  {selectedAlgorithm.gates.map((gate, idx) => (
                    <span key={idx} className="gate-badge">
                      {gate.type}
                      {gate.target !== undefined && ` (${gate.qubit}→${gate.target})`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  handleLoadAlgorithm(selectedAlgorithm);
                  setSelectedAlgorithm(null);
                }}
              >
                🚀 Load in Builder
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSelectedAlgorithm(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
