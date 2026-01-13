import { useState } from 'react';
import { NOISE_PRESETS } from '../../utils/noiseModels';

export default function NoiseSimulator({ 
  onNoiseModelChange, 
  onToggleNoise, 
  noiseEnabled = false 
}) {
  const [selectedPreset, setSelectedPreset] = useState('ideal');
  const [customParams, setCustomParams] = useState(NOISE_PRESETS.custom);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetChange = (presetName) => {
    setSelectedPreset(presetName);
    const preset = NOISE_PRESETS[presetName];
    if (presetName === 'custom') {
      onNoiseModelChange(customParams);
    } else {
      onNoiseModelChange(preset);
    }
  };

  const handleCustomParamChange = (param, value) => {
    const newParams = {
      ...customParams,
      [param]: parseFloat(value)
    };
    setCustomParams(newParams);
    if (selectedPreset === 'custom') {
      onNoiseModelChange(newParams);
    }
  };

  const currentModel = selectedPreset === 'custom' ? customParams : NOISE_PRESETS[selectedPreset];

  return (
    <div className="noise-simulator">
      <div className="noise-header">
        <div className="noise-title-row">
          <h3>🔬 Quantum Noise Simulation</h3>
          <label className="noise-toggle">
            <input
              type="checkbox"
              checked={noiseEnabled}
              onChange={(e) => onToggleNoise(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">{noiseEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
        <p className="noise-description">
          Simulate realistic quantum hardware noise and errors
        </p>
      </div>

      {noiseEnabled && (
        <>
          <div className="noise-presets">
            <label>Hardware Model:</label>
            <div className="preset-buttons">
              {Object.keys(NOISE_PRESETS).map(key => (
                <button
                  key={key}
                  className={`preset-btn ${selectedPreset === key ? 'active' : ''}`}
                  onClick={() => handlePresetChange(key)}
                  title={NOISE_PRESETS[key].description}
                >
                  {NOISE_PRESETS[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="noise-info-grid">
            <div className="noise-stat">
              <span className="stat-label">Single-Qubit Error:</span>
              <span className="stat-value error-rate">
                {(currentModel.singleQubitError * 100).toFixed(2)}%
              </span>
            </div>
            <div className="noise-stat">
              <span className="stat-label">Two-Qubit Error:</span>
              <span className="stat-value error-rate">
                {(currentModel.twoQubitError * 100).toFixed(2)}%
              </span>
            </div>
            <div className="noise-stat">
              <span className="stat-label">Readout Error:</span>
              <span className="stat-value error-rate">
                {(currentModel.readoutError * 100).toFixed(2)}%
              </span>
            </div>
            <div className="noise-stat">
              <span className="stat-label">T1 Relaxation:</span>
              <span className="stat-value">
                {currentModel.t1 === Infinity ? '∞' : `${currentModel.t1.toFixed(1)}μs`}
              </span>
            </div>
            <div className="noise-stat">
              <span className="stat-label">T2 Dephasing:</span>
              <span className="stat-value">
                {currentModel.t2 === Infinity ? '∞' : `${currentModel.t2.toFixed(1)}μs`}
              </span>
            </div>
            <div className="noise-stat">
              <span className="stat-label">Gate Time:</span>
              <span className="stat-value">
                {currentModel.gateTime.toFixed(3)}μs
              </span>
            </div>
          </div>

          {selectedPreset === 'custom' && (
            <div className="custom-params">
              <button 
                className="btn-advanced"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? '▼' : '▶'} Advanced Parameters
              </button>

              {showAdvanced && (
                <div className="param-sliders">
                  <div className="param-group">
                    <label>
                      Single-Qubit Error Rate
                      <span className="param-value">{(customParams.singleQubitError * 100).toFixed(3)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.1"
                      step="0.0001"
                      value={customParams.singleQubitError}
                      onChange={(e) => handleCustomParamChange('singleQubitError', e.target.value)}
                    />
                  </div>

                  <div className="param-group">
                    <label>
                      Two-Qubit Error Rate
                      <span className="param-value">{(customParams.twoQubitError * 100).toFixed(3)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.2"
                      step="0.001"
                      value={customParams.twoQubitError}
                      onChange={(e) => handleCustomParamChange('twoQubitError', e.target.value)}
                    />
                  </div>

                  <div className="param-group">
                    <label>
                      Readout Error Rate
                      <span className="param-value">{(customParams.readoutError * 100).toFixed(3)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.15"
                      step="0.001"
                      value={customParams.readoutError}
                      onChange={(e) => handleCustomParamChange('readoutError', e.target.value)}
                    />
                  </div>

                  <div className="param-group">
                    <label>
                      T1 Relaxation Time
                      <span className="param-value">{customParams.t1.toFixed(1)}μs</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={customParams.t1}
                      onChange={(e) => handleCustomParamChange('t1', e.target.value)}
                    />
                  </div>

                  <div className="param-group">
                    <label>
                      T2 Dephasing Time
                      <span className="param-value">{customParams.t2.toFixed(1)}μs</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={customParams.t2}
                      onChange={(e) => handleCustomParamChange('t2', e.target.value)}
                    />
                  </div>

                  <div className="param-group">
                    <label>
                      Gate Execution Time
                      <span className="param-value">{customParams.gateTime.toFixed(3)}μs</span>
                    </label>
                    <input
                      type="range"
                      min="0.001"
                      max="1"
                      step="0.001"
                      value={customParams.gateTime}
                      onChange={(e) => handleCustomParamChange('gateTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="noise-help">
            <details>
              <summary>📖 What is quantum noise?</summary>
              <div className="help-content">
                <p>
                  Real quantum computers are affected by various sources of noise and errors:
                </p>
                <ul>
                  <li><strong>Gate Errors:</strong> Imperfect quantum operations introduce errors</li>
                  <li><strong>Decoherence:</strong> Qubits lose quantum information over time (T1, T2)</li>
                  <li><strong>Readout Errors:</strong> Measurement results can be incorrect</li>
                  <li><strong>Crosstalk:</strong> Operations on one qubit can affect neighbors</li>
                </ul>
                <p>
                  This simulator helps you understand how noise affects quantum algorithms and why
                  error correction is essential for practical quantum computing.
                </p>
              </div>
            </details>
          </div>
        </>
      )}
    </div>
  );
}
