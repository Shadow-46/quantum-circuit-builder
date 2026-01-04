import html2canvas from 'html2canvas';

/**
 * Export utilities for quantum circuits
 */

/**
 * Export circuit canvas as PNG image
 * @param {HTMLElement} element - The circuit canvas element to export
 * @param {string} filename - Name for the downloaded file
 */
export const exportToPNG = async (element, filename = 'quantum-circuit.png') => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0a0e27',
      scale: 2, // Higher resolution
      logging: false,
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    return true;
  } catch (error) {
    console.error('Export to PNG failed:', error);
    return false;
  }
};

/**
 * Export circuit as SVG
 * @param {HTMLElement} element - The circuit canvas element to export
 * @param {string} filename - Name for the downloaded file
 */
export const exportToSVG = async (element, filename = 'quantum-circuit.svg') => {
  try {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true);
    
    // Get computed styles
    const styles = window.getComputedStyle(element);
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    
    // Create SVG wrapper
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${clone.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Export to SVG failed:', error);
    return false;
  }
};

/**
 * Copy circuit image to clipboard
 * @param {HTMLElement} element - The circuit canvas element to copy
 */
export const copyToClipboard = async (element) => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0a0e27',
      scale: 2,
      logging: false,
    });
    
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        return true;
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
      }
    });
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
};

/**
 * Generate shareable circuit code
 * @param {number} numQubits - Number of qubits in circuit
 * @param {Array} gates - Array of gate objects
 * @returns {string} Base64 encoded circuit data
 */
export const generateShareCode = (numQubits, gates) => {
  const circuitData = {
    version: '1.0',
    numQubits,
    gates,
    timestamp: new Date().toISOString(),
  };
  
  const json = JSON.stringify(circuitData);
  return btoa(json);
};

/**
 * Parse shared circuit code
 * @param {string} code - Base64 encoded circuit data
 * @returns {Object|null} Circuit data or null if invalid
 */
export const parseShareCode = (code) => {
  try {
    const json = atob(code);
    const data = JSON.parse(json);
    
    // Validate data structure
    if (data.version && data.numQubits && Array.isArray(data.gates)) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse share code:', error);
    return null;
  }
};

/**
 * Generate shareable URL for circuit
 * @param {number} numQubits - Number of qubits
 * @param {Array} gates - Array of gates
 * @returns {string} Full shareable URL
 */
export const generateShareURL = (numQubits, gates) => {
  const code = generateShareCode(numQubits, gates);
  const baseUrl = window.location.origin;
  return `${baseUrl}/builder?circuit=${code}`;
};
