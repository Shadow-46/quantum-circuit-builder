export default function StatevectorView({ statevector }) {
  if (!statevector) {
    return (
      <div className="statevector-view">
        <h3>🌊 Statevector</h3>
        <p className="empty-state">Run simulation to see statevector</p>
      </div>
    );
  }

  const { num_qubits, statevector: states } = statevector;
  
  // Filter out near-zero amplitudes for cleaner display
  const significantStates = states.filter(s => s.magnitude > 0.001);

  return (
    <div className="statevector-view">
      <h3>🌊 Statevector ({2 ** num_qubits} dimensional)</h3>
      
      <div className="statevector-list">
        {significantStates.map((state) => {
          const barWidth = (state.magnitude * 100).toFixed(1);
          const phase = (state.phase * 180 / Math.PI).toFixed(1);
          
          return (
            <div key={state.index} className="statevector-item">
              <div className="state-label">
                <span className="basis-state">|{state.basis}⟩</span>
              </div>
              
              <div className="amplitude-bar-container">
                <div 
                  className="amplitude-bar" 
                  style={{ 
                    width: `${barWidth}%`,
                    background: `hsl(${(state.phase + Math.PI) * 180 / Math.PI}, 70%, 60%)`
                  }}
                >
                  <span className="amplitude-value">
                    {state.magnitude.toFixed(3)}
                  </span>
                </div>
              </div>
              
              <div className="state-info">
                <div className="probability">
                  P: {(state.probability * 100).toFixed(1)}%
                </div>
                <div className="phase-info">
                  φ: {phase}°
                </div>
              </div>
              
              <div className="complex-parts">
                <span className="real-part">
                  {state.real >= 0 ? '+' : ''}{state.real.toFixed(3)}
                </span>
                <span className="imag-part">
                  {state.imag >= 0 ? '+' : ''}{state.imag.toFixed(3)}i
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {significantStates.length < states.length && (
        <p className="truncation-note">
          Showing {significantStates.length} of {states.length} basis states (hiding near-zero amplitudes)
        </p>
      )}
    </div>
  );
}
