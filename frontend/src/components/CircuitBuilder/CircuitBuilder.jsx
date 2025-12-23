import { useCircuitStore } from "../../store/circuitStore";
import { simulationAPI } from "../../services/api";
import GatePalette from "./GatePalette";
import CircuitCanvas from "./CircuitCanvas";
import MeasurementChart from "../Visualizations/MeasurementChart";

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
  } = useCircuitStore();

  const handleAddGate = (type) => {
    // CNOT needs 2 qubits, others need 1
    if (type === "CNOT") {
      if (numQubits < 2) {
        setError("CNOT gate requires at least 2 qubits");
        return;
      }
      addGate({ type, qubits: [0, 1], params: [] });
    } else {
      addGate({ type, qubits: [0], params: [] });
    }
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

  return (
    <div>
      <div>
        <label>Qubits: </label>
        <input
          type="number"
          min={1}
          max={12}
          value={numQubits}
          onChange={(e) => setNumQubits(Number(e.target.value))}
        />
        <button onClick={handleSimulate} disabled={!gates.length || isSimulating}>
          {isSimulating ? "Simulating..." : "Simulate"}
        </button>
        <button onClick={clear}>Clear</button>
      </div>
      <GatePalette onAdd={handleAddGate} />
      <CircuitCanvas gates={gates} numQubits={numQubits} onRemove={removeGate} />
      {error && <div style={{ 
        color: 'red', 
        padding: '1rem', 
        background: '#ffebee', 
        border: '1px solid red', 
        borderRadius: '4px',
        margin: '1rem 0'
      }}>
        <strong>Error:</strong> {error}
      </div>}
      <MeasurementChart results={results} />
    </div>
  );
}
