export default function DensityMatrixView({ densityMatrix }) {
  if (!densityMatrix) {
    return (
      <div className="density-matrix-view">
        <h3>📊 Density Matrix</h3>
        <p className="empty-state">Run simulation to see density matrix</p>
      </div>
    );
  }

  const { num_qubits, dimension, matrix, purity } = densityMatrix;

  // For large matrices, show heatmap; for small ones, show values
  const showValues = dimension <= 4;

  // Calculate max magnitude for color scaling
  const maxMag = Math.max(
    ...matrix.flat().map(cell => cell.magnitude)
  );

  const getCellColor = (magnitude) => {
    const intensity = magnitude / maxMag;
    const hue = 250; // Blue-purple
    const lightness = 90 - intensity * 50;
    return `hsl(${hue}, 70%, ${lightness}%)`;
  };

  return (
    <div className="density-matrix-view">
      <h3>📊 Density Matrix ({dimension}×{dimension})</h3>
      
      <div className="matrix-info">
        <div className="matrix-stat">
          <span className="stat-label">Purity:</span>
          <span className="stat-value">{purity.toFixed(4)}</span>
        </div>
        <div className="matrix-stat">
          <span className="stat-label">State:</span>
          <span className="stat-value">
            {purity > 0.999 ? '✓ Pure' : '✗ Mixed'}
          </span>
        </div>
      </div>

      <div className="matrix-container">
        <div className="density-matrix" style={{
          gridTemplateColumns: `repeat(${dimension}, minmax(${showValues ? '80px' : '20px'}, 1fr))`
        }}>
          {matrix.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className="matrix-cell"
                style={{
                  background: getCellColor(cell.magnitude),
                  borderColor: i === j ? '#667eea' : 'transparent'
                }}
                title={`ρ[${i},${j}] = ${cell.real.toFixed(3)} ${cell.imag >= 0 ? '+' : ''}${cell.imag.toFixed(3)}i`}
              >
                {showValues && (
                  <div className="cell-content">
                    <div className="cell-mag">{cell.magnitude.toFixed(2)}</div>
                    {cell.magnitude > 0.01 && (
                      <div className="cell-complex">
                        {cell.real.toFixed(2)}
                        {cell.imag >= 0 ? '+' : ''}
                        {cell.imag.toFixed(2)}i
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {!showValues && (
        <p className="matrix-note">
          Hover over cells to see values. Darker = larger magnitude. Blue border = diagonal.
        </p>
      )}

      <div className="matrix-legend">
        <h4>Basis States</h4>
        <div className="basis-labels">
          {Array.from({ length: dimension }).map((_, i) => (
            <span key={i} className="basis-label">
              {i}: |{i.toString(2).padStart(num_qubits, '0')}⟩
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
