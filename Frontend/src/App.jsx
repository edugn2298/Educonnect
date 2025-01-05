import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/public/Login";
import RegisterPage from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword.jsx";
import ProfilePage from "./pages/private/user/ProfilePage.jsx";
import EditProfile from "./pages/private/user/EditProfile.jsx";
import FeddPage from "./pages/private/user/FeedPage.jsx";
import Welcome from "./pages/private/user/Welcome.jsx";
import CheckEmail from "./pages/public/CheckEmail.jsx";
import Friends from "./pages/private/user/FriendsPage.jsx";
import ChatPage from "./pages/private/user/ChatPage.jsx";

export const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute requireAuth={false} />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>
            <Route path="/check-email" element={<CheckEmail />} />
            <Route element={<ProtectedRoute requireAuth={true} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/feed" element={<FeddPage />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/messages" element={<ChatPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
