import { useState } from "react";
import { circuitAPI } from "../../services/api";

export default function CircuitActions({ circuit, onLoad }) {
  const [circuits, setCircuits] = useState([]);
  const [showLoad, setShowLoad] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const name = prompt("Circuit name:", "My Circuit");
    if (!name) return;

    setIsSaving(true);
    try {
      await circuitAPI.create({
        name,
        description: "Saved circuit",
        num_qubits: circuit.numQubits,
        gates: circuit.gates,
      });
      alert("✅ Circuit saved successfully!");
    } catch (e) {
      alert("❌ Save failed: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadList = async () => {
    setIsLoading(true);
    try {
      const res = await circuitAPI.list();
      setCircuits(res.data);
      setShowLoad(true);
    } catch (e) {
      alert("❌ Load failed: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadCircuit = (c) => {
    onLoad(c);
    setShowLoad(false);
  };

  return (
    <div className="circuit-actions">
      <button onClick={handleSave} disabled={isSaving} className="btn-action">
        {isSaving ? (
          <>
            <span className="spinner-small"></span> Saving...
          </>
        ) : (
          <>💾 Save Circuit</>
        )}
      </button>
      <button onClick={handleLoadList} disabled={isLoading} className="btn-action">
        {isLoading ? (
          <>
            <span className="spinner-small"></span> Loading...
          </>
        ) : (
          <>📂 Load Circuit</>
        )}
      </button>

      {showLoad && (
        <div className="load-modal-overlay" onClick={() => setShowLoad(false)}>
          <div className="load-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Saved Circuits</h3>
            <div className="circuits-list">
              {circuits.length === 0 ? (
                <p className="no-circuits">No saved circuits found</p>
              ) : (
                circuits.map((c) => (
                  <div key={c.id} className="circuit-item" onClick={() => handleLoadCircuit(c)}>
                    <span className="circuit-name">{c.name}</span>
                    <span className="circuit-info">({c.num_gates} gates)</span>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setShowLoad(false)} className="btn-close-modal">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
