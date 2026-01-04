import { useState } from 'react';
import '../../styles/components.css';

const helpSections = [
  {
    id: 'getting-started',
    title: '🚀 Getting Started',
    icon: '🚀',
    content: [
      {
        title: 'Building Your First Circuit',
        text: 'Start by selecting the number of qubits you need. Then, choose gates from the palette and add them to your circuit. Gates are applied left to right.',
      },
      {
        title: 'Running Simulations',
        text: 'Click the "Simulate" button to run your circuit. Results will show measurement probabilities and can be visualized in different formats.',
      },
      {
        title: 'Saving Your Work',
        text: 'Use the "Save" button to store your circuits. Saved circuits can be loaded later from the "Load" menu.',
      },
    ],
  },
  {
    id: 'gates',
    title: '🎯 Quantum Gates',
    icon: '🎯',
    content: [
      {
        title: 'Single-Qubit Gates',
        text: 'H (Hadamard): Creates superposition\nX (NOT): Flips qubit state\nY, Z: Pauli gates for phase rotation\nS, T: Phase gates\nRX, RY, RZ: Parametric rotation gates',
      },
      {
        title: 'Two-Qubit Gates',
        text: 'CNOT: Controlled-NOT gate for entanglement\nSWAP: Exchanges states of two qubits',
      },
      {
        title: 'Gate Parameters',
        text: 'Rotation gates (RX, RY, RZ) require an angle parameter. Set the angle before adding the gate to your circuit.',
      },
    ],
  },
  {
    id: 'visualizations',
    title: '📊 Visualizations',
    icon: '📊',
    content: [
      {
        title: 'Measurements',
        text: 'Shows probability distribution of measurement outcomes after running your circuit.',
      },
      {
        title: 'Statevector',
        text: 'Displays quantum amplitudes and phases for each basis state.',
      },
      {
        title: 'Bloch Sphere',
        text: 'Visualizes single-qubit states on the Bloch sphere. Select a qubit to view its state.',
      },
      {
        title: 'Density Matrix',
        text: 'Shows the density matrix representation for partial system analysis.',
      },
    ],
  },
  {
    id: 'tutorials',
    title: '📚 Learning',
    icon: '📚',
    content: [
      {
        title: 'Interactive Tutorials',
        text: 'Access step-by-step tutorials from the Tutorials page. Follow guided lessons to learn quantum computing concepts.',
      },
      {
        title: 'Algorithm Library',
        text: 'Explore famous quantum algorithms in the Algorithms page. Load pre-built circuits to study how they work.',
      },
      {
        title: 'Progress Tracking',
        text: 'Track your learning progress, unlock achievements, and view your statistics on the Profile page.',
      },
    ],
  },
  {
    id: 'shortcuts',
    title: '⌨️ Keyboard Shortcuts',
    icon: '⌨️',
    content: [
      {
        title: 'Circuit Building',
        text: 'Ctrl+Z: Undo last action\nCtrl+Shift+Z: Redo action\nDelete: Remove selected gate\nEsc: Close modals',
      },
      {
        title: 'Navigation',
        text: 'Tab: Navigate between sections\nEnter: Confirm actions\nSpace: Quick simulate',
      },
    ],
  },
  {
    id: 'export',
    title: '📤 Export & Share',
    icon: '📤',
    content: [
      {
        title: 'Export Options',
        text: 'PNG: High-quality raster image\nSVG: Scalable vector graphics\nQiskit Code: Python code for IBM Qiskit\nClipboard: Quick copy of circuit image',
      },
      {
        title: 'Sharing Circuits',
        text: 'Generate a shareable URL that encodes your circuit. Anyone with the link can load and view your circuit.',
      },
    ],
  },
  {
    id: 'faq',
    title: '❓ FAQ',
    icon: '❓',
    content: [
      {
        title: 'What is quantum computing?',
        text: 'Quantum computing uses quantum mechanical phenomena like superposition and entanglement to perform calculations that would be difficult for classical computers.',
      },
      {
        title: 'How accurate are the simulations?',
        text: 'Simulations are mathematically exact for the ideal quantum model. Real quantum hardware would have noise and errors not represented here.',
      },
      {
        title: 'Can I use this for research?',
        text: 'This is an educational tool. For research-grade simulations, consider IBM Qiskit, Google Cirq, or other professional frameworks.',
      },
      {
        title: 'How do I report bugs?',
        text: 'Issues can be reported on the GitHub repository. Include steps to reproduce and screenshots if possible.',
      },
    ],
  },
];

export default function HelpModal({ onClose }) {
  const [activeSection, setActiveSection] = useState('getting-started');

  const currentSection = helpSections.find(s => s.id === activeSection);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>📖 Help & Documentation</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="help-content">
          {/* Sidebar */}
          <div className="help-sidebar">
            {helpSections.map((section) => (
              <button
                key={section.id}
                className={`help-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="help-nav-icon">{section.icon}</span>
                <span className="help-nav-title">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="help-main">
            <h3 className="help-section-title">{currentSection.title}</h3>
            <div className="help-articles">
              {currentSection.content.map((article, idx) => (
                <div key={idx} className="help-article">
                  <h4>{article.title}</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{article.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="help-footer">
          <p>Need more help? Check out the <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub repository</a></p>
        </div>
      </div>
    </div>
  );
}
