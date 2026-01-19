import React, { useState } from 'react';
import './OptimizationVisualizer.css';

const OptimizationVisualizer = ({ paretoFront, objectives, onSelectSolution }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!paretoFront || paretoFront.length === 0) return null;

  const handleSelect = (index) => {
    setSelectedIndex(index);
    onSelectSolution(paretoFront[index]);
  };

  // Normalize scores for visualization
  const normalizeScores = () => {
    const maxScores = objectives.map((_, objIdx) =>
      Math.max(...paretoFront.map(sol => sol.scores[objIdx]))
    );

    return paretoFront.map(sol => ({
      ...sol,
      normalizedScores: sol.scores.map((score, idx) => 
        maxScores[idx] > 0 ? (score / maxScores[idx]) * 100 : 0
      ),
    }));
  };

  const normalized = normalizeScores();

  const getObjectiveLabel = (objective) => {
    return objective.replace('minimize_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="optimization-visualizer">
      <h4>Pareto Frontier Solutions</h4>
      <p className="visualizer-desc">
        {paretoFront.length} non-dominated solutions found. Each offers different trade-offs.
      </p>

      <div className="pareto-chart">
        {normalized.map((solution, idx) => (
          <div
            key={idx}
            className={`pareto-solution ${selectedIndex === idx ? 'selected' : ''}`}
            onClick={() => handleSelect(idx)}
          >
            <div className="solution-header">
              <span className="solution-number">#{idx + 1}</span>
              {selectedIndex === idx && <span className="selected-badge">✓ Selected</span>}
            </div>

            <div className="solution-metrics">
              <div className="metric-row">
                <span className="metric-name">Gates:</span>
                <span className="metric-val">{solution.metrics.totalGates}</span>
              </div>
              <div className="metric-row">
                <span className="metric-name">Depth:</span>
                <span className="metric-val">{solution.metrics.depth}</span>
              </div>
              <div className="metric-row">
                <span className="metric-name">2Q Gates:</span>
                <span className="metric-val">{solution.metrics.twoQubitGates}</span>
              </div>
            </div>

            <div className="solution-bars">
              {objectives.map((obj, objIdx) => (
                <div key={objIdx} className="objective-bar">
                  <div className="bar-label">{getObjectiveLabel(obj)}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${100 - solution.normalizedScores[objIdx]}%`,
                        background: `hsl(${120 - solution.normalizedScores[objIdx]}, 70%, 50%)`,
                      }}
                    />
                  </div>
                  <div className="bar-value">{solution.scores[objIdx]}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="visualizer-help">
        <span className="help-icon">💡</span>
        <span>Click a solution to select it for application</span>
      </div>
    </div>
  );
};

export default OptimizationVisualizer;
