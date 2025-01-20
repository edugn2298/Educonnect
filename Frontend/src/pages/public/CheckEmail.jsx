import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import logo from "../../assets/logo.png";

const CheckEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleResendEmail = () => {
    alert("Email sent successfully, please check your inbox or spam folder.");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (code) {
      navigate(`/reset-password/${code}`);
    } else {
      alert("Please enter the code you received.");
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
      <Box
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
        <Typography variant="h5" sx={{ mb: 2 }}>
          Check Your Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We`&apos;`ve sent a password reset link to your email address. If you
          don`&apos;`t see it, check your spam folder.
        </Typography>
        <form onSubmit={handleFormSubmit} style={{ width: "100%" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            If you received a code, paste it here to complete the password reset
            process.
          </Typography>
          <TextField
            type="text"
            name="code"
            label="Reset Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Complete Reset
          </Button>
        </form>
        <Button
          onClick={handleResendEmail}
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mb: 2 }}
        >
          Resend Email
        </Button>
        <Button
          onClick={handleBackToLogin}
          variant="outlined"
          color="secondary"
          fullWidth
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default CheckEmail;
