import Sidebar from "../../../components/layout/Sidebar";
import ProfileCard from "../../../components/layout/ProfileCard";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

export const Welcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  console.log("Ingresando a WElcome", currentUser);
  const handleContinue = () => {
    navigate(`/profile/${currentUser._id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #2e3b55, #243b4d)"
            : "linear-gradient(to right, #4b6cb7, #182848)",
      }}
    >
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 4 }}>
        <ProfileCard user={currentUser} editable={false} />
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: (theme) => theme.palette.text.primary,
            mt: 4,
          }}
        >
          Welcome, {currentUser.username}!
        </Typography>
        <Typography sx={{ color: (theme) => theme.palette.text.secondary }}>
          You are currently logged in as {currentUser.email}.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default Welcome;
