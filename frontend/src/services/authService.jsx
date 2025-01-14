import api from "./api";

const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (details) => {
    const response = await api.post("/auth/register", details);
    return response.data;
  },
};

export default authService;
