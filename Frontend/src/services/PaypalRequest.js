import { authApi } from "./api";

export const createOrder = async (data) => {
  const config = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: [
          {
            name: data.name,
            description: "Get full access to all features and content",
            quantity: 1,
            unit_amount: {
              currency_code: "USD",
              value: `${data.price}.00`,
            },
          },
        ],
        amount: {
          currency_code: "USD",
          value: `${data.price}.00`,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: `${data.price}.00`,
            },
          },
        },
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Educonnect",
        },
      },
    ],
  };

  console.log(config);
  try {
    const response = await authApi.post("/payments/createorder", config);
    console.log(response);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const captureOrder = async (data) => {
  try {
    const response = await authApi.post("/payments/captureorder", data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
