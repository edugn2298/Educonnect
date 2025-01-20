import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createOrder as createPaypalOrder } from "../../../services/PaypalRequest";
import { data, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import { createTransaction } from "../../../services/transactionRequest";
import { useAuth } from "../../../context/AuthContext";
import { createSubscription } from "../../../services/subscriptionRequest";

export const PaymentPage = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [orderCaptured, setOrderCaptured] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el plan seleccionado del almacenamiento local
    console.log("Cargando plan seleccionado...");
    try {
      const plan = JSON.parse(localStorage.getItem("selectedPlan"));
      console.log("Plan cargado:", plan);
      setSelectedPlan(plan);
    } catch (error) {
      console.error("Error al cargar el plan:", error);
      navigate("/plans");
    }
  }, [navigate]);

  const createOrderForPayPal = async () => {
    console.log("Creating order for plan:", selectedPlan);
    const response = await createPaypalOrder(selectedPlan);
    console.log("Order created: ", response);
    return response.data.id; // Return order ID for PayPal
  };

  const onApprove = async (data, actions) => {
    if (actions.order) {
      const order = await actions.order.capture();
      console.log("Order captured: ", order);
      handleTransaction(order); // Function to handle subscription logic
      setOrderCaptured(true); // Set order captured flag to true
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
    // Function to handle subscription logic
    console.log("Handling subscription...", order);
    try {
      const transaction = await createTransaction(currentUser._id, order);
      console.log("Transaction created: ", transaction);
      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });
      handleSubscription();
      // Implement subscription logic here
    } catch (error) {
      console.error("Error during subscription:", error);
      setSnackbar({
        open: true,
        message: "Error during subscription.",
        severity: "error",
      });
    }
  };

  const handleSubscription = async () => {
    try {
      const subscription = await createSubscription({
        userId: currentUser._id,
        plan: selectedPlan.name.toLowerCase(),
        isActive: true,
        price: Number(selectedPlan.price),
      });
      console.log("Subscription created: ", subscription);
      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });
    } catch (error) {
      console.error("Error during subscription:", error);
      setSnackbar({
        open: true,
        message: "Error during subscription.",
        severity: "error",
      });
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
    navigate("/plans");
  };

  const handleSetPlan = () => {
    handleSubscription();
    navigate("/subscriptions");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AZ1RegERGUioTEs_x53rAyPzxBHwNuKuwRkJ7jfpWCHH7A50sFWMxyGbdbwOeDTVY5SVVbapA3SYpqKA",
      }}
    >
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(to right, #2e3b55, #243b4d)"
              : "linear-gradient(to right, #4b6cb7, #182848)",
        }}
      >
        <Sidebar />
        <Container
          sx={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              padding: "2rem",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            {selectedPlan && (
              <CardContent>
                <Typography variant="h4" gutterBottom color="#4f46e5">
                  Confirm and Pay
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {selectedPlan.name} Plan
                </Typography>
                <Typography variant="h6" gutterBottom>
                  ${selectedPlan.price} per month
                </Typography>
                <Divider sx={{ margin: "1rem 0" }} />
                <List>
                  {selectedPlan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ margin: "1rem 0" }} />
                {!orderCaptured && selectedPlan.price !== 0 && (
                  <>
                    <PayPalButtons
                      style={{
                        layout: "horizontal",
                        shape: "rect",
                        color: "gold",
                        label: "pay",
                        tagline: false,
                      }}
                      createOrder={createOrderForPayPal}
                      onApprove={onApprove}
                      onError={onError}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCancel}
                      sx={{ mt: 2 }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {!orderCaptured && selectedPlan.price === 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSetPlan}
                    sx={{ mt: 2 }}
                  >
                    Set Plan
                  </Button>
                )}
                {orderCaptured && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Payment successful!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/feed")}
                      sx={{ mt: 2 }}
                    >
                      Go to Feed
                    </Button>
                  </Box>
                )}
              </CardContent>
            )}
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

export default PaymentPage;
