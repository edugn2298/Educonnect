import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  login as loginApi,
  logout as logoutApi,
  createUser as registerApi,
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

  const register = async (username, email, password, role) => {
    setLoading(true);
    try {
      const response = await registerApi(username, email, password, role);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const response = await loginApi(emailOrUsername, password);
      if (response && response.data) {
        const { user, token } = response.data;
        console.log("Response:", response);
        setToken(token);
        setCurrentUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(error);
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

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    setLoading,
    register,
    login,
    logout,
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
