import { useState } from 'react';
import { getGateExplanation } from '../../data/gateExplanations';
import '../../styles/components.css';

export default function GateTooltip({ gateType, position }) {
  if (!gateType) return null;

  const explanation = getGateExplanation(gateType);

  return (
    <div 
      className="gate-tooltip"
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
      }}
    >
      <div className="tooltip-header">
        <span className="tooltip-symbol">{explanation.symbol}</span>
        <span className="tooltip-name">{explanation.name}</span>
      </div>
      
      <p className="tooltip-description">{explanation.description}</p>

      {explanation.effects && explanation.effects.length > 0 && (
        <div className="tooltip-section">
          <h4>Effects:</h4>
          <ul>
            {explanation.effects.map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>
      )}

      {explanation.blochSphere && (
        <div className="tooltip-section">
          <h4>Bloch Sphere:</h4>
          <p>{explanation.blochSphere}</p>
        </div>
      )}

      {explanation.uses && explanation.uses.length > 0 && (
        <div className="tooltip-section">
          <h4>Common Uses:</h4>
          <ul>
            {explanation.uses.slice(0, 3).map((use, idx) => (
              <li key={idx}>{use}</li>
            ))}
          </ul>
        </div>
      )}

      {explanation.matrix && (
        <details className="tooltip-matrix">
          <summary>Show Matrix</summary>
          <div className="matrix-display">
            [
            {explanation.matrix.map((row, idx) => (
              <div key={idx} className="matrix-row">
                {row.join('  ')}
              </div>
            ))}
            ]
          </div>
        </details>
      )}
    </div>
  );
}
