import { create } from "zustand";

export const useCircuitStore = create((set) => ({
  numQubits: 2,
  gates: [],
  results: null,
  isSimulating: false,
  error: null,

  setNumQubits: (n) => set({ numQubits: n }),
  addGate: (gate) =>
    set((s) => ({ gates: [...s.gates, gate] })),
  removeGate: (idx) =>
    set((s) => ({ gates: s.gates.filter((_, i) => i !== idx) })),
  clear: () => set({ gates: [], results: null }),
  setResults: (res) => set({ results: res }),
  setIsSimulating: (b) => set({ isSimulating: b }),
  setError: (e) => set({ error: e }),
}));
