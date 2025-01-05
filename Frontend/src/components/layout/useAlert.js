import { useState } from "react";

const useAlert = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (success, message) => {
    setAlert({ open: true, message, severity: success ? "success" : "error" });
  };

  const closeAlert = () => {
    setAlert({ open: false, message: "", severity: "success" });
  };

  return { alert, showAlert, closeAlert };
};

export default useAlert;
