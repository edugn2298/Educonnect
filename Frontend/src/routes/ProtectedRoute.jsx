import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requireAuth, isAllowed = [], children }) => {
  const { currentUser } = useAuth();

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

  if (isAuthenticated && !requireAuth) {
    // Redirect to profile if route is public and user is authenticated
    return <Navigate to="/profile" replace />;
  }

  if (isAuthenticated && !userHasRequiredRole) {
    // Redirect to unauthorized if user does not have required role
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  requireAuth: PropTypes.bool,
  isAllowed: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

export default ProtectedRoute;
