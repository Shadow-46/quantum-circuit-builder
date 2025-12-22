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
    // simple: always target qubit 0 for now
    addGate({ type, qubits: [0], params: [] });
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
      setError(e.message || "Simulation failed");
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
      {error && <div>{error}</div>}
      <MeasurementChart results={results} />
    </div>
  );
}
