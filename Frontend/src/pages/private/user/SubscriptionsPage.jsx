import { useState, useEffect } from "react";
import {
  getSubscriptionsByUser,
  renewSubscription,
} from "../../../services/subscriptionRequest";
import { useAuth } from "../../../context/AuthContext";
import {
  Box,
  Card,
  Container,
  Typography,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createOrder as createPaypalOrder } from "../../../services/PaypalRequest";
import { createTransaction } from "../../../services/transactionRequest";
import { useNavigate } from "react-router-dom";
import { deleteSubscription } from "../../../services/subscriptionRequest";

export const Subscriptions = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    fetchSubscription();
  }, [currentUser, setSubscription]);

  const fetchSubscription = async () => {
    try {
      const response = await getSubscriptionsByUser(currentUser._id);
      setSubscription(response.data);
      console.log(response.data);
    } catch (error) {
      setSubscription(null);
      console.log(error);
    }
  };

  const createOrderForPayPal = async () => {
    console.log("Creating order for plan:", subscription[0]);
    const response = await createPaypalOrder({
      name: subscription[0].plan,
      price: subscription[0].price,
    });
    console.log("Order created: ", response);
    return response.data.id; // Return order ID for PayPal
  };

  const onApprove = async (data, actions) => {
    if (actions.order) {
      const order = await actions.order.capture();
      console.log("Order captured: ", order);
      await handleTransaction(order);
      setSnackbar({
        open: true,
        message: "Purchase successful!",
        severity: "success",
      });
    } else {
      console.error("Order capture failed!");
      setSnackbar({
        open: true,
        message: "Failed to capture order.",
        severity: "error",
      });
    }
  };

  const handleTransaction = async (order) => {
    console.log("Handling transaction...", order);
    try {
      const transaction = await createTransaction(currentUser._id, order);
      console.log("Transaction created: ", transaction);
      setSnackbar({
        open: true,
        message: transaction.message,
        severity: "success",
      });
      await handleRenew();
    } catch (error) {
      console.error("Error durin Transaccion", error);
      setSnackbar({
        open: true,
        message: "Error during transaction.",
        severity: "error",
      });
    }
  };

  const handleRenew = async () => {
    console.log("subscription data", subscription[0]);
    console.log("Renewing subscription...");
    const plan = subscription[0].plan;
    try {
      await renewSubscription(currentUser._id, plan);
      setSnackbar({
        open: true,
        message: "Subscription renewed successfully.",
        severity: "success",
      });
      await fetchSubscription(); // Actualiza los datos de la suscripción después de renovar
    } catch (error) {
      console.log(error);
    }
  };

  const onError = (error) => {
    console.error("Error capturing order:", error);
    setSnackbar({
      open: true,
      message: "Error during payment.",
      severity: "error",
    });
  };

  const handleCancel = () => {
    setSnackbar({
      open: true,
      message: "Order cancelled.",
      severity: "warning",
    });
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await deleteSubscription(subscription[0]._id);
      console.log(response);
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      await fetchSubscription(); // Actualiza los datos de la suscripción después de renovar
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Error during cancelation.",
        severity: "error",
      });
    }

    //fucntion here
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  if (!subscription || subscription.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(to right, #2e3b55, #243b4d)"
              : "linear-gradient(to right, #4b6cb7, #182848)",
        }}
      >
        <Sidebar />
        <Container
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 5,
          }}
        >
          <Typography variant="h4" align="center" color="white" sx={{ mt: 4 }}>
            No subscriptions found.
          </Typography>
          <Typography variant="h5" align="center" color="white" sx={{ mt: 2 }}>
            Subscribe to a plan to access premium features.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/plans")}
            sx={{ mt: 4 }}
          >
            Choose a Plan
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AZ1RegERGUioTEs_x53rAyPzxBHwNuKuwRkJ7jfpWCHH7A50sFWMxyGbdbwOeDTVY5SVVbapA3SYpqKA",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(to right, #2e3b55, #243b4d)"
              : "linear-gradient(to right, #4b6cb7, #182848)",
        }}
      >
        <Sidebar />
        <Container
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 5,
          }}
        >
          <Card
            sx={{
              width: "100%",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1c2337" : "#ffffff",
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#ffffff" : "#4f46e5",
                  mb: 3,
                }}
                align="center"
              >
                Subscriptions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemText
                    primary="Plan"
                    secondary={subscription[0]?.plan}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Price"
                    secondary={`$${subscription[0]?.price}`}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Start Date"
                    secondary={new Date(
                      subscription[0]?.startDate
                    ).toLocaleDateString()}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="End Date"
                    secondary={new Date(
                      subscription[0]?.endDate
                    ).toLocaleDateString()}
                    primaryTypographyProps={{ fontWeight: "medium" }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={
                      subscription[0]?.isActive ? "Active" : "Inactive"
                    }
                    primaryTypographyProps={{ fontWeight: "medium" }}
                    secondaryTypographyProps={{
                      color: subscription[0]?.isActive ? "green" : "red",
                    }}
                  />
                </ListItem>
              </List>
              <Divider sx={{ mt: 2, mb: 3 }} />
              {!subscription[0]?.isActive ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: "horizontal",
                      shape: "rect",
                      color: "gold",
                      label: "subscribe",
                      tagline: false,
                    }}
                    createOrder={createOrderForPayPal}
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={handleCancel}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCancelSubscription}
                    sx={{ mt: 4 }}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#ffffff" : "#4f46e5",
                      mt: 4,
                      textAlign: "center",
                    }}
                  >
                    You don&apos;t have to renew your subscription yet
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCancelSubscription}
                    sx={{ mt: 4 }}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PayPalScriptProvider>
  );
};

export default Subscriptions;
