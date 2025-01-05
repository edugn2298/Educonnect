import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  login as loginApi,
  logout as logoutApi,
  createUser as registerApi,
  forgetPassword as forgetPasswordApi,
  resetPassword as resetPasswordApi,
} from "../services/auth";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setInitialLoading(false);
  }, []);

  /* const fetchUserDetails = useCallback(async () => {
    if (currentUser && currentUser._id) {
      try {
        const response = await getUser(currentUser._id);
        if (response) {
          setCurrentUser(response.data);
          setError(null); // Clear any previous error
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      }
    }
  }, [currentUser]);

    useEffect(() => {
    if (currentUser) {
      fetchUserDetails();

      const interval = setInterval(fetchUserDetails, 30000);

      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socket.on("userUpdated", (updatedUser) => {
        if (updatedUser._id === currentUser._id) {
          setCurrentUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      });

      return () => {
        clearInterval(interval);
        socket.off("userUpdated");
        socket.disconnect();
      };
    }
  }, [currentUser, fetchUserDetails]);*/

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    if (!formData.role) {
      formData.role = "user";
    }
    try {
      const response = await registerApi(formData);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("welcomeShow", "false");
      setCurrentUser(user);

      setAlertMessage("Registration successful!");
      setAlertOpen(true);
      navigate("/welcome");
      return response;
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(emailOrUsername, password);
      console.log("Response from AuthProvider:", response);
      if (response && response.data) {
        const { user, token } = response.data;
        setCurrentUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("welcomeShow", "true");
        localStorage.setItem("isFirstLogin", "true");
      }
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await logoutApi();
      setAlertMessage("Logout successful!");
      return response;
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Logout failed.");
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("welcomeShow");
      localStorage.removeItem("isFirstLogin");
      navigate("/login");
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const forgotPassword = async (email) => {
    console.log("Desde AuthProvider.js", email);
    try {
      const response = await forgetPasswordApi(email);
      console.log("Response from AuthProvider:", response);
      return response;
    } catch (error) {
      console.error("Error during password reset request:", error);
      setError("Password reset request failed.");
    }
  };

  const resetPassword = async (token, formData) => {
    try {
      const response = await resetPasswordApi(token, formData);
      console.log("Response from AuthProvider:", response);
      return response;
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("Password reset failed.");
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    initialLoading,
    error,
    setLoading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {initialLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {children}
          <Snackbar
            open={alertOpen}
            autoHideDuration={3000}
            onClose={handleAlertClose}
          >
            <Alert
              onClose={handleAlertClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
