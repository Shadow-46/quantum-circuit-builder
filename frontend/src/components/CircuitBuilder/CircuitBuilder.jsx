import { useState, useEffect } from "react";
import { useCircuitStore } from "../../store/circuitStore";
import { simulationAPI, circuitAPI, exportAPI, algorithmAPI } from "../../services/api";
import GatePalette from "./GatePalette";
import CircuitCanvas from "./CircuitCanvas";
import MeasurementChart from "../Visualizations/MeasurementChart";
import CircuitStats from "../Common/CircuitStats";
import StatevectorView from "../Visualizations/StatevectorView";
import BlochSphere from "../Visualizations/BlochSphere";
import DensityMatrixView from "../Visualizations/DensityMatrixView";

export default function CircuitBuilder() {
  const {
    numQubits,
    gates,
    setNumQubits,
    addGate,
    removeGate,
    clear,
    results,
    setResults,
    isSimulating,
    setIsSimulating,
    error,
    setError,
    loadCircuit,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCircuitStore();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [circuitName, setCircuitName] = useState("");
  const [circuitDescription, setCircuitDescription] = useState("");
  const [savedCircuits, setSavedCircuits] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [exportCode, setExportCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statevector, setStatevector] = useState(null);
  const [blochData, setBlochData] = useState(null);
  const [densityMatrix, setDensityMatrix] = useState(null);
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [viewMode, setViewMode] = useState('measurements'); // 'measurements', 'statevector', 'bloch', 'density'

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await algorithmAPI.listTemplates();
        setTemplates(Object.entries(res.data.templates).map(([id, template]) => ({
          id,
          ...template,
        })));
      } catch (e) {
        console.error("Failed to load templates:", e);
      }
    };
    loadTemplates();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const handleAddGate = (gate) => {
    addGate(gate);
  };

  const handleSimulate = async () => {
    try {
      setIsSimulating(true);
      setError(null);
      const res = await simulationAPI.simulate({
        num_qubits: numQubits,
        gates,
        shots: 1024,
      });
      setResults(res.data);
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Simulation failed";
      setError(errorMsg);
      console.error("Simulation error:", e.response?.data);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = async () => {
    if (!circuitName.trim()) {
      setError("Circuit name is required");
      return;
    }
    
    try {
      setIsLoading(true);
      await circuitAPI.create({
        name: circuitName,
        description: circuitDescription,
        num_qubits: numQubits,
        gates,
      });
      setShowSaveModal(false);
      setCircuitName("");
      setCircuitDescription("");
      setError(null);
      alert("Circuit saved successfully!");
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Save failed";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadList = async () => {
    try {
      setIsLoading(true);
      const res = await circuitAPI.list();
      setSavedCircuits(res.data);
      setShowLoadModal(true);
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Failed to load circuits";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadCircuit = (circuit) => {
    loadCircuit(circuit.num_qubits, circuit.gates);
    setShowLoadModal(false);
    setError(null);
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const res = await exportAPI.exportQiskit({
        num_qubits: numQubits,
        gates,
      });
      setExportCode(res.data.code);
      setShowExportModal(true);
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Export failed";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportCode);
    alert("Code copied to clipboard!");
  };

  const handleLoadTemplate = (template) => {
    loadCircuit(template.num_qubits, template.gates);
    setShowTemplateModal(false);
    setError(null);
  };

  const handleGetStatevector = async () => {
    try {
      setIsLoading(true);
      const res = await simulationAPI.getStatevector({
        num_qubits: numQubits,
        gates,
      });
      setStatevector(res.data);
      setViewMode('statevector');
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Statevector calculation failed";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetBloch = async () => {
    try {
      setIsLoading(true);
      const res = await simulationAPI.getBloch(
        { num_qubits: numQubits, gates },
        selectedQubit
      );
      setBlochData(res.data);
      setViewMode('bloch');
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Bloch calculation failed";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDensityMatrix = async () => {
    try {
      setIsLoading(true);
      const res = await simulationAPI.getDensityMatrix({
        num_qubits: numQubits,
        gates,
      });
      setDensityMatrix(res.data);
      setViewMode('density');
    } catch (e) {
      const errorMsg = e.response?.data?.detail || e.message || "Density matrix calculation failed";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="circuit-builder">
      <div className="circuit-controls">
        <div className="control-group">
          <label>Qubits: </label>
          <input
            type="number"
            min={1}
            max={12}
            value={numQubits}
            onChange={(e) => setNumQubits(Number(e.target.value))}
          />
        </div>
        <div className="action-buttons">
          <button onClick={() => setShowTemplateModal(true)} className="btn-secondary">
            📚 Templates
          </button>
          <button onClick={handleSimulate} disabled={!gates.length || isSimulating} className="btn-primary">
            {isSimulating ? "Simulating..." : "🔬 Simulate"}
          </button>
          <button onClick={handleExport} disabled={!gates.length} className="btn-secondary">
            📤 Export
          </button>
          <button onClick={() => setShowSaveModal(true)} disabled={!gates.length} className="btn-secondary">
            💾 Save
          </button>
          <button onClick={handleLoadList} className="btn-secondary">
            📂 Load
          </button>
          <div className="undo-redo-group">
            <button onClick={undo} disabled={!canUndo()} className="btn-icon" title="Undo (Ctrl+Z)">
              ↶
            </button>
            <button onClick={redo} disabled={!canRedo()} className="btn-icon" title="Redo (Ctrl+Shift+Z)">
              ↷
            </button>
          </div>
          <button onClick={clear} disabled={!gates.length} className="btn-danger">
            🗑️ Clear
          </button>
        </div>
      </div>
      
      <GatePalette onAdd={handleAddGate} numQubits={numQubits} />
      <CircuitCanvas gates={gates} numQubits={numQubits} onRemove={removeGate} />
      
      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
      
      {/* Visualization Mode Selector */}
      {gates.length > 0 && (
        <div className="view-mode-selector">
          <button 
            onClick={() => setViewMode('measurements')} 
            className={`view-tab ${viewMode === 'measurements' ? 'active' : ''}`}
          >
            📊 Measurements
          </button>
          <button 
            onClick={handleGetStatevector} 
            disabled={isLoading}
            className={`view-tab ${viewMode === 'statevector' ? 'active' : ''}`}
          >
            🌊 Statevector
          </button>
          <button 
            onClick={handleGetBloch} 
            disabled={isLoading || numQubits > 3}
            className={`view-tab ${viewMode === 'bloch' ? 'active' : ''}`}
            title={numQubits > 3 ? 'Bloch sphere works best with 1-3 qubits' : ''}
          >
            ⚛️ Bloch Sphere
          </button>
          <button 
            onClick={handleGetDensityMatrix} 
            disabled={isLoading || numQubits > 3}
            className={`view-tab ${viewMode === 'density' ? 'active' : ''}`}
            title={numQubits > 3 ? 'Density matrix view limited to ≤3 qubits' : ''}
          >
            📊 Density Matrix
          </button>
          {viewMode === 'bloch' && numQubits > 1 && (
            <select 
              value={selectedQubit} 
              onChange={(e) => setSelectedQubit(Number(e.target.value))}
              className="qubit-selector-inline"
            >
              {Array.from({ length: numQubits }).map((_, i) => (
                <option key={i} value={i}>Qubit {i}</option>
              ))}
            </select>
          )}
        </div>
      )}
      
      <div className="results-section">
        <CircuitStats gates={gates} numQubits={numQubits} />
        
        {viewMode === 'measurements' && <MeasurementChart results={results} />}
        {viewMode === 'statevector' && <StatevectorView statevector={statevector} />}
        {viewMode === 'bloch' && <BlochSphere blochData={blochData} />}
        {viewMode === 'density' && <DensityMatrixView densityMatrix={densityMatrix} />}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>💾 Save Circuit</h3>
            <div className="form-group">
              <label>Circuit Name *</label>
              <input
                type="text"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                placeholder="e.g., Bell State"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={circuitDescription}
                onChange={(e) => setCircuitDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSave} disabled={isLoading} className="btn-primary">
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowSaveModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>📂 Load Circuit</h3>
            {savedCircuits.length === 0 ? (
              <p className="empty-state">No saved circuits found</p>
            ) : (
              <ul className="circuit-list">
                {savedCircuits.map((circuit) => (
                  <li key={circuit.id} className="circuit-item">
                    <div className="circuit-info">
                      <strong>{circuit.name}</strong>
                      {circuit.description && <p>{circuit.description}</p>}
                      <small>
                        {circuit.num_qubits} qubits • {circuit.gates.length} gates
                      </small>
                    </div>
                    <button 
                      onClick={() => handleLoadCircuit(circuit)}
                      className="btn-primary btn-sm"
                    >
                      Load
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowLoadModal(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>📚 Circuit Templates</h3>
            <div className="template-grid">
              {templates.map((template) => (
                <div key={template.id} className="template-card">
                  <h4>{template.name}</h4>
                  <p className="template-description">{template.description}</p>
                  <div className="template-meta">
                    <span className="badge badge-{template.difficulty}">{template.difficulty}</span>
                    <span className="badge">{template.category}</span>
                    <span>{template.num_qubits} qubits • {template.gates.length} gates</span>
                  </div>
                  <button 
                    onClick={() => handleLoadTemplate(template)}
                    className="btn-primary btn-block"
                  >
                    Load Template
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowTemplateModal(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>📤 Export to Qiskit</h3>
            <pre className="code-block">{exportCode}</pre>
            <div className="modal-actions">
              <button onClick={handleCopyCode} className="btn-primary">
                📋 Copy to Clipboard
              </button>
              <button onClick={() => setShowExportModal(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
