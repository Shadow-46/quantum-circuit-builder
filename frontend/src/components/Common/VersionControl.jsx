import { useState } from 'react';
import './VersionControl.jsx';

export default function VersionControl({ circuit, onRestoreVersion, onClose }) {
  const [versions, setVersions] = useState([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  // Load versions from localStorage on mount
  useState(() => {
    const savedVersions = JSON.parse(localStorage.getItem('circuitVersions') || '[]');
    setVersions(savedVersions);
  }, []);

  const handleCreateVersion = () => {
    if (!commitMessage.trim()) {
      alert('Please enter a commit message');
      return;
    }

    const newVersion = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message: commitMessage,
      circuit: {
        numQubits: circuit.numQubits,
        gates: [...circuit.gates],
        name: circuit.name,
        description: circuit.description
      },
      author: 'User', // In a real app, this would be the logged-in user
      stats: {
        totalGates: circuit.gates.length,
        numQubits: circuit.numQubits,
        gateTypes: getGateTypes(circuit.gates)
      }
    };

    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    localStorage.setItem('circuitVersions', JSON.stringify(updatedVersions));
    setCommitMessage('');
  };

  const handleRestoreVersion = (version) => {
    if (window.confirm(`Are you sure you want to restore this version?\n\n"${version.message}"\n\nThis will replace your current circuit.`)) {
      onRestoreVersion(version.circuit);
      onClose();
    }
  };

  const handleDeleteVersion = (versionId) => {
    if (window.confirm('Are you sure you want to delete this version?')) {
      const updatedVersions = versions.filter(v => v.id !== versionId);
      setVersions(updatedVersions);
      localStorage.setItem('circuitVersions', JSON.stringify(updatedVersions));
    }
  };

  const handleCompareVersions = (version) => {
    setSelectedVersion(version);
    setShowDiff(true);
  };

  const getGateTypes = (gates) => {
    const types = {};
    gates.forEach(gate => {
      types[gate.type] = (types[gate.type] || 0) + 1;
    });
    return types;
  };

  const calculateDiff = () => {
    if (!selectedVersion) return null;

    const currentGates = circuit.gates;
    const versionGates = selectedVersion.circuit.gates;

    return {
      added: currentGates.length - versionGates.length,
      removed: versionGates.length - currentGates.length,
      qubitsDiff: circuit.numQubits - selectedVersion.circuit.numQubits,
      currentGateTypes: getGateTypes(currentGates),
      versionGateTypes: selectedVersion.circuit.stats.gateTypes
    };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 2592000)} months ago`;
  };

  const diff = showDiff && selectedVersion ? calculateDiff() : null;

  return (
    <div className="version-control-overlay" onClick={onClose}>
      <div className="version-control-content" onClick={e => e.stopPropagation()}>
        <div className="version-header">
          <h2>🕰️ Version Control</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        {/* Create Version */}
        <div className="create-version-section">
          <h3>💾 Save Current Version</h3>
          <div className="commit-form">
            <input
              type="text"
              placeholder="Enter commit message (e.g., 'Add Grover's search gates')"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="commit-input"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateVersion()}
            />
            <button onClick={handleCreateVersion} className="commit-button">
              💾 Save Version
            </button>
          </div>
          <div className="current-circuit-info">
            <span>Current: {circuit.gates.length} gates • {circuit.numQubits} qubits</span>
          </div>
        </div>

        {/* Version History */}
        <div className="version-history-section">
          <h3>📜 Version History ({versions.length})</h3>
          {versions.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📝</p>
              <p>No versions saved yet</p>
              <p className="empty-hint">Create your first version to track circuit changes</p>
            </div>
          ) : (
            <div className="versions-list">
              {versions.map((version, index) => (
                <div key={version.id} className="version-item">
                  <div className="version-badge">
                    v{versions.length - index}
                  </div>
                  <div className="version-info">
                    <div className="version-message">{version.message}</div>
                    <div className="version-meta">
                      <span className="version-author">👤 {version.author}</span>
                      <span className="version-time">🕐 {getTimeAgo(version.timestamp)}</span>
                      <span className="version-date">{formatTimestamp(version.timestamp)}</span>
                    </div>
                    <div className="version-stats">
                      <span className="stat-badge">🔢 {version.stats.numQubits} qubits</span>
                      <span className="stat-badge">🚪 {version.stats.totalGates} gates</span>
                      <span className="stat-badge">
                        🎯 {Object.keys(version.stats.gateTypes).length} types
                      </span>
                    </div>
                  </div>
                  <div className="version-actions">
                    <button
                      onClick={() => handleRestoreVersion(version)}
                      className="version-action-btn restore"
                      title="Restore this version"
                    >
                      ↻ Restore
                    </button>
                    <button
                      onClick={() => handleCompareVersions(version)}
                      className="version-action-btn compare"
                      title="Compare with current"
                    >
                      ⚖️ Compare
                    </button>
                    <button
                      onClick={() => handleDeleteVersion(version.id)}
                      className="version-action-btn delete"
                      title="Delete version"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diff View */}
        {showDiff && selectedVersion && diff && (
          <div className="diff-overlay" onClick={() => setShowDiff(false)}>
            <div className="diff-content" onClick={e => e.stopPropagation()}>
              <div className="diff-header">
                <h3>⚖️ Compare Versions</h3>
                <button onClick={() => setShowDiff(false)} className="close-button">✕</button>
              </div>

              <div className="diff-summary">
                <div className="diff-side">
                  <h4>📍 Current Version</h4>
                  <div className="diff-stats">
                    <div className="diff-stat">
                      <span className="diff-label">Qubits:</span>
                      <span className="diff-value">{circuit.numQubits}</span>
                    </div>
                    <div className="diff-stat">
                      <span className="diff-label">Gates:</span>
                      <span className="diff-value">{circuit.gates.length}</span>
                    </div>
                  </div>
                </div>

                <div className="diff-arrow">→</div>

                <div className="diff-side">
                  <h4>🕐 {selectedVersion.message}</h4>
                  <div className="diff-stats">
                    <div className="diff-stat">
                      <span className="diff-label">Qubits:</span>
                      <span className="diff-value">{selectedVersion.stats.numQubits}</span>
                    </div>
                    <div className="diff-stat">
                      <span className="diff-label">Gates:</span>
                      <span className="diff-value">{selectedVersion.stats.totalGates}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="diff-changes">
                <h4>Changes:</h4>
                {diff.qubitsDiff !== 0 && (
                  <div className={`diff-change ${diff.qubitsDiff > 0 ? 'added' : 'removed'}`}>
                    {diff.qubitsDiff > 0 ? '+ ' : '- '}
                    {Math.abs(diff.qubitsDiff)} qubit(s)
                  </div>
                )}
                {diff.added > 0 && (
                  <div className="diff-change added">+ {diff.added} gate(s) added</div>
                )}
                {diff.removed < 0 && (
                  <div className="diff-change removed">- {Math.abs(diff.removed)} gate(s) removed</div>
                )}
              </div>

              <div className="gate-types-comparison">
                <div className="gate-types-column">
                  <h5>Current Gate Types:</h5>
                  {Object.entries(diff.currentGateTypes).map(([type, count]) => (
                    <div key={type} className="gate-type-row">
                      <span className="gate-type-name">{type}</span>
                      <span className="gate-type-count">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="gate-types-column">
                  <h5>Version Gate Types:</h5>
                  {Object.entries(diff.versionGateTypes).map(([type, count]) => (
                    <div key={type} className="gate-type-row">
                      <span className="gate-type-name">{type}</span>
                      <span className="gate-type-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
