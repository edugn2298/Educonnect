import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../services/auth";

const AuthContext = createContext();

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
      const { user, token } = response.data;
      setToken(token);
      setCurrentUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
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
