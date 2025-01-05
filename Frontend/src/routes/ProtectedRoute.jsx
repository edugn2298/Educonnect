import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requireAuth, isAllowed = [], children }) => {
  const { currentUser } = useAuth();
  const welcomeShow = localStorage.getItem("welcomeShow");
  const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

  // Check if user is authenticated
  const isAuthenticated = !!currentUser;

  // Check if user has required role (if isAllowed is provided)
  const userHasRequiredRole =
    currentUser && isAllowed.length > 0
      ? isAllowed.includes(currentUser.role)
      : true;

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if route is private and user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && !userHasRequiredRole) {
    // Redirect to unauthorized if user does not have required role
    return <Navigate to="/unauthorized" replace />;
  }

  if (isAuthenticated && welcomeShow === "false") {
    // Redirect to welcome if user is authenticated but has not seen the welcome page
    return <Navigate to="/welcome" replace />;
  }

  if (isAuthenticated && isFirstLogin) {
    localStorage.setItem("isFirstLogin", "false");
    return <Navigate to="/Feed" replace />;
  }

  if (isAuthenticated && welcomeShow === "true" && !requireAuth) {
    // Redirect to profile if route is public and user is authenticated
    return <Navigate to="/Feed" replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  requireAuth: PropTypes.bool,
  isAllowed: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

export default ProtectedRoute;
