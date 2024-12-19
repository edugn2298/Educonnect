import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  login as loginApi,
  logout as logoutApi,
  createUser as registerApi,
  forgetPassword as forgetPasswordApi,
  resetPassword as resetPasswordApi,
} from "../services/auth";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);
  const register = async (formData) => {
    setLoading(true);
    console.log("Form Data from AuthContext:", formData);
    if (!formData.role) {
      formData.role = "user";
    }
    try {
      const response = await registerApi(formData);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const response = await loginApi(emailOrUsername, password);
      console.log("Response:", response);
      if (response && response.data) {
        const { user, token } = response.data;
        setToken(token);
        setCurrentUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await forgetPasswordApi(email);
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await resetPasswordApi(token, newPassword);
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    setLoading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };

  AuthContext.propTypes = {
    currentUser: PropTypes.object,
    setCurrentUser: PropTypes.func,
    loading: PropTypes.bool,
    setLoading: PropTypes.func,
    children: PropTypes.node,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
