import React, { useState } from 'react';
import './ExportModal.css';
import { 
  exportCircuit, 
  getCircuitStatistics,
  exportToQASM2,
  exportToQASM3,
  exportToQiskit,
  exportToLatex
} from '../../utils/advancedExportUtils';

const ExportModal = ({ circuit, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('qasm2');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [includeComments, setIncludeComments] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);

  const exportFormats = [
    {
      id: 'qasm2',
      name: 'OpenQASM 2.0',
      description: 'Industry standard quantum assembly language (IBM Quantum)',
      icon: '📄',
      extension: '.qasm'
    },
    {
      id: 'qasm3',
      name: 'OpenQASM 3.0',
      description: 'Latest version with enhanced features and control flow',
      icon: '📋',
      extension: '.qasm'
    },
    {
      id: 'qiskit',
      name: 'Qiskit Python',
      description: 'IBM Qiskit framework code ready to execute',
      icon: '🐍',
      extension: '.py'
    },
    {
      id: 'latex',
      name: 'LaTeX (Quantikz)',
      description: 'Professional circuit diagrams for papers and documentation',
      icon: '📝',
      extension: '.tex'
    }
  ];

  const stats = getCircuitStatistics(circuit);

  const handlePreview = () => {
    let content = '';
    
    switch (selectedFormat) {
      case 'qasm2':
        content = exportToQASM2(circuit);
        break;
      case 'qasm3':
        content = exportToQASM3(circuit);
        break;
      case 'qiskit':
        content = exportToQiskit(circuit);
        break;
      case 'latex':
        content = exportToLatex(circuit);
        break;
      default:
        content = 'Unknown format';
    }

    setPreviewContent(content);
    setShowPreview(true);
  };

  const handleExport = () => {
    try {
      exportCircuit(circuit, selectedFormat);
      // Show success message or notification
      alert(`Circuit exported successfully as ${selectedFormat.toUpperCase()}!`);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleCopyToClipboard = () => {
    let content = '';
    
    switch (selectedFormat) {
      case 'qasm2':
        content = exportToQASM2(circuit);
        break;
      case 'qasm3':
        content = exportToQASM3(circuit);
        break;
      case 'qiskit':
        content = exportToQiskit(circuit);
        break;
      case 'latex':
        content = exportToLatex(circuit);
        break;
      default:
        content = 'Unknown format';
    }

    navigator.clipboard.writeText(content).then(() => {
      alert('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    });
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>📥 Export Circuit</h2>
          <button className="export-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="export-modal-body">
          {/* Circuit Statistics */}
          {includeStats && (
            <div className="export-stats-section">
              <h3>Circuit Statistics</h3>
              <div className="export-stats-grid">
                <div className="export-stat-item">
                  <span className="export-stat-label">Qubits:</span>
                  <span className="export-stat-value">{stats.numQubits}</span>
                </div>
                <div className="export-stat-item">
                  <span className="export-stat-label">Total Gates:</span>
                  <span className="export-stat-value">{stats.totalGates}</span>
                </div>
                <div className="export-stat-item">
                  <span className="export-stat-label">Circuit Depth:</span>
                  <span className="export-stat-value">{stats.depth}</span>
                </div>
                <div className="export-stat-item">
                  <span className="export-stat-label">Two-Qubit Gates:</span>
                  <span className="export-stat-value">{stats.twoQubitGates}</span>
                </div>
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="export-format-section">
            <h3>Select Export Format</h3>
            <div className="export-format-grid">
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className={`export-format-card ${selectedFormat === format.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="export-format-icon">{format.icon}</div>
                  <div className="export-format-info">
                    <h4>{format.name}</h4>
                    <p>{format.description}</p>
                    <span className="export-format-ext">{format.extension}</span>
                  </div>
                  {selectedFormat === format.id && (
                    <div className="export-format-checkmark">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="export-options-section">
            <h3>Export Options</h3>
            <div className="export-options-list">
              <label className="export-option-item">
                <input
                  type="checkbox"
                  checked={includeComments}
                  onChange={(e) => setIncludeComments(e.target.checked)}
                />
                <span>Include comments and documentation</span>
              </label>
              <label className="export-option-item">
                <input
                  type="checkbox"
                  checked={includeStats}
                  onChange={(e) => setIncludeStats(e.target.checked)}
                />
                <span>Show circuit statistics</span>
              </label>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="export-preview-section">
              <div className="export-preview-header">
                <h3>Code Preview</h3>
                <button 
                  className="export-preview-close"
                  onClick={() => setShowPreview(false)}
                >
                  ✕
                </button>
              </div>
              <pre className="export-preview-code">
                <code>{previewContent}</code>
              </pre>
            </div>
          )}

          {/* Gate Type Breakdown */}
          {Object.keys(stats.gateTypes).length > 0 && (
            <div className="export-gates-breakdown">
              <h3>Gate Type Distribution</h3>
              <div className="export-gates-list">
                {Object.entries(stats.gateTypes)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="export-gate-item">
                      <span className="export-gate-type">{type}</span>
                      <div className="export-gate-bar">
                        <div
                          className="export-gate-bar-fill"
                          style={{ width: `${(count / stats.totalGates) * 100}%` }}
                        />
                      </div>
                      <span className="export-gate-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="export-modal-footer">
          <button 
            className="export-btn export-btn-secondary"
            onClick={handlePreview}
          >
            👁️ Preview Code
          </button>
          <button 
            className="export-btn export-btn-secondary"
            onClick={handleCopyToClipboard}
          >
            📋 Copy to Clipboard
          </button>
          <button 
            className="export-btn export-btn-primary"
            onClick={handleExport}
          >
            💾 Download File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
