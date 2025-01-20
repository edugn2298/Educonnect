import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
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
    name: "fullname",
    label: "Fullname",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z ]+$/,
    },
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z0-9_ ]+$/,
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validation: {
      required: true,
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z0-9,.\s]+$/,
    },
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z\s]+$/,
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: {
      required: true,
      regex:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    validation: {
      required: true,
      regex:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    },
  },
];

const buttons = [
  {
    text: "Sign Up",
    type: "submit",
  },
];

const RegisterPage = () => {
  const { register } = useAuth();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
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
        console.log("formdata desde register", formData);
        const response = await register(formData);
        setAlertMessage(response.data.message);
        setAlertOpen(true);
        setFormData(
          formConfig.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
          }, {})
        );
        console.log(response);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #2e3b55, #243b4d)"
            : "linear-gradient(to right, #4b6cb7, #182848)",
        p: 3, // padding
        overflow: "auto", // to handle potential overflows
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
          width: "100%", // full width
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
          <Link href="/login" underline="hover" sx={{ color: "primary.main" }}>
            <Typography variant="body2">Already have an account?</Typography>
          </Link>
        </Box>
      </Container>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
