import { useState, useEffect } from 'react';
import { transpileCircuit, getBackendInfo, validateCircuitForBackend, compareBackends, estimateExecutionTime } from '../../utils/circuitTranspiler';
import { BASIS_SETS } from '../../utils/gateDecomposition';

export default function CircuitTranspiler({ gates, onTranspile }) {
  const [selectedBackend, setSelectedBackend] = useState('universal');
  const [transpileEnabled, setTranspileEnabled] = useState(false);
  const [transpiledGates, setTranspiledGates] = useState(null);
  const [transpileStats, setTranspileStats] = useState(null);
  const [validation, setValidation] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState(1);

  const backends = ['ibm', 'google', 'rigetti', 'ionq', 'universal'];

  // Validate circuit for selected backend
  useEffect(() => {
    if (gates.length > 0) {
      const result = validateCircuitForBackend(gates, selectedBackend);
      setValidation(result);
    }
  }, [gates, selectedBackend]);

  // Transpile when enabled
  useEffect(() => {
    if (transpileEnabled && gates.length > 0) {
      try {
        const result = transpileCircuit(gates, selectedBackend, {
          optimization_level: optimizationLevel,
          routing: true
        });
        setTranspiledGates(result.gates);
        setTranspileStats(result.stats);
        
        // Call parent callback with transpiled gates
        if (onTranspile) {
          onTranspile(result.gates);
        }
      } catch (error) {
        console.error('Transpilation error:', error);
        setTranspiledGates(null);
        setTranspileStats(null);
      }
    } else {
      setTranspiledGates(null);
      setTranspileStats(null);
      if (onTranspile) {
        onTranspile(null);
      }
    }
  }, [transpileEnabled, gates, selectedBackend, optimizationLevel, onTranspile]);

  const handleBackendChange = (backend) => {
    setSelectedBackend(backend);
  };

  const handleCompareBackends = () => {
    if (gates.length > 0) {
      const results = compareBackends(gates);
      setComparison(results);
      setShowComparison(true);
    }
  };

  const backendInfo = getBackendInfo(selectedBackend);
  const executionTime = transpiledGates ? estimateExecutionTime(transpiledGates, selectedBackend) : null;

  return (
    <div className="transpiler-container">
      <div className="transpiler-header">
        <h3>⚙️ Circuit Transpiler</h3>
        <div className="transpiler-toggle">
          <span className="toggle-label">Enable Transpilation</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={transpileEnabled}
              onChange={(e) => setTranspileEnabled(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {transpileEnabled && (
        <>
          {/* Backend Selection */}
          <div className="backend-selector">
            <h4>Target Hardware Backend</h4>
            <div className="backend-buttons">
              {backends.map(backend => (
                <button
                  key={backend}
                  onClick={() => handleBackendChange(backend)}
                  className={`backend-btn ${selectedBackend === backend ? 'active' : ''}`}
                >
                  {BASIS_SETS[backend]?.name || backend.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Backend Information */}
          <div className="backend-info">
            <h4>Backend Details</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Native Gates:</span>
                <span className="info-value">{backendInfo.nativeGates.join(', ').toUpperCase()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Coupling:</span>
                <span className="info-value">{backendInfo.coupling}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Qubits:</span>
                <span className="info-value">{backendInfo.qubits}</span>
              </div>
            </div>
            <p className="backend-description">{backendInfo.description}</p>
          </div>

          {/* Validation Results */}
          {validation && (
            <div className={`validation-panel ${validation.valid ? 'valid' : 'invalid'}`}>
              <h4>{validation.valid ? '✅ Circuit Valid' : '❌ Validation Failed'}</h4>
              {validation.errors.length > 0 && (
                <div className="validation-errors">
                  {validation.errors.map((error, idx) => (
                    <div key={idx} className="error-item">⚠️ {error}</div>
                  ))}
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div className="validation-warnings">
                  {validation.warnings.map((warning, idx) => (
                    <div key={idx} className="warning-item">ℹ️ {warning}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Optimization Level */}
          <div className="optimization-control">
            <h4>Optimization Level</h4>
            <div className="optimization-slider">
              <input
                type="range"
                min="0"
                max="3"
                value={optimizationLevel}
                onChange={(e) => setOptimizationLevel(parseInt(e.target.value))}
                className="opt-slider"
              />
              <div className="opt-labels">
                <span className={optimizationLevel === 0 ? 'active' : ''}>0: None</span>
                <span className={optimizationLevel === 1 ? 'active' : ''}>1: Light</span>
                <span className={optimizationLevel === 2 ? 'active' : ''}>2: Medium</span>
                <span className={optimizationLevel === 3 ? 'active' : ''}>3: Heavy</span>
              </div>
            </div>
          </div>

          {/* Transpilation Statistics */}
          {transpileStats && (
            <div className="transpile-stats">
              <h4>Transpilation Results</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Original Gates</div>
                  <div className="stat-value">{transpileStats.originalGateCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Transpiled Gates</div>
                  <div className="stat-value">{transpileStats.transpiledGateCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Expansion Factor</div>
                  <div className="stat-value">{transpileStats.expansionFactor}x</div>
                </div>
                {executionTime && (
                  <div className="stat-card">
                    <div className="stat-label">Est. Exec. Time</div>
                    <div className="stat-value">{executionTime.totalTime} {executionTime.unit}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Backend Comparison */}
          <div className="comparison-section">
            <button 
              onClick={handleCompareBackends}
              className="compare-btn"
              disabled={gates.length === 0}
            >
              📊 Compare All Backends
            </button>
          </div>

          {showComparison && comparison && (
            <div className="comparison-modal">
              <div className="comparison-content">
                <div className="comparison-header">
                  <h4>Backend Comparison</h4>
                  <button onClick={() => setShowComparison(false)} className="close-btn">×</button>
                </div>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Backend</th>
                      <th>Gate Count</th>
                      <th>Expansion</th>
                      <th>Native Gates</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((result, idx) => (
                      <tr key={idx}>
                        <td className="backend-name">{BASIS_SETS[result.backend]?.name || result.backend}</td>
                        <td>{result.success ? result.transpiledGateCount : '-'}</td>
                        <td>{result.success ? `${result.expansionFactor}x` : '-'}</td>
                        <td>{result.basisGates || '-'}</td>
                        <td>
                          <span className={`status ${result.success ? 'success' : 'error'}`}>
                            {result.success ? '✓ Success' : '✗ Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Help Section */}
          <details className="transpiler-help">
            <summary>❓ What is Circuit Transpilation?</summary>
            <div className="help-content">
              <p>
                <strong>Circuit transpilation</strong> converts your quantum circuit to run on specific quantum hardware.
                Different quantum computers support different native gate sets, so circuits must be decomposed and optimized.
              </p>
              <p>
                <strong>Key Steps:</strong>
              </p>
              <ul>
                <li><strong>Gate Decomposition:</strong> Convert gates to hardware's native gates</li>
                <li><strong>Qubit Mapping:</strong> Map logical qubits to physical qubits</li>
                <li><strong>Routing:</strong> Insert SWAP gates for connectivity constraints</li>
                <li><strong>Optimization:</strong> Reduce gate count and circuit depth</li>
              </ul>
              <p>
                <strong>Backends:</strong>
              </p>
              <ul>
                <li><strong>IBM:</strong> Uses RZ, SX (√X), and CX gates on heavy-hex topology</li>
                <li><strong>Google:</strong> Uses √X, √Y, and CZ gates on 2D grid</li>
                <li><strong>Rigetti:</strong> Uses RX, RZ, and CZ gates on octagonal lattice</li>
                <li><strong>IonQ:</strong> Uses RX, RY, RZ, and RXX gates with all-to-all connectivity</li>
              </ul>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
