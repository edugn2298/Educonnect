import paypal from "@paypal/checkout-server-sdk";
import { paypalClient } from "../app.js";

export const createOrder = async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody(req.body);
    const response = await paypalClient.execute(request);
    console.log(response.result);
    res.json(response.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const captureOrder = async (req, res) => {
  const orderID = req.body.orderID;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  try {
    const capture = await paypalClient.execute(request);
    res.json(capture.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  const orderID = req.body.orderID;
  const request = new paypal.orders.OrdersCancelRequest(orderID);
  try {
    const cancel = await paypalClient.execute(request);
    res.json(cancel.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
