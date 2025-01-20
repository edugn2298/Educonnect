import { authApi } from "./api";

export const createTransaction = async (userId, order) => {
  console.log(order);

  const amount = parseFloat(
    order.purchase_units[0].payments.captures[0].amount.value
  );
  const transactionId = order.purchase_units[0].payments.captures[0].id;
  const currency =
    order.purchase_units[0].payments.captures[0].amount.currency_code;
  const status =
    order.purchase_units[0].payments.captures[0].status.toLowerCase();
  const paymentMethod = "PayPal"; // Assuming PayPal as the payment method

  const formData = {
    user: userId,
    transactionId,
    amount,
    currency,
    status,
    paymentMethod,
  };
  try {
    const response = await authApi.post("/transactions", formData);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await authApi.patch(`/transactions/${id}`, data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTransactionByUser = async (id) => {
  try {
    const response = await authApi.get(`/transactions/user/${id}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFilteredTransactions = async (filters) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await authApi.get(`/trasactionreport?${params}`);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
