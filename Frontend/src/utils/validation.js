export const validateField = (field, formData) => {
  const { validation } = field;
  const value = formData[field.name];
  let error = "";

  if (validation.required && !value) {
    error = `${field.label} is required`;
  }

  if (validation.minLength && value.length < validation.minLength) {
    error = `${field.label} must be at least ${validation.minLength} characters long`;
  }

  if (validation.regex && !validation.regex.test(value)) {
    error = `${field.label} is not valid`;
  }
  if (field.name === "confirmPassword" && value !== formData["password"]) {
    error = "Passwords do not match";
  }

  return error;
};
