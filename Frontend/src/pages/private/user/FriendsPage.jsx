import { Box } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import FriendsList from "../../../components/layout/FriendsList";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FriendsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const handleProfileView = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Box
      sx={{ width: "100vw", minHeight: "100vh", display: "flex" }}
      className="bg-gradient-to-r from-indigo-400 to-cyan-400 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700"
    >
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          p: 4,
        }}
      >
        <FriendsList
          currentUser={currentUser}
          onProfileView={handleProfileView}
        />
      </Box>
    </Box>
  );
};

export default FriendsPage;
