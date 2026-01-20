import { useState, useEffect } from 'react';
import './SharingModal.css';

export default function SharingModal({ circuit, onClose }) {
  const [shareMode, setShareMode] = useState('link'); // 'link', 'export', 'qr'
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [shareability, setShareability] = useState('public'); // 'public', 'unlisted', 'private'

  useEffect(() => {
    generateShareLink();
  }, [circuit, shareability]);

  const generateShareLink = () => {
    // Encode circuit data in URL
    const encodedCircuit = btoa(JSON.stringify({
      numQubits: circuit.numQubits,
      gates: circuit.gates,
      name: circuit.name || 'Untitled Circuit',
      description: circuit.description || ''
    }));
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/share/${encodedCircuit}`;
    setShareLink(link);
    
    // Generate simple QR code placeholder
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    let content = '';
    let filename = `circuit_${Date.now()}`;
    let mimeType = '';

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(circuit, null, 2);
        filename += '.json';
        mimeType = 'application/json';
        break;
      case 'qasm':
        content = generateQASM(circuit);
        filename += '.qasm';
        mimeType = 'text/plain';
        break;
      case 'text':
        content = generateTextFormat(circuit);
        filename += '.txt';
        mimeType = 'text/plain';
        break;
      default:
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateQASM = (circuit) => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\n`;
    qasm += `qreg q[${circuit.numQubits}];\n`;
    qasm += `creg c[${circuit.numQubits}];\n\n`;
    
    circuit.gates.forEach(gate => {
      const qubitStr = gate.target !== undefined ? `q[${gate.target}]` : '';
      const controlStr = gate.control !== undefined ? `q[${gate.control}],` : '';
      
      switch (gate.type) {
        case 'H':
          qasm += `h ${qubitStr};\n`;
          break;
        case 'X':
          qasm += `x ${qubitStr};\n`;
          break;
        case 'Y':
          qasm += `y ${qubitStr};\n`;
          break;
        case 'Z':
          qasm += `z ${qubitStr};\n`;
          break;
        case 'CNOT':
          qasm += `cx ${controlStr}${qubitStr};\n`;
          break;
        case 'SWAP':
          qasm += `swap ${controlStr}${qubitStr};\n`;
          break;
        case 'T':
          qasm += `t ${qubitStr};\n`;
          break;
        case 'S':
          qasm += `s ${qubitStr};\n`;
          break;
        case 'Measure':
          qasm += `measure ${qubitStr} -> c[${gate.target}];\n`;
          break;
        default:
          break;
      }
    });
    
    return qasm;
  };

  const generateTextFormat = (circuit) => {
    let text = `Quantum Circuit: ${circuit.name || 'Untitled'}\n`;
    text += `${'='.repeat(50)}\n\n`;
    
    if (circuit.description) {
      text += `Description: ${circuit.description}\n\n`;
    }
    
    text += `Qubits: ${circuit.numQubits}\n`;
    text += `Gates: ${circuit.gates.length}\n\n`;
    text += `Gate Sequence:\n`;
    text += `${'-'.repeat(50)}\n`;
    
    circuit.gates.forEach((gate, i) => {
      text += `${i + 1}. ${gate.type}`;
      if (gate.control !== undefined) {
        text += ` (control: q${gate.control}, target: q${gate.target})`;
      } else if (gate.target !== undefined) {
        text += ` (qubit: q${gate.target})`;
      }
      text += '\n';
    });
    
    return text;
  };

  const getSharingStats = () => {
    const gateTypes = {};
    circuit.gates.forEach(gate => {
      gateTypes[gate.type] = (gateTypes[gate.type] || 0) + 1;
    });
    
    return {
      totalGates: circuit.gates.length,
      numQubits: circuit.numQubits,
      uniqueGates: Object.keys(gateTypes).length,
      gateTypes
    };
  };

  const stats = getSharingStats();

  return (
    <div className="sharing-modal-overlay" onClick={onClose}>
      <div className="sharing-modal-content" onClick={e => e.stopPropagation()}>
        <div className="sharing-header">
          <h2>📤 Share Circuit</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        {/* Circuit Info */}
        <div className="circuit-summary">
          <h3>{circuit.name || 'Untitled Circuit'}</h3>
          {circuit.description && <p className="circuit-description">{circuit.description}</p>}
          <div className="circuit-stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🔢</span>
              <span className="stat-value">{stats.numQubits}</span>
              <span className="stat-label">Qubits</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🚪</span>
              <span className="stat-value">{stats.totalGates}</span>
              <span className="stat-label">Gates</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">{stats.uniqueGates}</span>
              <span className="stat-label">Unique Gates</span>
            </div>
          </div>
        </div>

        {/* Share Mode Tabs */}
        <div className="share-mode-tabs">
          <button 
            onClick={() => setShareMode('link')} 
            className={`tab-button ${shareMode === 'link' ? 'active' : ''}`}
          >
            🔗 Share Link
          </button>
          <button 
            onClick={() => setShareMode('export')} 
            className={`tab-button ${shareMode === 'export' ? 'active' : ''}`}
          >
            📥 Export
          </button>
          <button 
            onClick={() => setShareMode('qr')} 
            className={`tab-button ${shareMode === 'qr' ? 'active' : ''}`}
          >
            📱 QR Code
          </button>
        </div>

        {/* Share Link Mode */}
        {shareMode === 'link' && (
          <div className="share-mode-content">
            <div className="shareability-options">
              <label className="shareability-label">Visibility:</label>
              <div className="shareability-buttons">
                <button 
                  onClick={() => setShareability('public')}
                  className={`shareability-btn ${shareability === 'public' ? 'active' : ''}`}
                >
                  🌐 Public
                </button>
                <button 
                  onClick={() => setShareability('unlisted')}
                  className={`shareability-btn ${shareability === 'unlisted' ? 'active' : ''}`}
                >
                  🔓 Unlisted
                </button>
                <button 
                  onClick={() => setShareability('private')}
                  className={`shareability-btn ${shareability === 'private' ? 'active' : ''}`}
                >
                  🔒 Private
                </button>
              </div>
            </div>

            <div className="link-container">
              <input 
                type="text" 
                value={shareLink} 
                readOnly 
                className="share-link-input"
              />
              <button onClick={handleCopyLink} className="copy-button">
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div className="share-info">
              <p className="info-text">
                {shareability === 'public' && '🌐 Anyone can view and search for this circuit'}
                {shareability === 'unlisted' && '🔓 Only people with the link can view this circuit'}
                {shareability === 'private' && '🔒 Only you can access this circuit'}
              </p>
            </div>

            <div className="share-actions">
              <button className="action-button secondary">
                📧 Share via Email
              </button>
              <button className="action-button secondary">
                💬 Share on Slack
              </button>
              <button className="action-button secondary">
                🐦 Share on Twitter
              </button>
            </div>
          </div>
        )}

        {/* Export Mode */}
        {shareMode === 'export' && (
          <div className="share-mode-content">
            <div className="export-format-selector">
              <label>Export Format:</label>
              <select 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value)}
                className="format-select"
              >
                <option value="json">JSON (Circuit Data)</option>
                <option value="qasm">QASM (OpenQASM 2.0)</option>
                <option value="text">Text (Human Readable)</option>
              </select>
            </div>

            <div className="export-preview">
              <h4>Preview:</h4>
              <pre className="preview-code">
                {exportFormat === 'json' && JSON.stringify(circuit, null, 2)}
                {exportFormat === 'qasm' && generateQASM(circuit)}
                {exportFormat === 'text' && generateTextFormat(circuit)}
              </pre>
            </div>

            <button onClick={handleExport} className="export-button">
              📥 Download {exportFormat.toUpperCase()} File
            </button>
          </div>
        )}

        {/* QR Code Mode */}
        {shareMode === 'qr' && (
          <div className="share-mode-content qr-mode">
            <p className="qr-description">
              Scan this QR code to open the circuit on any device
            </p>
            <div className="qr-code-container">
              <img src={qrCode} alt="Circuit QR Code" className="qr-code-image" />
            </div>
            <button onClick={handleCopyLink} className="copy-button">
              {copied ? '✓ Copied Link!' : '📋 Copy Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
