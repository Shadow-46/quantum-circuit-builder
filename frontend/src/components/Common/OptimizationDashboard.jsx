import React, { useState, useEffect } from 'react';
import './OptimizationDashboard.css';
import {
  greedyOptimization,
  simulatedAnnealingOptimization,
  multiObjectiveOptimization,
  hardwareTopologyMapping,
  OBJECTIVES,
  ALGORITHMS,
  TOPOLOGIES,
} from '../../utils/multiObjectiveOptimizer';
import OptimizationVisualizer from './OptimizationVisualizer';

const OptimizationDashboard = ({ gates, numQubits, onApplyOptimization, onClose }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS.GREEDY);
  const [selectedObjectives, setSelectedObjectives] = useState([OBJECTIVES.MINIMIZE_GATES]);
  const [selectedTopology, setSelectedTopology] = useState(TOPOLOGIES.LINEAR);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [compareMode, setCompareMode] = useState('side-by-side');
  const [selectedParetoSolution, setSelectedParetoSolution] = useState(null);

  useEffect(() => {
    // Auto-run greedy optimization on mount
    handleOptimize();
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationResult(null);

    setTimeout(() => {
      let result;

      switch (selectedAlgorithm) {
        case ALGORITHMS.GREEDY:
          result = greedyOptimization(gates, numQubits);
          break;

        case ALGORITHMS.SIMULATED_ANNEALING:
          result = simulatedAnnealingOptimization(gates, numQubits, {
            objective: selectedObjectives[0],
            iterations: 100,
          });
          break;

        case ALGORITHMS.MULTI_OBJECTIVE:
          result = multiObjectiveOptimization(gates, numQubits, selectedObjectives);
          break;

        case ALGORITHMS.GENETIC:
          result = simulatedAnnealingOptimization(gates, numQubits, {
            objective: selectedObjectives[0],
            iterations: 200,
          });
          break;

        default:
          result = greedyOptimization(gates, numQubits);
      }

      setOptimizationResult(result);
      setIsOptimizing(false);
    }, 500);
  };

  const handleTopologyMapping = () => {
    setIsOptimizing(true);

    setTimeout(() => {
      const result = hardwareTopologyMapping(gates, numQubits, selectedTopology);
      setOptimizationResult(result);
      setIsOptimizing(false);
    }, 500);
  };

  const handleApply = () => {
    if (!optimizationResult) return;

    let gatesToApply;
    if (optimizationResult.paretoFront) {
      // Multi-objective - use selected solution
      gatesToApply = selectedParetoSolution?.gates || optimizationResult.paretoFront[0].gates;
    } else if (optimizationResult.mappedGates) {
      gatesToApply = optimizationResult.mappedGates;
    } else {
      gatesToApply = optimizationResult.optimizedGates;
    }

    onApplyOptimization(gatesToApply);
    onClose();
  };

  const toggleObjective = (objective) => {
    if (selectedObjectives.includes(objective)) {
      setSelectedObjectives(selectedObjectives.filter(o => o !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
    }
  };

  const getImprovementColor = (value) => {
    if (value > 30) return '#10b981';
    if (value > 10) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="optimization-overlay" onClick={onClose}>
      <div className="optimization-dashboard" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="optimization-header">
          <div className="header-title">
            <span className="header-icon">⚡</span>
            <h2>Circuit Optimization</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="optimization-content">
          {/* Left Panel - Controls */}
          <div className="optimization-controls">
            <div className="control-section">
              <h3>Algorithm Selection</h3>
              <div className="algorithm-cards">
                <div
                  className={`algorithm-card ${selectedAlgorithm === ALGORITHMS.GREEDY ? 'active' : ''}`}
                  onClick={() => setSelectedAlgorithm(ALGORITHMS.GREEDY)}
                >
                  <div className="card-icon">🎯</div>
                  <div className="card-title">Greedy</div>
                  <div className="card-desc">Fast, removes redundant gates</div>
                </div>

                <div
                  className={`algorithm-card ${selectedAlgorithm === ALGORITHMS.SIMULATED_ANNEALING ? 'active' : ''}`}
                  onClick={() => setSelectedAlgorithm(ALGORITHMS.SIMULATED_ANNEALING)}
                >
                  <div className="card-icon">🔥</div>
                  <div className="card-title">Simulated Annealing</div>
                  <div className="card-desc">Balanced optimization</div>
                </div>

                <div
                  className={`algorithm-card ${selectedAlgorithm === ALGORITHMS.MULTI_OBJECTIVE ? 'active' : ''}`}
                  onClick={() => setSelectedAlgorithm(ALGORITHMS.MULTI_OBJECTIVE)}
                >
                  <div className="card-icon">📊</div>
                  <div className="card-title">Multi-Objective</div>
                  <div className="card-desc">Pareto frontier analysis</div>
                </div>

                <div
                  className={`algorithm-card ${selectedAlgorithm === ALGORITHMS.GENETIC ? 'active' : ''}`}
                  onClick={() => setSelectedAlgorithm(ALGORITHMS.GENETIC)}
                >
                  <div className="card-icon">🧬</div>
                  <div className="card-title">Genetic</div>
                  <div className="card-desc">Evolutionary approach</div>
                </div>
              </div>
            </div>

            <div className="control-section">
              <h3>Optimization Objectives</h3>
              <div className="objectives-list">
                <label className="objective-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedObjectives.includes(OBJECTIVES.MINIMIZE_GATES)}
                    onChange={() => toggleObjective(OBJECTIVES.MINIMIZE_GATES)}
                  />
                  <span>Minimize Total Gates</span>
                </label>

                <label className="objective-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedObjectives.includes(OBJECTIVES.MINIMIZE_DEPTH)}
                    onChange={() => toggleObjective(OBJECTIVES.MINIMIZE_DEPTH)}
                  />
                  <span>Minimize Circuit Depth</span>
                </label>

                <label className="objective-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedObjectives.includes(OBJECTIVES.MINIMIZE_TWO_QUBIT)}
                    onChange={() => toggleObjective(OBJECTIVES.MINIMIZE_TWO_QUBIT)}
                  />
                  <span>Minimize Two-Qubit Gates</span>
                </label>
              </div>
            </div>

            <div className="control-section">
              <h3>Hardware Topology</h3>
              <select
                className="topology-select"
                value={selectedTopology}
                onChange={(e) => setSelectedTopology(e.target.value)}
              >
                <option value={TOPOLOGIES.LINEAR}>Linear Chain</option>
                <option value={TOPOLOGIES.IBM_FALCON}>IBM Falcon (5Q)</option>
                <option value={TOPOLOGIES.IBM_EAGLE}>IBM Eagle</option>
                <option value={TOPOLOGIES.AWS_RIGETTI}>AWS Rigetti</option>
                <option value={TOPOLOGIES.ALL_TO_ALL}>All-to-All</option>
              </select>
              <button
                className="btn-topology"
                onClick={handleTopologyMapping}
                disabled={isOptimizing}
              >
                Map to Topology
              </button>
            </div>

            <div className="action-buttons">
              <button
                className="btn-optimize"
                onClick={handleOptimize}
                disabled={isOptimizing || selectedObjectives.length === 0}
              >
                {isOptimizing ? '⏳ Optimizing...' : '⚡ Optimize Circuit'}
              </button>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="optimization-results">
            {isOptimizing && (
              <div className="optimizing-indicator">
                <div className="spinner"></div>
                <p>Running {selectedAlgorithm} optimization...</p>
              </div>
            )}

            {!isOptimizing && optimizationResult && (
              <>
                {/* Metrics Comparison */}
                <div className="metrics-comparison">
                  <h3>Optimization Results</h3>
                  
                  {optimizationResult.beforeMetrics && optimizationResult.afterMetrics && (
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-label">Total Gates</div>
                        <div className="metric-values">
                          <span className="before">{optimizationResult.beforeMetrics.totalGates}</span>
                          <span className="arrow">→</span>
                          <span className="after">{optimizationResult.afterMetrics.totalGates}</span>
                        </div>
                        {optimizationResult.improvement?.gateReduction !== undefined && (
                          <div
                            className="metric-improvement"
                            style={{ color: getImprovementColor(optimizationResult.improvement.gateReduction) }}
                          >
                            {optimizationResult.improvement.gateReduction > 0 ? '↓' : '↑'}
                            {Math.abs(optimizationResult.improvement.gateReduction).toFixed(1)}%
                          </div>
                        )}
                      </div>

                      <div className="metric-card">
                        <div className="metric-label">Circuit Depth</div>
                        <div className="metric-values">
                          <span className="before">{optimizationResult.beforeMetrics.depth}</span>
                          <span className="arrow">→</span>
                          <span className="after">{optimizationResult.afterMetrics.depth}</span>
                        </div>
                        {optimizationResult.improvement?.depthReduction !== undefined && (
                          <div
                            className="metric-improvement"
                            style={{ color: getImprovementColor(optimizationResult.improvement.depthReduction) }}
                          >
                            {optimizationResult.improvement.depthReduction > 0 ? '↓' : '↑'}
                            {Math.abs(optimizationResult.improvement.depthReduction).toFixed(1)}%
                          </div>
                        )}
                      </div>

                      <div className="metric-card">
                        <div className="metric-label">Two-Qubit Gates</div>
                        <div className="metric-values">
                          <span className="before">{optimizationResult.beforeMetrics.twoQubitGates}</span>
                          <span className="arrow">→</span>
                          <span className="after">{optimizationResult.afterMetrics.twoQubitGates}</span>
                        </div>
                      </div>

                      <div className="metric-card">
                        <div className="metric-label">Single-Qubit Gates</div>
                        <div className="metric-values">
                          <span className="before">{optimizationResult.beforeMetrics.singleQubitGates}</span>
                          <span className="arrow">→</span>
                          <span className="after">{optimizationResult.afterMetrics.singleQubitGates}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Topology Overhead */}
                  {optimizationResult.overhead && (
                    <div className="topology-overhead">
                      <h4>Topology Mapping Overhead</h4>
                      <div className="overhead-stats">
                        <div className="stat">
                          <span className="stat-label">Extra Gates:</span>
                          <span className="stat-value">{optimizationResult.overhead.extraGates}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">SWAP Gates:</span>
                          <span className="stat-value">{optimizationResult.overhead.extraSWAPs}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pareto Frontier for Multi-Objective */}
                {optimizationResult.paretoFront && (
                  <OptimizationVisualizer
                    paretoFront={optimizationResult.paretoFront}
                    objectives={optimizationResult.objectives}
                    onSelectSolution={(solution) => setSelectedParetoSolution(solution)}
                  />
                )}

                {/* Optimization History */}
                {optimizationResult.history && optimizationResult.history.length > 0 && (
                  <div className="optimization-history">
                    <h4>Optimization Steps</h4>
                    <div className="history-list">
                      {optimizationResult.history.slice(0, 5).map((step, idx) => (
                        <div key={idx} className="history-item">
                          <span className="step-icon">✓</span>
                          <span className="step-text">{step.reason || step.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="result-actions">
                  <button className="btn-apply" onClick={handleApply}>
                    ✓ Apply Optimization
                  </button>
                  <button className="btn-reset" onClick={handleOptimize}>
                    ↻ Re-optimize
                  </button>
                </div>
              </>
            )}

            {!isOptimizing && !optimizationResult && (
              <div className="no-results">
                <p>Select optimization parameters and click "Optimize Circuit"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationDashboard;
