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
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #2e3b55, #243b4d)"
            : "linear-gradient(to right, #4b6cb7, #182848)",
      }}
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
