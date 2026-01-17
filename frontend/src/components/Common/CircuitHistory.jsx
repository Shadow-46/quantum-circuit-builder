import React, { useState, useEffect } from 'react';
import './CircuitHistory.css';

const CircuitHistory = ({ history, currentIndex, onRestore, onClose }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'gates', 'qubits'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  // Process history with timestamps
  const processedHistory = history.map((snapshot, index) => ({
    ...snapshot,
    index,
    timestamp: snapshot.timestamp || new Date(Date.now() - (history.length - index) * 60000),
    isCurrent: index === currentIndex,
    gateCount: snapshot.gates.length,
    changeType: getChangeType(snapshot, history[index - 1]),
  }));

  // Filter history
  const filteredHistory = processedHistory.filter(snapshot => {
    if (filter === 'all') return true;
    if (filter === 'gates') return snapshot.changeType === 'gate-added' || snapshot.changeType === 'gate-removed';
    if (filter === 'qubits') return snapshot.changeType === 'qubits-changed';
    return true;
  });

  // Sort history
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortOrder === 'newest') return b.index - a.index;
    return a.index - b.index;
  });

  // Calculate statistics
  const stats = {
    total: history.length,
    gateChanges: processedHistory.filter(s => s.changeType.includes('gate')).length,
    qubitChanges: processedHistory.filter(s => s.changeType === 'qubits-changed').length,
    maxGates: Math.max(...processedHistory.map(s => s.gateCount)),
    maxQubits: Math.max(...processedHistory.map(s => s.numQubits)),
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="history-header">
          <div className="history-header-title">
            <h2>⏱️ Circuit History</h2>
            <span className="history-count">{history.length} snapshots</span>
          </div>
          <button className="history-close" onClick={onClose}>✕</button>
        </div>

        {/* Statistics */}
        <div className="history-stats">
          <div className="history-stat-item">
            <span className="history-stat-icon">📊</span>
            <div className="history-stat-content">
              <span className="history-stat-value">{stats.total}</span>
              <span className="history-stat-label">Total States</span>
            </div>
          </div>
          <div className="history-stat-item">
            <span className="history-stat-icon">🎯</span>
            <div className="history-stat-content">
              <span className="history-stat-value">{stats.gateChanges}</span>
              <span className="history-stat-label">Gate Changes</span>
            </div>
          </div>
          <div className="history-stat-item">
            <span className="history-stat-icon">🔢</span>
            <div className="history-stat-content">
              <span className="history-stat-value">{stats.maxQubits}</span>
              <span className="history-stat-label">Max Qubits</span>
            </div>
          </div>
          <div className="history-stat-item">
            <span className="history-stat-icon">⚡</span>
            <div className="history-stat-content">
              <span className="history-stat-value">{stats.maxGates}</span>
              <span className="history-stat-label">Max Gates</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="history-controls">
          <div className="history-control-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Changes</option>
              <option value="gates">Gate Changes</option>
              <option value="qubits">Qubit Changes</option>
            </select>
          </div>
          <div className="history-control-group">
            <label>Sort:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="history-timeline">
          {sortedHistory.map((snapshot) => (
            <div
              key={snapshot.index}
              className={`history-item ${snapshot.isCurrent ? 'current' : ''} ${snapshot.changeType}`}
              onClick={() => onRestore(snapshot.index)}
            >
              <div className="history-item-marker">
                <div className="history-item-dot"></div>
                <div className="history-item-line"></div>
              </div>
              
              <div className="history-item-content">
                <div className="history-item-header">
                  <span className="history-item-type">
                    {getChangeIcon(snapshot.changeType)} {getChangeLabel(snapshot.changeType)}
                  </span>
                  <span className="history-item-time">
                    {formatTimestamp(snapshot.timestamp)}
                  </span>
                </div>
                
                <div className="history-item-details">
                  <div className="history-item-info">
                    <span className="history-item-badge">{snapshot.numQubits} qubits</span>
                    <span className="history-item-badge">{snapshot.gateCount} gates</span>
                  </div>
                  {snapshot.isCurrent && (
                    <span className="history-item-current-badge">Current</span>
                  )}
                </div>

                {/* Gate preview */}
                {snapshot.gates.length > 0 && (
                  <div className="history-item-gates">
                    {snapshot.gates.slice(-3).map((gate, idx) => (
                      <span key={idx} className="history-gate-tag">
                        {gate.type}
                      </span>
                    ))}
                    {snapshot.gates.length > 3 && (
                      <span className="history-gate-more">+{snapshot.gates.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="history-footer">
          <button 
            className="history-btn history-btn-secondary"
            onClick={() => onRestore(0)}
            disabled={currentIndex === 0}
          >
            ⏪ First State
          </button>
          <button 
            className="history-btn history-btn-secondary"
            onClick={() => onRestore(history.length - 1)}
            disabled={currentIndex === history.length - 1}
          >
            ⏩ Latest State
          </button>
          <button 
            className="history-btn history-btn-primary"
            onClick={onClose}
          >
            ✓ Done
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="history-shortcuts">
          <span className="history-shortcut">
            <kbd>Ctrl+Z</kbd> Undo
          </span>
          <span className="history-shortcut">
            <kbd>Ctrl+Y</kbd> Redo
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getChangeType(current, previous) {
  if (!previous) return 'initial';
  
  if (current.numQubits !== previous.numQubits) {
    return 'qubits-changed';
  }
  
  if (current.gates.length > previous.gates.length) {
    return 'gate-added';
  } else if (current.gates.length < previous.gates.length) {
    return 'gate-removed';
  } else if (current.gates.length === 0) {
    return 'cleared';
  }
  
  return 'modified';
}

function getChangeIcon(changeType) {
  const icons = {
    'initial': '🌟',
    'gate-added': '➕',
    'gate-removed': '➖',
    'qubits-changed': '🔢',
    'cleared': '🗑️',
    'modified': '✏️',
  };
  return icons[changeType] || '📝';
}

function getChangeLabel(changeType) {
  const labels = {
    'initial': 'Initial State',
    'gate-added': 'Gate Added',
    'gate-removed': 'Gate Removed',
    'qubits-changed': 'Qubits Changed',
    'cleared': 'Circuit Cleared',
    'modified': 'Circuit Modified',
  };
  return labels[changeType] || 'Change';
}

function formatTimestamp(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return then.toLocaleDateString();
}

export default CircuitHistory;
