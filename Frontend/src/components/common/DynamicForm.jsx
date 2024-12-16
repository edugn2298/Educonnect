import { useState } from "react";
import PropTypes from "prop-types";
import { validateField } from "../../utils/validation";
import { TextField, Button, Box, Typography, Link } from "@mui/material";

export const DynamicForm = ({ config, onSubmit, buttons, links }) => {
  const [formData, setFormData] = useState(
    config.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    config.forEach((field) => {
      const error = validateField(field, formData);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      className="max-w-lg mx-auto mt-10 p-5"
    >
      {config.map((field) => (
        <Box key={field.name} mb={3}>
          <TextField
            variant="outlined"
            fullWidth
            type={field.type}
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.validation.required}
            inputProps={{
              minLength: field.validation.minLength || undefined,
              pattern: field.validation.regex
                ? field.validation.regex.source
                : undefined,
            }}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name]}
          />
        </Box>
      ))}
      {buttons &&
        buttons.map((button, index) => (
          <Button
            key={index}
            type={button.type || "button"}
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-700"
            onClick={button.onClick}
          >
            {button.text}
          </Button>
        ))}
      {links &&
        links.map((link, index) => (
          <Typography key={index} variant="body2" className="mt-4">
            {link.text} <Link href={link.url}>{link.label}</Link>
          </Typography>
        ))}
    </Box>
  );
};

DynamicForm.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      validation: PropTypes.shape({
        required: PropTypes.bool,
        minLength: PropTypes.number,
        regex: PropTypes.instanceOf(RegExp),
      }),
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      type: PropTypes.string, // "button" or "submit"
      onClick: PropTypes.func, // Optional onClick handler
    })
  ).isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

DynamicForm.defaultProps = {
  links: [],
};

export default DynamicForm;
