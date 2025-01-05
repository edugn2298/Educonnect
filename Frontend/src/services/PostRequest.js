import { authApi } from "./api";

export const createPost = async (formData) => {
  try {
    const response = await authApi.post("/posts/create", formData);
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

export const feedPosts = async (id, page) => {
  try {
    const response = await authApi.get(`/posts/feed?page=${page}`, {
      user: id,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPosts = async (id, page, limit = 10) => {
  try {
    const response = await authApi.get(
      `/posts/postbyid?id=${id}&page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await authApi.patch(`/posts/delete/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const updatePost = async (id, formData) => {
  try {
    const response = await authApi.patch(`/posts/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw new Error(error.response.data.error || "Update failed");
    }
    throw new Error("Update failed");
  }
};
