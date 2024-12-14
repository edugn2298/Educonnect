export const validateField = (field, value) => {
  const { validation } = field;
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

  return error;
};
