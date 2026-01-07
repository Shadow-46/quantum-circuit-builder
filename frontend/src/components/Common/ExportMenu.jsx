import { useState, useRef } from 'react';
import { exportToPNG, exportToSVG, copyToClipboard, generateShareURL } from '../../utils/exportUtils';
import '../../styles/components.css';

export default function ExportMenu({ numQubits, gates, onClose }) {
  const [shareURL, setShareURL] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const circuitRef = useRef(null);

  const handleExportPNG = async () => {
    setIsExporting(true);
    setExportType('PNG');
    const circuitElement = document.querySelector('.circuit-canvas');
    if (circuitElement) {
      const success = await exportToPNG(circuitElement, `quantum-circuit-${Date.now()}.png`);
      if (success) {
        setTimeout(() => alert('✅ Circuit exported as PNG!'), 100);
      } else {
        alert('❌ Export failed. Please try again.');
      }
    }
    setIsExporting(false);
    setExportType('');
  };

  const handleExportSVG = async () => {
    setIsExporting(true);
    setExportType('SVG');
    const circuitElement = document.querySelector('.circuit-canvas');
    if (circuitElement) {
      const success = await exportToSVG(circuitElement, `quantum-circuit-${Date.now()}.svg`);
      if (success) {
        setTimeout(() => alert('✅ Circuit exported as SVG!'), 100);
      } else {
        alert('❌ Export failed. Please try again.');
      }
    }
    setIsExporting(false);
    setExportType('');
  };

  const handleCopyImage = async () => {
    setIsExporting(true);
    setExportType('Copy');
    const circuitElement = document.querySelector('.circuit-canvas');
    if (circuitElement) {
      const success = await copyToClipboard(circuitElement);
      if (success) {
        setTimeout(() => alert('✅ Circuit image copied to clipboard!'), 100);
      } else {
        alert('❌ Copy failed. Please try again.');
      }
    }
    setIsExporting(false);
    setExportType('');
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
            <button 
              className="btn-export" 
              onClick={handleExportPNG}
              disabled={isExporting}
            >
              <span className="export-icon">
                {isExporting && exportType === 'PNG' ? (
                  <span className="spinner-small"></span>
                ) : (
                  '🖼️'
                )}
              </span>
              <div>
                <div className="export-label">PNG Image</div>
                <div className="export-desc">
                  {isExporting && exportType === 'PNG' ? 'Exporting...' : 'High quality raster image'}
                </div>
              </div>
            </button>
            
            <button 
              className="btn-export" 
              onClick={handleExportSVG}
              disabled={isExporting}
            >
              <span className="export-icon">
                {isExporting && exportType === 'SVG' ? (
                  <span className="spinner-small"></span>
                ) : (
                  '📐'
                )}
              </span>
              <div>
                <div className="export-label">SVG Vector</div>
                <div className="export-desc">
                  {isExporting && exportType === 'SVG' ? 'Exporting...' : 'Scalable vector graphics'}
                </div>
              </div>
            </button>
            
            <button 
              className="btn-export" 
              onClick={handleCopyImage}
              disabled={isExporting}
            >
              <span className="export-icon">
                {isExporting && exportType === 'Copy' ? (
                  <span className="spinner-small"></span>
                ) : (
                  '📋'
                )}
              </span>
              <div>
                <div className="export-label">Copy Image</div>
                <div className="export-desc">
                  {isExporting && exportType === 'Copy' ? 'Copying...' : 'Copy to clipboard'}
                </div>
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
