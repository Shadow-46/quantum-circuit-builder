import React, { useState, useEffect } from 'react';
import CircuitCanvas from '../CircuitBuilder/CircuitCanvas';
import {
  generateComparisonMetrics,
  formatExecutionTime,
  getDiffColor,
  getDiffText,
  exportComparisonReport,
  generateComparisonSummary,
} from '../../utils/comparisonUtils';
import { loadLibrary } from '../../utils/libraryManager';
import { CIRCUIT_TEMPLATES } from '../../utils/circuitTemplates';
import './CircuitComparison.css';

const CircuitComparison = ({ currentCircuit, onClose }) => {
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [comparisonMetrics, setComparisonMetrics] = useState(null);
  const [availableCircuits, setAvailableCircuits] = useState([]);
  const [showCircuitSelector, setShowCircuitSelector] = useState(true);

  useEffect(() => {
    // Load available circuits (templates + custom)
    const customCircuits = loadLibrary();
    const templates = Object.values(CIRCUIT_TEMPLATES);
    setAvailableCircuits([...templates, ...customCircuits]);
  }, []);

  const handleSelectCircuit = (circuit) => {
    setSelectedCircuit(circuit);
    setShowCircuitSelector(false);

    // Generate comparison metrics
    const metrics = generateComparisonMetrics(
      {
        name: 'Current Circuit',
        numQubits: currentCircuit.numQubits,
        gates: currentCircuit.gates,
      },
      {
        name: circuit.name,
        numQubits: circuit.numQubits,
        gates: circuit.gates,
      }
    );

    setComparisonMetrics(metrics);
  };

  const handleExportReport = () => {
    if (!comparisonMetrics) return;

    const report = exportComparisonReport(comparisonMetrics);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit_comparison_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    if (!comparisonMetrics) return;

    const summary = generateComparisonSummary(comparisonMetrics);
    navigator.clipboard.writeText(summary);
    alert('Comparison summary copied to clipboard!');
  };

  const renderMetricRow = (label, value1, value2, percentDiff) => {
    const diffColor = getDiffColor(percentDiff);
    const diffText = getDiffText(percentDiff);

    return (
      <tr>
        <td className="metric-label">{label}</td>
        <td className="metric-value">{value1}</td>
        <td className="metric-value">{value2}</td>
        <td className="metric-diff" style={{ color: diffColor }}>
          {percentDiff > 0 ? '+' : ''}
          {percentDiff.toFixed(1)}%
          <span className="diff-text">{diffText}</span>
        </td>
      </tr>
    );
  };

  if (showCircuitSelector) {
    return (
      <div className="comparison-modal">
        <div className="comparison-header">
          <h2>Compare Circuits</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="circuit-selector">
          <h3>Select a circuit to compare with your current circuit</h3>
          <p className="selector-subtitle">
            Current circuit: {currentCircuit.gates.length} gates, {currentCircuit.numQubits}{' '}
            qubits
          </p>

          <div className="circuits-list">
            {availableCircuits.map((circuit) => (
              <div
                key={circuit.id}
                className="circuit-selector-item"
                onClick={() => handleSelectCircuit(circuit)}
              >
                <div className="circuit-info">
                  <h4>{circuit.name}</h4>
                  {circuit.description && (
                    <p className="circuit-description">{circuit.description}</p>
                  )}
                  <div className="circuit-meta">
                    <span>{circuit.gates.length} gates</span>
                    <span>{circuit.numQubits} qubits</span>
                    {circuit.complexity && (
                      <span className="complexity-badge">{circuit.complexity}</span>
                    )}
                  </div>
                </div>
                <button className="select-btn">Compare →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonMetrics) return null;

  const { circuit1, circuit2, percentageDifferences, differences } = comparisonMetrics;

  return (
    <div className="comparison-modal">
      <div className="comparison-header">
        <div className="header-info">
          <h2>Circuit Comparison</h2>
          <p className="comparison-subtitle">
            {circuit1.name} vs {circuit2.name}
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={handleCopySummary}>
            📋 Copy Summary
          </button>
          <button className="action-btn" onClick={handleExportReport}>
            ⬇ Export Report
          </button>
          <button className="action-btn" onClick={() => setShowCircuitSelector(true)}>
            🔄 Change Circuit
          </button>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="comparison-content">
        {/* Side-by-side circuit visualization */}
        <div className="circuits-side-by-side">
          <div className="circuit-panel">
            <h3>{circuit1.name}</h3>
            <div className="circuit-canvas-wrapper">
              <CircuitCanvas
                gates={currentCircuit.gates}
                numQubits={currentCircuit.numQubits}
                onRemove={() => {}}
                readOnly={true}
              />
            </div>
          </div>

          <div className="comparison-divider">
            <div className="divider-line"></div>
            <span className="vs-badge">VS</span>
            <div className="divider-line"></div>
          </div>

          <div className="circuit-panel">
            <h3>{circuit2.name}</h3>
            <div className="circuit-canvas-wrapper">
              <CircuitCanvas
                gates={selectedCircuit.gates}
                numQubits={selectedCircuit.numQubits}
                onRemove={() => {}}
                readOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Metrics comparison table */}
        <div className="metrics-comparison">
          <h3>Performance Metrics</h3>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>{circuit1.name}</th>
                <th>{circuit2.name}</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="metric-label">Qubits</td>
                <td className="metric-value">{circuit1.numQubits}</td>
                <td className="metric-value">{circuit2.numQubits}</td>
                <td className="metric-diff">
                  {circuit2.numQubits > circuit1.numQubits ? '+' : ''}
                  {circuit2.numQubits - circuit1.numQubits}
                </td>
              </tr>
              {renderMetricRow(
                'Total Gates',
                circuit1.totalGates,
                circuit2.totalGates,
                percentageDifferences.totalGates
              )}
              {renderMetricRow(
                'Circuit Depth',
                circuit1.depth,
                circuit2.depth,
                percentageDifferences.depth
              )}
              {renderMetricRow(
                'Two-Qubit Gates',
                circuit1.twoQubitGates,
                circuit2.twoQubitGates,
                percentageDifferences.twoQubitGates
              )}
              <tr>
                <td className="metric-label">T-Gates</td>
                <td className="metric-value">{circuit1.tGates}</td>
                <td className="metric-value">{circuit2.tGates}</td>
                <td className="metric-diff">
                  {circuit2.tGates > circuit1.tGates ? '+' : ''}
                  {circuit2.tGates - circuit1.tGates}
                </td>
              </tr>
              {renderMetricRow(
                'Execution Time',
                formatExecutionTime(circuit1.executionTime),
                formatExecutionTime(circuit2.executionTime),
                percentageDifferences.executionTime
              )}
              {renderMetricRow(
                'Complexity Score',
                circuit1.complexityScore,
                circuit2.complexityScore,
                percentageDifferences.complexityScore
              )}
            </tbody>
          </table>
        </div>

        {/* Gate count breakdown */}
        <div className="gate-breakdown">
          <h3>Gate Type Distribution</h3>
          <div className="breakdown-panels">
            <div className="breakdown-panel">
              <h4>{circuit1.name}</h4>
              <div className="gate-list">
                {Object.entries(circuit1.gatesByType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="gate-item">
                      <span className="gate-type">{type}</span>
                      <span className="gate-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="breakdown-panel">
              <h4>{circuit2.name}</h4>
              <div className="gate-list">
                {Object.entries(circuit2.gatesByType)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="gate-item">
                      <span className="gate-type">{type}</span>
                      <span className="gate-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Differences summary */}
        {(differences.addedGates.length > 0 ||
          differences.removedGates.length > 0 ||
          differences.modifiedGates.length > 0) && (
          <div className="differences-summary">
            <h3>Circuit Differences</h3>
            <div className="diff-stats">
              {differences.addedGates.length > 0 && (
                <div className="diff-stat added">
                  <span className="diff-icon">+</span>
                  <span className="diff-count">{differences.addedGates.length}</span>
                  <span className="diff-label">Added Gates</span>
                </div>
              )}
              {differences.removedGates.length > 0 && (
                <div className="diff-stat removed">
                  <span className="diff-icon">−</span>
                  <span className="diff-count">{differences.removedGates.length}</span>
                  <span className="diff-label">Removed Gates</span>
                </div>
              )}
              {differences.modifiedGates.length > 0 && (
                <div className="diff-stat modified">
                  <span className="diff-icon">~</span>
                  <span className="diff-count">{differences.modifiedGates.length}</span>
                  <span className="diff-label">Modified Gates</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary insights */}
        <div className="comparison-insights">
          <h3>💡 Insights</h3>
          <div className="insights-list">
            {Math.abs(percentageDifferences.totalGates) > 20 && (
              <div className="insight">
                {percentageDifferences.totalGates < 0 ? '✅' : '⚠️'} Circuit 2 has{' '}
                {Math.abs(percentageDifferences.totalGates).toFixed(0)}%{' '}
                {percentageDifferences.totalGates < 0 ? 'fewer' : 'more'} gates
              </div>
            )}
            {Math.abs(percentageDifferences.depth) > 20 && (
              <div className="insight">
                {percentageDifferences.depth < 0 ? '✅' : '⚠️'} Circuit 2 has{' '}
                {Math.abs(percentageDifferences.depth).toFixed(0)}%{' '}
                {percentageDifferences.depth < 0 ? 'lower' : 'higher'} depth
              </div>
            )}
            {percentageDifferences.twoQubitGates < -10 && (
              <div className="insight">
                ✅ Circuit 2 uses fewer two-qubit gates, which typically results in better
                fidelity
              </div>
            )}
            {percentageDifferences.executionTime < -15 && (
              <div className="insight">⚡ Circuit 2 is expected to execute faster</div>
            )}
            {circuit2.numQubits < circuit1.numQubits && (
              <div className="insight">✅ Circuit 2 uses fewer qubits, making it easier to implement</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitComparison;
