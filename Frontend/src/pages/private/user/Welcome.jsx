import Sidebar from "../../../components/layout/Sidebar";
import ProfileCard from "../../../components/layout/ProfileCard";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const Welcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleContinue = () => {
    localStorage.setItem("welcomeShow", "true");
    navigate("/profile");
  };

  return (
    <div className="w-screen h-screen flex bg-gradient-to-r from-indigo-400 to-cyan-400 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700">
      <Sidebar />
      <div className="w-full h-full flex flex-col p-4">
        <ProfileCard user={currentUser} editable={false} />
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mt-4">
          Welcome, {currentUser.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You are currently logged in as {currentUser.email}.
        </p>
        <Button
          variant="contained"
          color="primary"
          className="mt-4"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
