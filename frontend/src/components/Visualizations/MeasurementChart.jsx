export default function MeasurementChart({ results }) {
  if (!results) {
    return (
      <div className="measurement-chart">
        <h3>📊 Measurement Results</h3>
        <p className="empty-state">Run a simulation to see results</p>
      </div>
    );
  }
  
  const entries = Object.entries(results.counts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...entries.map(([, count]) => count));
  
  return (
    <div className="measurement-chart">
      <h3>📊 Measurement Results</h3>
      <p><strong>Total Shots:</strong> {results.total_shots}</p>
      <div className="measurement-bars">
        {entries.map(([bits, count]) => {
          const percentage = (results.probabilities[bits] * 100).toFixed(1);
          const width = (count / maxCount) * 100;
          return (
            <div key={bits} className="measurement-bar">
              <span className="measurement-label">|{bits}⟩</span>
              <div className="measurement-bar-bg">
                <div 
                  className="measurement-bar-fill" 
                  style={{ width: `${width}%` }}
                >
                  {percentage}%
                </div>
              </div>
              <span className="measurement-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
