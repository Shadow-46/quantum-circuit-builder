import { useEffect, useRef } from 'react';

export default function BlochSphere({ blochData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !blochData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#f7fafc';
    ctx.fillRect(0, 0, width, height);

    // Draw sphere outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw equator
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw axes
    const axisLength = radius * 1.2;
    
    // X axis (red)
    ctx.strokeStyle = '#fc8181';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - axisLength, centerY);
    ctx.lineTo(centerX + axisLength, centerY);
    ctx.stroke();
    ctx.fillStyle = '#fc8181';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('X', centerX + axisLength + 10, centerY + 5);

    // Y axis (green) - perspective view
    const yAxisX = radius * 0.6;
    ctx.strokeStyle = '#68d391';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - yAxisX, centerY);
    ctx.lineTo(centerX + yAxisX, centerY);
    ctx.stroke();
    ctx.fillStyle = '#68d391';
    ctx.fillText('Y', centerX + yAxisX + 10, centerY + 5);

    // Z axis (blue)
    ctx.strokeStyle = '#63b3ed';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + axisLength);
    ctx.lineTo(centerX, centerY - axisLength);
    ctx.stroke();
    ctx.fillStyle = '#63b3ed';
    ctx.fillText('Z', centerX + 5, centerY - axisLength - 10);

    // Draw |0⟩ and |1⟩ labels
    ctx.fillStyle = '#2d3748';
    ctx.font = '16px Arial';
    ctx.fillText('|0⟩', centerX + 10, centerY - radius - 10);
    ctx.fillText('|1⟩', centerX + 10, centerY + radius + 20);

    // Draw Bloch vector
    const { x, y, z } = blochData;
    
    // Convert 3D coordinates to 2D (simple orthographic projection)
    const vecX = centerX + x * radius;
    const vecY = centerY - z * radius;  // Negative because canvas Y is inverted
    
    // Draw vector line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(vecX, vecY);
    ctx.stroke();

    // Draw vector endpoint
    ctx.beginPath();
    ctx.arc(vecX, vecY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#667eea';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw projection on XY plane (dashed)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#a0aec0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(vecX, vecY);
    ctx.lineTo(vecX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [blochData]);

  if (!blochData) {
    return (
      <div className="bloch-sphere">
        <h3>⚛️ Bloch Sphere</h3>
        <p className="empty-state">Add gates to visualize qubit state</p>
      </div>
    );
  }

  const vectorLength = Math.sqrt(
    blochData.x ** 2 + blochData.y ** 2 + blochData.z ** 2
  ).toFixed(3);

  const theta = (Math.acos(blochData.z) * 180 / Math.PI).toFixed(1);
  const phi = (Math.atan2(blochData.y, blochData.x) * 180 / Math.PI).toFixed(1);

  return (
    <div className="bloch-sphere">
      <h3>⚛️ Bloch Sphere (Qubit {blochData.qubit_index})</h3>
      
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400}
        className="bloch-canvas"
      />
      
      <div className="bloch-coordinates">
        <div className="coord-row">
          <span className="coord-label">X:</span>
          <span className="coord-value" style={{ color: '#fc8181' }}>
            {blochData.x.toFixed(3)}
          </span>
        </div>
        <div className="coord-row">
          <span className="coord-label">Y:</span>
          <span className="coord-value" style={{ color: '#68d391' }}>
            {blochData.y.toFixed(3)}
          </span>
        </div>
        <div className="coord-row">
          <span className="coord-label">Z:</span>
          <span className="coord-value" style={{ color: '#63b3ed' }}>
            {blochData.z.toFixed(3)}
          </span>
        </div>
        <div className="coord-row">
          <span className="coord-label">Length:</span>
          <span className="coord-value">{vectorLength}</span>
        </div>
        <div className="coord-row">
          <span className="coord-label">θ:</span>
          <span className="coord-value">{theta}°</span>
        </div>
        <div className="coord-row">
          <span className="coord-label">φ:</span>
          <span className="coord-value">{phi}°</span>
        </div>
        <div className="coord-row">
          <span className="coord-label">State:</span>
          <span className="coord-value">
            {blochData.is_pure ? '✓ Pure' : '✗ Mixed'}
          </span>
        </div>
      </div>
    </div>
  );
}
