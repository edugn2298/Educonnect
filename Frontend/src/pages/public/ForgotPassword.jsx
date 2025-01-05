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
];

const buttons = [{ text: "Recover Password", type: "submit" }];

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
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
      console.log(formData);
      try {
        const response = await forgotPassword(formData.emailOrUsername);
        console.log(response);
        setErrorMessage("");
        setAlertMessage(response.data.message);
        setAlertSeverity("success");
        setAlertOpen(true);
        setTimeout(() => {
          navigate("/check-email");
        }, 3000);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
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
    <div
      className="
        w-screen h-screen flex justify-center items-center bg-gradient-to-r from-indigo-400 to-cyan-400 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700
      "
    >
      <Box
        className="
          flex flex-col items-center gap-4 rounded-md p-8 border border-gray-300 bg-gray-100
          w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-2/5 2xl:w-1/3
        "
      >
        <img src={logo} alt="logo" className="w-40 mb-6" />
        {errorMessage && (
          <Alert severity="error" className="w-full mb-4">
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
            className="mb-4"
          />
        ))}
        <Link
          href="/login"
          underline="hover"
          className="mb-4 text-blue-500 hover:text-blue-700"
        >
          <Typography variant="body2">Do you want to login?</Typography>
        </Link>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          className="mb-4 bg-form-bgButtonPrimary !text-form-textWhite hover:bg-form-bgButtonPrimaryHover"
        >
          {buttons[0].text}
        </Button>
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default ForgotPassword;
