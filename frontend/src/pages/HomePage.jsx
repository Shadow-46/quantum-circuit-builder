import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Quantum Circuit Builder</h1>
      <p>Build and simulate quantum circuits with an intuitive drag-and-drop interface.</p>
      
      <div className="features">
        <div className="feature">
          <h3>🔧 Circuit Builder</h3>
          <p>Create quantum circuits by placing gates on qubits</p>
        </div>
        <div className="feature">
          <h3>⚡ Real-time Simulation</h3>
          <p>Simulate circuits using Qiskit backend</p>
        </div>
        <div className="feature">
          <h3>📊 Visualization</h3>
          <p>View measurement results and probability distributions</p>
        </div>
      </div>

      <Link to="/builder" className="cta-button">
        Start Building →
      </Link>
    </div>
  );
}
