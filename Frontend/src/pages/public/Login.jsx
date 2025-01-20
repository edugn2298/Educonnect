import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Link,
  Typography,
  Alert,
  Snackbar,
  Container,
} from "@mui/material";
import logo from "../../assets/logo.png";
import { validateField } from "../../utils/validation";

const formConfig = [
  {
    name: "emailOrUsername",
    label: "Email or Username",
    type: "text",
    validation: { required: true },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: { required: true },
  },
];

const buttons = [{ text: "Login", type: "submit" }];

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState(
    formConfig.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    formConfig.forEach((field) => {
      const error = validateField(field, formData);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await login(
          formData.emailOrUsername,
          formData.password
        );
        console.log(response);
        setAlertMessage(response.data.message);
        setAlertSeverity("success");
        setAlertOpen(true);
        setTimeout(() => {
          navigate("/feed");
        }, 3000);
      } catch (error) {
        console.error(error);
        setErrorMessage("Invalid username or password");
        setFormData(
          formConfig.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
          }, {})
        );
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #2e3b55, #243b4d)"
            : "linear-gradient(to right, #4b6cb7, #182848)",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: (theme) => theme.palette.background.paper,
          maxWidth: {
            xs: "90%", // max width for extra small screens
            sm: "80%", // max width for small screens
            md: "70%", // max width for medium screens
            lg: "60%", // max width for large screens
            xl: "50%", // max width for extra large screens
          },
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "160px", marginBottom: "24px" }}
        />
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {formConfig.map((field) => (
          <TextField
            key={field.name}
            variant="outlined"
            fullWidth
            type={field.type}
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name]}
            sx={{ mb: 2 }}
          />
        ))}
        <Link
          href="/forgot-password"
          underline="hover"
          sx={{ mb: 2, color: "primary.main" }}
        >
          <Typography variant="body2">Forgot Password?</Typography>
        </Link>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{ mb: 2 }}
        >
          {buttons[0].text}
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Link
            href="/register"
            underline="hover"
            sx={{ color: "primary.main" }}
          >
            <Typography variant="body2">Don&apos;t have an account?</Typography>
          </Link>
        </Box>
      </Container>
      <Snackbar
        open={alertOpen}
        onClose={handleCloseAlert}
        autoHideDuration={3000}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
