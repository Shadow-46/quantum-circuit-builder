import React, { useState, useEffect } from 'react';
import './HardwareIntegration.css';

const HardwareIntegration = ({ circuit, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState('ibm');
  const [apiToken, setApiToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [backends, setBackends] = useState([]);
  const [selectedBackend, setSelectedBackend] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [shots, setShots] = useState(1024);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [jobResults, setJobResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const providers = [
    {
      id: 'ibm',
      name: 'IBM Quantum',
      description: 'Access IBM quantum processors and simulators',
      icon: '🔵',
      status: 'active',
      website: 'https://quantum-computing.ibm.com',
    },
    {
      id: 'aws',
      name: 'AWS Braket',
      description: 'Amazon quantum computing service with multiple backends',
      icon: '🟠',
      status: 'active',
      website: 'https://aws.amazon.com/braket',
    },
    {
      id: 'azure',
      name: 'Azure Quantum',
      description: 'Microsoft quantum computing platform',
      icon: '🔷',
      status: 'active',
      website: 'https://azure.microsoft.com/services/quantum',
    },
    {
      id: 'google',
      name: 'Google Quantum AI',
      description: 'Google quantum computing platform (coming soon)',
      icon: '🔴',
      status: 'coming-soon',
      website: 'https://quantumai.google',
    },
  ];

  // Mock backends for demonstration
  const mockBackends = {
    ibm: [
      {
        id: 'ibm_osaka',
        name: 'IBM Osaka',
        type: 'hardware',
        qubits: 127,
        status: 'online',
        queue: 45,
        avgWaitTime: '2h',
        fidelity: 0.995,
      },
      {
        id: 'ibm_kyoto',
        name: 'IBM Kyoto',
        type: 'hardware',
        qubits: 127,
        status: 'online',
        queue: 32,
        avgWaitTime: '1.5h',
        fidelity: 0.996,
      },
      {
        id: 'ibmq_qasm_simulator',
        name: 'IBMQ QASM Simulator',
        type: 'simulator',
        qubits: 32,
        status: 'online',
        queue: 0,
        avgWaitTime: '< 1min',
        fidelity: 1.0,
      },
    ],
    aws: [
      {
        id: 'ionq',
        name: 'IonQ Aria',
        type: 'hardware',
        qubits: 25,
        status: 'online',
        queue: 12,
        avgWaitTime: '30min',
        fidelity: 0.998,
      },
      {
        id: 'rigetti',
        name: 'Rigetti Aspen-M-3',
        type: 'hardware',
        qubits: 80,
        status: 'online',
        queue: 8,
        avgWaitTime: '45min',
        fidelity: 0.993,
      },
      {
        id: 'sv1',
        name: 'SV1 Simulator',
        type: 'simulator',
        qubits: 34,
        status: 'online',
        queue: 0,
        avgWaitTime: '< 1min',
        fidelity: 1.0,
      },
    ],
    azure: [
      {
        id: 'quantinuum',
        name: 'Quantinuum H1',
        type: 'hardware',
        qubits: 20,
        status: 'online',
        queue: 5,
        avgWaitTime: '1h',
        fidelity: 0.999,
      },
      {
        id: 'ionq_azure',
        name: 'IonQ on Azure',
        type: 'hardware',
        qubits: 11,
        status: 'online',
        queue: 3,
        avgWaitTime: '20min',
        fidelity: 0.997,
      },
    ],
  };

  // Handle provider connection
  const handleConnect = () => {
    if (!apiToken.trim()) {
      alert('Please enter your API token');
      return;
    }

    // In a real implementation, this would validate the token
    setIsConnected(true);
    setBackends(mockBackends[selectedProvider] || []);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiToken('');
    setBackends([]);
    setSelectedBackend(null);
    setJobStatus(null);
  };

  // Calculate estimated cost and time
  useEffect(() => {
    if (selectedBackend && circuit) {
      const baseTime = circuit.gates.length * 0.1; // 0.1ms per gate
      const queueTime = selectedBackend.queue * 2; // 2 min per job in queue
      setEstimatedTime(baseTime + queueTime * 60);

      // Pricing (mock values)
      if (selectedBackend.type === 'hardware') {
        const baseCost = 0.3; // $0.30 per minute
        const shotCost = shots / 10000 * 0.5; // Additional cost for shots
        setEstimatedCost(baseCost + shotCost);
      } else {
        setEstimatedCost(0); // Simulators are free
      }
    }
  }, [selectedBackend, circuit, shots]);

  // Handle job submission
  const handleSubmitJob = async () => {
    if (!selectedBackend) {
      alert('Please select a backend');
      return;
    }

    setIsSubmitting(true);
    setJobStatus('submitting');

    // Simulate API call
    setTimeout(() => {
      setJobStatus('queued');
      setTimeout(() => {
        setJobStatus('running');
        setTimeout(() => {
          setJobStatus('completed');
          // Mock results
          setJobResults({
            jobId: `job_${Date.now()}`,
            executionTime: estimatedTime,
            shots: shots,
            counts: generateMockResults(),
          });
          setIsSubmitting(false);
        }, 3000);
      }, 2000);
    }, 1000);
  };

  // Generate mock results
  const generateMockResults = () => {
    const results = {};
    const numStates = Math.min(8, Math.pow(2, circuit.numQubits));
    for (let i = 0; i < numStates; i++) {
      const state = i.toString(2).padStart(circuit.numQubits, '0');
      results[state] = Math.floor(Math.random() * shots / numStates) + 1;
    }
    return results;
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}min`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  return (
    <div className="hardware-overlay" onClick={onClose}>
      <div className="hardware-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="hardware-header">
          <h2>🌐 Real Hardware Integration</h2>
          <button className="hardware-close" onClick={onClose}>✕</button>
        </div>

        {/* Provider Selection */}
        {!isConnected && (
          <div className="hardware-body">
            <div className="hardware-section">
              <h3>Select Quantum Provider</h3>
              <div className="provider-grid">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`provider-card ${selectedProvider === provider.id ? 'selected' : ''} ${provider.status === 'coming-soon' ? 'disabled' : ''}`}
                    onClick={() => provider.status !== 'coming-soon' && setSelectedProvider(provider.id)}
                  >
                    <div className="provider-icon">{provider.icon}</div>
                    <div className="provider-info">
                      <h4>{provider.name}</h4>
                      <p>{provider.description}</p>
                      {provider.status === 'coming-soon' && (
                        <span className="provider-badge coming-soon">Coming Soon</span>
                      )}
                    </div>
                    {selectedProvider === provider.id && provider.status !== 'coming-soon' && (
                      <div className="provider-checkmark">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* API Token Input */}
            <div className="hardware-section">
              <h3>API Token</h3>
              <div className="token-input-group">
                <input
                  type="password"
                  className="token-input"
                  placeholder={`Enter your ${providers.find(p => p.id === selectedProvider)?.name} API token`}
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
                <button className="btn-connect" onClick={handleConnect}>
                  🔌 Connect
                </button>
              </div>
              <div className="token-help">
                <span>🔒 Your API token is stored locally and never sent to our servers.</span>
                <a href={providers.find(p => p.id === selectedProvider)?.website} target="_blank" rel="noopener noreferrer">
                  Get API Token →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Connected View */}
        {isConnected && (
          <div className="hardware-body">
            {/* Connection Status */}
            <div className="connection-status">
              <span className="status-indicator online">●</span>
              <span>Connected to {providers.find(p => p.id === selectedProvider)?.name}</span>
              <button className="btn-disconnect" onClick={handleDisconnect}>Disconnect</button>
            </div>

            {/* Backend Selection */}
            <div className="hardware-section">
              <h3>Select Backend</h3>
              <div className="backend-list">
                {backends.map((backend) => (
                  <div
                    key={backend.id}
                    className={`backend-card ${selectedBackend?.id === backend.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBackend(backend)}
                  >
                    <div className="backend-header">
                      <div className="backend-name">
                        <span className={`backend-type-badge ${backend.type}`}>
                          {backend.type === 'hardware' ? '🖥️' : '💻'}
                        </span>
                        <span>{backend.name}</span>
                      </div>
                      <span className={`backend-status ${backend.status}`}>●</span>
                    </div>
                    <div className="backend-specs">
                      <div className="backend-spec">
                        <span className="spec-label">Qubits:</span>
                        <span className="spec-value">{backend.qubits}</span>
                      </div>
                      <div className="backend-spec">
                        <span className="spec-label">Queue:</span>
                        <span className="spec-value">{backend.queue} jobs</span>
                      </div>
                      <div className="backend-spec">
                        <span className="spec-label">Wait Time:</span>
                        <span className="spec-value">{backend.avgWaitTime}</span>
                      </div>
                      <div className="backend-spec">
                        <span className="spec-label">Fidelity:</span>
                        <span className="spec-value">{(backend.fidelity * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Configuration */}
            {selectedBackend && (
              <div className="hardware-section">
                <h3>Job Configuration</h3>
                <div className="job-config">
                  <div className="config-item">
                    <label>Number of Shots:</label>
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      step="100"
                      value={shots}
                      onChange={(e) => setShots(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="config-item">
                    <label>Estimated Time:</label>
                    <span className="config-value">{formatTime(estimatedTime)}</span>
                  </div>
                  <div className="config-item">
                    <label>Estimated Cost:</label>
                    <span className="config-value">
                      {estimatedCost > 0 ? `$${estimatedCost.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Job Status */}
            {jobStatus && (
              <div className="hardware-section">
                <h3>Job Status</h3>
                <div className={`job-status ${jobStatus}`}>
                  <div className="job-status-indicator">
                    {jobStatus === 'completed' ? '✓' : '⏳'}
                  </div>
                  <div className="job-status-text">
                    <strong>{jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}</strong>
                    <span>
                      {jobStatus === 'submitting' && 'Submitting job to quantum backend...'}
                      {jobStatus === 'queued' && `Position in queue: ${selectedBackend?.queue || 0}`}
                      {jobStatus === 'running' && 'Executing on quantum hardware...'}
                      {jobStatus === 'completed' && 'Job completed successfully!'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {jobResults && (
              <div className="hardware-section">
                <h3>Job Results</h3>
                <div className="job-results">
                  <div className="result-header">
                    <span className="result-label">Job ID:</span>
                    <span className="result-value">{jobResults.jobId}</span>
                  </div>
                  <div className="result-counts">
                    {Object.entries(jobResults.counts).map(([state, count]) => (
                      <div key={state} className="result-bar">
                        <span className="result-state">{state}</span>
                        <div className="result-bar-container">
                          <div
                            className="result-bar-fill"
                            style={{ width: `${(count / shots) * 100}%` }}
                          />
                        </div>
                        <span className="result-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="hardware-footer">
              <button
                className="btn-submit-job"
                onClick={handleSubmitJob}
                disabled={!selectedBackend || isSubmitting}
              >
                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Job to Hardware'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareIntegration;
