import { authApi } from "./api";

export const getSubscriptionById = async (id) => {
  try {
    const response = await authApi.get(`/subscriptions/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const createSubscription = async (data) => {
  console.log(data);
  try {
    const response = await authApi.post("/subscriptions/", data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateSubscription = async (id, data) => {
  try {
    const response = await authApi.patch(`/subscriptions/${id}`, data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSubscriptionsByUser = async (id) => {
  try {
    const response = await authApi.get(`/subscriptions/user/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const renewSubscription = async (userId, subscription) => {
  console.log(userId, subscription);
  try {
    const response = await authApi.post("/subscriptions/renew", {
      userId,
      plan: subscription,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteSubscription = async (id) => {
  try {
    const response = await authApi.patch(`/subscriptions/delete/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredSubscriptions = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await authApi.get(`/subscriptionreport?${params}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
