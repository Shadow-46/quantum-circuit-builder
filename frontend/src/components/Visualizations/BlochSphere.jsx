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

    // Draw background with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5);
    gradient.addColorStop(0, '#1a2a3a');
    gradient.addColorStop(1, '#0f1f2f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw sphere outline with glow
    ctx.shadowColor = 'rgba(102, 126, 234, 0.3)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw equator
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw axes with vibrant colors
    const axisLength = radius * 1.2;
    
    // X axis (bright red/orange)
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255, 107, 107, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - axisLength, centerY);
    ctx.lineTo(centerX + axisLength, centerY);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('X', centerX + axisLength + 12, centerY + 6);

    // Y axis (bright green) - perspective view
    const yAxisX = radius * 0.6;
    ctx.strokeStyle = '#51cf66';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(81, 207, 102, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - yAxisX, centerY);
    ctx.lineTo(centerX + yAxisX, centerY);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#51cf66';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Y', centerX + yAxisX + 12, centerY + 6);

    // Z axis (bright blue/cyan)
    ctx.strokeStyle = '#4dabf7';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(77, 171, 247, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + axisLength);
    ctx.lineTo(centerX, centerY - axisLength);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#4dabf7';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Z', centerX + 8, centerY - axisLength - 12);

    // Draw |0⟩ and |1⟩ labels with glow
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 8;
    ctx.fillText('|0⟩', centerX + 12, centerY - radius - 12);
    ctx.fillText('|1⟩', centerX + 12, centerY + radius + 24);
    ctx.shadowBlur = 0;

    // Draw Bloch vector
    const { x, y, z } = blochData;
    
    // Convert 3D coordinates to 2D (simple orthographic projection)
    const vecX = centerX + x * radius;
    const vecY = centerY - z * radius;  // Negative because canvas Y is inverted
    
    // Draw vector line with glow
    ctx.strokeStyle = '#ffd43b';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255, 212, 59, 0.6)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(vecX, vecY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw vector endpoint with glow
    ctx.beginPath();
    ctx.arc(vecX, vecY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffd43b';
    ctx.shadowColor = 'rgba(255, 212, 59, 0.8)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw projection on XY plane (dashed)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
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
          <span className="coord-value" style={{ color: '#ff6b6b' }}>
            {blochData.x.toFixed(3)}
          </span>
        </div>
        <div className="coord-row">
          <span className="coord-label">Y:</span>
          <span className="coord-value" style={{ color: '#51cf66' }}>
            {blochData.y.toFixed(3)}
          </span>
        </div>
        <div className="coord-row">
          <span className="coord-label">Z:</span>
          <span className="coord-value" style={{ color: '#4dabf7' }}>
            {blochData.z.toFixed(3)}
          </span>
        </div>
        <div className="coord-row">
          <span className="coord-label">Length:</span>
          <span className="coord-value" style={{ color: '#ffd43b' }}>{vectorLength}</span>
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
