import { create } from "zustand";

export const useCircuitStore = create((set, get) => ({
  numQubits: 2,
  gates: [],
  results: null,
  isSimulating: false,
  error: null,
  history: [],
  historyIndex: -1,

  _pushHistory: () => {
    const { gates, numQubits, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ gates: [...gates], numQubits });
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  setNumQubits: (n) => {
    get()._pushHistory();
    set({ numQubits: n, gates: [], results: null });
  },
  
  addGate: (gate) => {
    get()._pushHistory();
    set((s) => ({ gates: [...s.gates, gate] }));
  },
  
  removeGate: (idx) => {
    get()._pushHistory();
    set((s) => ({ gates: s.gates.filter((_, i) => i !== idx) }));
  },
  
  clear: () => {
    get()._pushHistory();
    set({ gates: [], results: null, error: null });
  },
  
  setResults: (res) => set({ results: res }),
  setIsSimulating: (b) => set({ isSimulating: b }),
  setError: (e) => set({ error: e }),
  
  loadCircuit: (numQubits, gates) => {
    get()._pushHistory();
    set({ numQubits, gates, results: null, error: null });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({
        gates: [...prevState.gates],
        numQubits: prevState.numQubits,
        historyIndex: historyIndex - 1,
        results: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        gates: [...nextState.gates],
        numQubits: nextState.numQubits,
        historyIndex: historyIndex + 1,
        results: null,
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
