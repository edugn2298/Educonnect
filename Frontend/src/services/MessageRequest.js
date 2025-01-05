import { authApi } from "./api";

export const sendMessage = async (formData) => {
  console.log(formData);
  try {
    const response = await authApi.post("/messages", formData);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMessages = async (id) => {
  try {
    const response = await authApi.get(`/messages/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
