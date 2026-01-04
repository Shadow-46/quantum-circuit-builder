import { useState, useRef } from 'react';
import { exportToPNG, exportToSVG, copyToClipboard, generateShareURL } from '../../utils/exportUtils';
import '../../styles/components.css';

export default function ExportMenu({ numQubits, gates, onClose }) {
  const [shareURL, setShareURL] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const circuitRef = useRef(null);

  const handleExportPNG = async () => {
    const circuitElement = document.querySelector('.circuit-canvas');
    if (circuitElement) {
      const success = await exportToPNG(circuitElement, `quantum-circuit-${Date.now()}.png`);
      if (success) {
        alert('✅ Circuit exported as PNG!');
      } else {
        alert('❌ Export failed. Please try again.');
      }
    }
  };

  const handleExportSVG = async () => {
    const circuitElement = document.querySelector('.circuit-canvas');
    if (circuitElement) {
      const success = await exportToSVG(circuitElement, `quantum-circuit-${Date.now()}.svg`);
      if (success) {
        alert('✅ Circuit exported as SVG!');
      } else {
        alert('❌ Export failed. Please try again.');
      }
    }
  };

  const handleCopyImage = async () => {
    const circuitElement = document.querySelector('.circuit-canvas');
    if (circuitElement) {
      const success = await copyToClipboard(circuitElement);
      if (success) {
        alert('✅ Circuit image copied to clipboard!');
      } else {
        alert('❌ Copy failed. Please try again.');
      }
    }
  };

  const handleGenerateShareURL = () => {
    const url = generateShareURL(numQubits, gates);
    setShareURL(url);
    setShowShareModal(true);
  };

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy URL');
    }
  };

  return (
    <div className="export-menu">
      <div className="export-menu-header">
        <h3>📤 Export & Share</h3>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      <div className="export-options">
        <div className="export-section">
          <h4>💾 Export as Image</h4>
          <div className="export-buttons">
            <button className="btn-export" onClick={handleExportPNG}>
              <span className="export-icon">🖼️</span>
              <div>
                <div className="export-label">PNG Image</div>
                <div className="export-desc">High quality raster image</div>
              </div>
            </button>
            
            <button className="btn-export" onClick={handleExportSVG}>
              <span className="export-icon">📐</span>
              <div>
                <div className="export-label">SVG Vector</div>
                <div className="export-desc">Scalable vector graphics</div>
              </div>
            </button>
            
            <button className="btn-export" onClick={handleCopyImage}>
              <span className="export-icon">📋</span>
              <div>
                <div className="export-label">Copy Image</div>
                <div className="export-desc">Copy to clipboard</div>
              </div>
            </button>
          </div>
        </div>

        <div className="export-section">
          <h4>🔗 Share Circuit</h4>
          <div className="export-buttons">
            <button className="btn-export" onClick={handleGenerateShareURL}>
              <span className="export-icon">🌐</span>
              <div>
                <div className="export-label">Generate Link</div>
                <div className="export-desc">Create shareable URL</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="share-modal">
          <h4>🔗 Share Your Circuit</h4>
          <p className="share-desc">Anyone with this link can view and load your circuit:</p>
          <div className="share-url-container">
            <input 
              type="text" 
              value={shareURL} 
              readOnly 
              className="share-url-input"
              onClick={(e) => e.target.select()}
            />
            <button 
              className="btn-copy-url"
              onClick={handleCopyURL}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
