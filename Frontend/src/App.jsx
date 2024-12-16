import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
//port PrivateRoute from "./routes/PrivateRoute";
//port PublicRoute from "./routes/PublicRoute";
//port RoleBasedRoute from "./routes/RoleBasedRoute";
import LoginPage from "./pages/public/Login";
import RegisterPage from "./pages/public/Register";

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
