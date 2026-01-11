import { useState } from 'react';
import { 
  optimizeCircuit, 
  calculateCircuitDepth, 
  analyzeGateDistribution,
  estimateFidelity,
  getOptimizationSuggestions 
} from '../../utils/circuitOptimizer';
import '../../styles/components.css';

export default function CircuitAnalyzer({ gates, numQubits, onApplyOptimization, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizationResult, setOptimizationResult] = useState(null);

  const depth = calculateCircuitDepth(gates, numQubits);
  const distribution = analyzeGateDistribution(gates);
  const fidelity = estimateFidelity(gates);
  const suggestions = getOptimizationSuggestions(gates, numQubits);

  const handleOptimize = () => {
    const result = optimizeCircuit(gates);
    setOptimizationResult(result);
    setActiveTab('optimization');
  };

  const handleApplyOptimization = () => {
    if (optimizationResult) {
      onApplyOptimization(optimizationResult.optimizedGates);
      onClose();
    }
  };

  const totalGates = gates.length;
  const singleQubitGates = gates.filter(g => g.target === undefined).length;
  const twoQubitGates = totalGates - singleQubitGates;

  return (
    <div className="analyzer-overlay" onClick={onClose}>
      <div className="analyzer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="analyzer-header">
          <h2>🔬 Circuit Analyzer</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="analyzer-tabs">
          <button 
            className={`analyzer-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`analyzer-tab ${activeTab === 'optimization' ? 'active' : ''}`}
            onClick={() => setActiveTab('optimization')}
          >
            ⚡ Optimization
          </button>
          <button 
            className={`analyzer-tab ${activeTab === 'fidelity' ? 'active' : ''}`}
            onClick={() => setActiveTab('fidelity')}
          >
            🎯 Fidelity
          </button>
          <button 
            className={`analyzer-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            💡 Suggestions
          </button>
        </div>

        <div className="analyzer-content">
          {activeTab === 'overview' && (
            <div className="analyzer-section">
              <h3>Circuit Statistics</h3>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📏</div>
                  <div className="stat-value">{totalGates}</div>
                  <div className="stat-label">Total Gates</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">{depth}</div>
                  <div className="stat-label">Circuit Depth</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-value">{singleQubitGates}</div>
                  <div className="stat-label">Single-Qubit Gates</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🔗</div>
                  <div className="stat-value">{twoQubitGates}</div>
                  <div className="stat-label">Two-Qubit Gates</div>
                </div>
              </div>

              <div className="gate-distribution">
                <h4>Gate Distribution</h4>
                <div className="distribution-list">
                  {Object.entries(distribution).map(([gate, count]) => (
                    <div key={gate} className="distribution-item">
                      <span className="gate-name">{gate}</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill"
                          style={{ width: `${(count / totalGates) * 100}%` }}
                        />
                      </div>
                      <span className="gate-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analyzer-actions">
                <button className="btn-analyze" onClick={handleOptimize}>
                  ⚡ Optimize Circuit
                </button>
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="analyzer-section">
              {!optimizationResult ? (
                <div className="optimization-prompt">
                  <p>Click the button below to analyze and optimize your circuit.</p>
                  <button className="btn-analyze-large" onClick={handleOptimize}>
                    🚀 Run Optimization
                  </button>
                </div>
              ) : (
                <>
                  <h3>Optimization Results</h3>
                  
                  <div className="optimization-summary">
                    <div className="summary-stat">
                      <div className="summary-label">Original Gates:</div>
                      <div className="summary-value">{optimizationResult.report.originalGateCount}</div>
                    </div>
                    <div className="summary-stat">
                      <div className="summary-label">Optimized Gates:</div>
                      <div className="summary-value success">{optimizationResult.report.optimizedGateCount}</div>
                    </div>
                    <div className="summary-stat">
                      <div className="summary-label">Removed:</div>
                      <div className="summary-value warning">{optimizationResult.report.removedGates}</div>
                    </div>
                    <div className="summary-stat highlight">
                      <div className="summary-label">Reduction:</div>
                      <div className="summary-value">{optimizationResult.report.reductionPercentage}%</div>
                    </div>
                  </div>

                  {optimizationResult.report.optimizations.length > 0 && (
                    <div className="optimizations-list">
                      <h4>Optimizations Applied:</h4>
                      {optimizationResult.report.optimizations.map((opt, idx) => (
                        <div key={idx} className="optimization-item">
                          <span className="opt-type">{opt.type.replace(/_/g, ' ')}</span>
                          <span className="opt-details">
                            {opt.gates || opt.original} → {opt.result || 'removed'}
                          </span>
                          {opt.qubit !== undefined && (
                            <span className="opt-qubit">Qubit {opt.qubit}</span>
                          )}
                          {opt.qubits && (
                            <span className="opt-qubit">{opt.qubits}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {optimizationResult.report.removedGates > 0 ? (
                    <div className="analyzer-actions">
                      <button className="btn-apply" onClick={handleApplyOptimization}>
                        ✅ Apply Optimization
                      </button>
                      <button className="btn-cancel" onClick={() => setOptimizationResult(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="no-optimization">
                      <p>✨ Your circuit is already optimized!</p>
                      <p className="no-opt-subtext">No redundancies or simplifications found.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'fidelity' && (
            <div className="analyzer-section">
              <h3>Fidelity Estimation</h3>
              
              <div className="fidelity-display">
                <div className="fidelity-gauge">
                  <div className="gauge-value">{fidelity.fidelityPercent}%</div>
                  <div className="gauge-label">Estimated Fidelity</div>
                </div>
              </div>

              <div className="fidelity-info">
                <p className="info-text">
                  Fidelity represents the probability that your circuit will execute correctly 
                  on real quantum hardware, accounting for gate errors and decoherence.
                </p>
                
                <div className="fidelity-factors">
                  <h4>Factors Affecting Fidelity:</h4>
                  <ul>
                    <li>
                      <strong>Single-qubit gates:</strong> {singleQubitGates} gates 
                      <span className="factor-impact">(~0.1% error each)</span>
                    </li>
                    <li>
                      <strong>Two-qubit gates:</strong> {twoQubitGates} gates 
                      <span className="factor-impact">(~1% error each)</span>
                    </li>
                    <li>
                      <strong>Circuit depth:</strong> {depth} layers 
                      <span className="factor-impact">(affects decoherence)</span>
                    </li>
                  </ul>
                </div>

                <div className={`fidelity-rating ${
                  fidelity.fidelity > 0.9 ? 'excellent' :
                  fidelity.fidelity > 0.7 ? 'good' :
                  fidelity.fidelity > 0.5 ? 'fair' : 'poor'
                }`}>
                  {fidelity.fidelity > 0.9 && '🌟 Excellent - High success rate expected'}
                  {fidelity.fidelity > 0.7 && fidelity.fidelity <= 0.9 && '✅ Good - Should work well on hardware'}
                  {fidelity.fidelity > 0.5 && fidelity.fidelity <= 0.7 && '⚠️ Fair - May need error mitigation'}
                  {fidelity.fidelity <= 0.5 && '❌ Poor - Consider circuit optimization'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="analyzer-section">
              <h3>Optimization Suggestions</h3>
              
              {suggestions.length === 0 ? (
                <div className="no-suggestions">
                  <p>✨ Your circuit looks great!</p>
                  <p className="no-sugg-subtext">No optimization suggestions at this time.</p>
                </div>
              ) : (
                <div className="suggestions-list">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className={`suggestion-card ${suggestion.type}`}>
                      <div className="suggestion-icon">
                        {suggestion.type === 'success' && '✅'}
                        {suggestion.type === 'warning' && '⚠️'}
                        {suggestion.type === 'info' && 'ℹ️'}
                      </div>
                      <div className="suggestion-content">
                        <p className="suggestion-message">{suggestion.message}</p>
                        {suggestion.action === 'optimize' && (
                          <button className="btn-suggestion" onClick={() => setActiveTab('optimization')}>
                            View Optimization
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="tips-section">
                <h4>💡 General Tips:</h4>
                <ul className="tips-list">
                  <li>Minimize two-qubit gates - they have higher error rates</li>
                  <li>Reduce circuit depth to minimize decoherence effects</li>
                  <li>Remove redundant gates using the optimization feature</li>
                  <li>Consider error mitigation techniques for production use</li>
                  <li>Test on simulators before running on real hardware</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
