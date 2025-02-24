import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3005",
});

const authApi = axios.create({
  baseURL: "http://localhost:3005",
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token añadido a los headeres:", token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api, authApi };
