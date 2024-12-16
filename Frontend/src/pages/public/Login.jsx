import { useAuth } from "../../context/AuthContext";
import { DynamicForm } from "../../components/common/DynamicForm";

const formConfig = [
  {
    name: "emailOrUsername",
    label: "Email or Username",
    type: "text",
    validation: { required: true },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    validation: { required: true },
  },
];

const buttons = [{ text: "Iniciar Sesión", type: "submit" }];

const LoginPage = () => {
  const { login } = useAuth();
  const handleSubmit = async (data) => {
    try {
      await login(data.emailOrUsername, data.password);
    } catch (error) {
      console.error(error);
    }
  };

  const links = [
    {
      text: "Don't have an account?",
      url: "/register",
      label: "Register",
    },
    {
      text: "Forgot Password?",
      url: "/forgot-password",
      label: "Forgot Password",
    },
  ];

  return (
    <>
      <div className="container flex items-center justify-center w-screen h-screen">
        <div className="">
          <DynamicForm
            config={formConfig}
            onSubmit={handleSubmit}
            buttons={buttons}
            links={links}
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
