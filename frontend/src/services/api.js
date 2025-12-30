import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const simulationAPI = {
  simulate: (payload) => api.post("/simulate/", payload),
  getStatevector: (payload) => api.post("/simulate/statevector", payload),
  getBloch: (payload, qubitIndex = 0) => 
    api.post(`/simulate/bloch?qubit_index=${qubitIndex}`, payload),
  getDensityMatrix: (payload) => api.post("/simulate/density-matrix", payload),
};

export const circuitAPI = {
  create: (payload) => api.post("/circuits/", payload),
  list: () => api.get("/circuits/"),
};

export const algorithmAPI = {
  list: () => api.get("/algorithms/"),
  listTemplates: () => api.get("/algorithms/templates"),
  getTemplate: (id) => api.get(`/algorithms/templates/${id}`),
};

export const exportAPI = {
  exportQiskit: (payload) => api.post("/export/qiskit", payload),
};

export default api;
