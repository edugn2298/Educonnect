import PropTypes from "prop-types";
import { validateField } from "../utils/validation";

const DynamicForm = ({ config, onSubmit }) => {
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
      const error = validateField(field, formData[field.name]);
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
    <form onSubmit={handleSubmit}>
      {config.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-gray-700" htmlFor={field.name}>
            {field.label}:
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.validation.required}
            minLength={field.validation.minLength || undefined}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
      >
        Submit
      </button>
    </form>
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
        regex: PropTypes.instanceOf(RegExp), // Validación por regex
      }),
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DynamicForm;
