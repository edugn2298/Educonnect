import { api } from "./api";

export const createUser = async (formData) => {
  console.log("Desde Auth.js", formData);
  try {
    const response = await api.post("/auth/user/register", formData);
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw new Error(error.response.data.error || "Registration failed");
    }
    throw new Error("Registration failed");
  }
};

export const login = async (emailOrUsername, password) => {
  try {
    const response = await api.post("/auth/user/login", {
      emailOrUsername,
      password,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/user/logout");
  } catch (error) {
    console.error("Error during logout", error);
    throw error.response.data;
  }
};

export const forgetPassword = async (email) => {
  try {
    const response = await api.post("/auth/user/forgot-password", { email });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/user/reset-password/${token}", {
      newPassword,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
