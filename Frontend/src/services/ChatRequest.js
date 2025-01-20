import { authApi } from "./api";

export const CreateChat = async (formData) => {
  try {
    const response = await authApi.post("/chats/", formData);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response from backend:", error.response.data);
      throw new Error(error.response.data.error || "Registration failed");
    }
    throw new Error("Registration failed");
  }
};

export const getChat = async (id) => {
  try {
    const response = await authApi.get(`/chats/getchat/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const findChat = async (currentUser, id) => {
  try {
    const response = await authApi.get(`/chats/find/${currentUser}/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteChat = async (id) => {
  try {
    const response = await authApi.patch(`/chats/delete/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
