import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ requireAuth, isAllowed = [], children }) => {
  const { currentUser } = useAuth();
  const isAuthenticated = !!currentUser;

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
  if (isAuthenticated && !requireAuth) {
    // Redirect authenticated users away from public routes like login, register, reset password
    return <Navigate to="/feed" replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  requireAuth: PropTypes.bool,
  isAllowed: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

export default ProtectedRoute;
