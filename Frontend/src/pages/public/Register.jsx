import { useAuth } from "../../context/AuthContext";
import { DynamicForm } from "../../components/common/DynamicForm";

const formConfig = [
  {
    name: "fullname",
    label: "Fullname",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z ]+$/,
    },
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z0-9_]+$/,
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validation: {
      required: true,
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z0-9,.\s]+$/,
    },
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    validation: {
      required: true,
      regex: /^[a-zA-Z\s]+$/,
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: {
      required: true,
      regex:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    validation: {
      required: true,
      regex:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    },
  },
];
const RegisterPage = () => {
  const { register } = useAuth();
  const handleSubmit = async (data) => {
    try {
      await register(data.username, data.email, data.password, data.role);
    } catch (error) {
      console.error(error);
    }
  };

  return <DynamicForm config={formConfig} onSubmit={handleSubmit} />;
};

export default RegisterPage;
