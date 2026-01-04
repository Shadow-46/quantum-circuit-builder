import { useState } from 'react';
import { Link } from 'react-router-dom';
import HelpModal from './HelpModal';

export default function Navigation() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <nav className="navigation">
        <div className="nav-brand">
          <Link to="/">⚛️ Quantum Circuit Builder</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/builder">Circuit Builder</Link></li>
          <li><Link to="/algorithms">🧪 Algorithms</Link></li>
          <li><Link to="/tutorials">📚 Tutorials</Link></li>
          <li><Link to="/profile">👤 Profile</Link></li>
          <li>
            <button className="btn-help" onClick={() => setShowHelp(true)}>
              ❓ Help
            </button>
          </li>
        </ul>
      </nav>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
