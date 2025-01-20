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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Sidebar from "../../../components/layout/Sidebar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: 0,
    features: ["Basic access", "Limited support", "Access to free content"],
  },
  {
    name: "Premium",
    price: 29,
    features: [
      "Full access",
      "Premium support",
      "Access to exclusive content",
      "Monthly updates",
      "Free e-books",
    ],
  },
  {
    name: "Enterprise",
    price: 49,
    features: [
      "Full access",
      "Premium support",
      "Access to exclusive content",
      "Greater limitations",
    ],
  },
];

export const PlansPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClickOpen = (plan) => {
    console.log("Selected plan:", plan);
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/payment");
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
          background:
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              width: "100%",
              padding: "2rem",
              boxShadow: 3,
              borderRadius: 3,
              background: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#4f46e5" }}
            >
              Take your profile to the next{" "}
              <span style={{ color: "#0266d4" }}>Level</span>
            </Typography>
            <Typography variant="h6" align="center" gutterBottom>
              Choose a plan that suits your needs!
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: "1rem",
                justifyContent: "center",
                mt: 3,
              }}
            >
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  sx={{
                    flex: 1,
                    padding: "1.5rem",
                    textAlign: "center",
                    borderColor: "#4f46e5",
                    borderWidth: 2,
                    borderRadius: "10%",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease-in-out",
                    },
                    background: theme.palette.background.primary,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      color="#4f46e5"
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h2"
                      color="#4f46e5"
                      gutterBottom
                      display={"inline"}
                    >
                      ${plan.price}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      gutterBottom
                      display={"inline"}
                    >
                      /month
                    </Typography>
                    <Divider sx={{ margin: "1rem 0" }} />
                    <List>
                      {plan.features.map((feature) => (
                        <ListItem key={feature}>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    <Divider sx={{ margin: "1rem 0" }} />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleClickOpen(plan)}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Card>
        </Container>
      </Box>
    </PayPalScriptProvider>
  );
};

export default PlansPage;
