import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser && restricted ? (
          <Redirect to="/profile" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.any,
  restricted: PropTypes.bool,
  rest: PropTypes.object,
};

export default PublicRoute;
