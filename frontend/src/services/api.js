import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const simulationAPI = {
  simulate: (payload) => api.post("/simulate/", payload),
};

export const circuitAPI = {
  create: (payload) => api.post("/circuits/", payload),
  list: () => api.get("/circuits/"),
};

export const algorithmAPI = {
  list: () => api.get("/algorithms/"),
};

export default api;
