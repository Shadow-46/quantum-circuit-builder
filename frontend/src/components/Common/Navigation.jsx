import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">Quantum Circuit Builder</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/builder">Builder</Link></li>
      </ul>
    </nav>
  );
}
