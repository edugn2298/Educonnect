import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({ children, className, variant, ...props }) => {
  const baseStyles =
    "flex items-center justify-center px-4 py-2 rounded focus:outline-none focus:ring";
  const variants = {
    navbarButton: "bg-navbar-bgButtons text-navbar-textButton",
    formButtonPrimary:
      "bg-form-bgButtonPrimary text-form-textWhite hover:bg-form-bgButtonPrimaryHover",
    formButtonSecondary:
      "bg-form-bgButtonSecondary text-form-textWhite hover:bg-form-bgButtonSecondaryHover",
  };

  return (
    <button
      className={classNames(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string, // Añadir validación de className
  variant: PropTypes.oneOf([
    "navbarButton",
    "formButtonPrimary",
    "formButtonSecondary",
  ]).isRequired,
};

Button.defaultProps = {
  variant: "navbarButton", // Cambiado de variants a variant
};

export default Button;
