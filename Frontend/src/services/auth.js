import { api, authApi } from "./api";

/**
 * Creates a new user
 * @function createUser
 * @param {Object} formData - The user data to be registered
 * @returns {Promise<Object>} - The response from the server
 * @throws {Error} - If there is an error when creating the user
 */
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
    console.log(response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await authApi.post("/auth/user/logout");
    return response;
  } catch (error) {
    console.error("Error during logout", error);
    throw error.response.data;
  }
};

export const forgetPassword = async (email) => {
  console.log("Desde Auth.js", "Email:", email);
  try {
    const response = await api.post("/auth/user/forgot-password", { email });
    console.log(response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (token, newPassword) => {
  console.log("Desde Auth.js", "Token:", token, "New Password:", newPassword);
  try {
    const response = await api.post(`/auth/user/reset-password/${token}`, {
      newPassword,
    });
    console.log("Response from Auth.js:", response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUser = async (id) => {
  try {
    const response = await authApi.get(`/users/profile/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (id, formData) => {
  try {
    console.log("Desde Auth.js", "ID:", id, "Form Data:", formData);
    const response = await authApi.patch(`/users/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFollowers = async (id) => {
  try {
    const response = await authApi.get(`/users/followers/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFollowing = async (id) => {
  try {
    const response = await authApi.get(`/users/following/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const followUser = async (userId, id) => {
  console.log("Desde Auth.js", "User ID:", userId, "ID:", id);
  try {
    const response = await authApi.patch(`/users/follow/${id}`, { userId });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const unfollowUser = async (userId, id) => {
  try {
    const response = await authApi.patch(`/users/unfollow/${id}`, { userId });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await authApi.get(`/users/search?q=${query}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchFollowing = async (id, query) => {
  try {
    const response = await authApi.get(`/users/sf/${id}?q=${query}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredUsers = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await authApi.get(`/userreport?${params}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
