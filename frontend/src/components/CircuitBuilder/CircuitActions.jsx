import { useState } from "react";
import { circuitAPI } from "../../services/api";

export default function CircuitActions({ circuit, onLoad }) {
  const [circuits, setCircuits] = useState([]);
  const [showLoad, setShowLoad] = useState(false);

  const handleSave = async () => {
    const name = prompt("Circuit name:", "My Circuit");
    if (!name) return;

    try {
      await circuitAPI.create({
        name,
        description: "Saved circuit",
        num_qubits: circuit.numQubits,
        gates: circuit.gates,
      });
      alert("Circuit saved!");
    } catch (e) {
      alert("Save failed: " + e.message);
    }
  };

  const handleLoadList = async () => {
    try {
      const res = await circuitAPI.list();
      setCircuits(res.data);
      setShowLoad(true);
    } catch (e) {
      alert("Load failed: " + e.message);
    }
  };

  const handleLoadCircuit = (c) => {
    onLoad(c);
    setShowLoad(false);
  };

  return (
    <div className="circuit-actions">
      <button onClick={handleSave}>💾 Save Circuit</button>
      <button onClick={handleLoadList}>📂 Load Circuit</button>

      {showLoad && (
        <div className="load-modal">
          <h3>Saved Circuits</h3>
          {circuits.map((c) => (
            <div key={c.id} onClick={() => handleLoadCircuit(c)}>
              {c.name} ({c.num_gates} gates)
            </div>
          ))}
          <button onClick={() => setShowLoad(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
