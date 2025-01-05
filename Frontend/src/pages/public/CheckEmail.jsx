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
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-indigo-400 to-cyan-400 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
      <Box className="flex flex-col items-center gap-4 rounded-md p-8 border border-gray-300 bg-gray-100 w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-2/5 2xl:w-1/3">
        <img src={logo} alt="logo" className="w-40 mb-6" />
        <Typography variant="h5" className="mb-4">
          Check Your Email
        </Typography>
        <Typography variant="body1" className="mb-4">
          We`&apos;ve sent a password reset link to your email address. If you
          don`&apos;t see it, check your spam folder.
        </Typography>
        <form onSubmit={handleFormSubmit} className="w-full">
          <Typography variant="body1" className="mb-4">
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
            className="mb-4"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mb-4"
          >
            Complete Reset
          </Button>
        </form>
        <Button
          onClick={handleResendEmail}
          variant="outlined"
          color="secondary"
          fullWidth
          className="mb-4"
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
    </div>
  );
};

export default CheckEmail;
