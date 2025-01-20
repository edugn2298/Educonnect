import { useLocation } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Share } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";

const ProfileCard = ({ user }) => {
  const location = useLocation();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleShare = () => {
    const userProfileLink = `${window.location.origin}/profile/${user._id}`;
    navigator.clipboard.writeText(userProfileLink);
    setSnackbarMessage("Link copiado al portapapeles");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        p: 4,
        borderRadius: 2,
        bgcolor: "background.default",
        mb: 6,
        width: "100%",
      }}
    >
      {/* Parte Izquierda */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: { xs: 4, lg: 0 },
        }}
      >
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          sx={{ width: 96, height: 96 }}
        />
        <Typography
          variant="h6"
          sx={{ mt: 2, textAlign: "center", color: theme.palette.text.primary }}
        >
          {user.username}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            textAlign: "center",
            color: theme.palette.text.secondary,
          }}
        >
          {user.fullname}
        </Typography>
      </Box>

      {/* Parte Central */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              {user.posts ? user.posts.length : 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Posts
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ height: 64, mx: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              {user.followers ? user.followers.length : 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Followers
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ height: 64, mx: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              {user.following ? user.following.length : 0}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Following
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Parte Derecha */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "center",
          mt: { xs: 4, lg: 0 },
        }}
      >
        <Button
          variant="contained"
          startIcon={<Share />}
          sx={{
            bgcolor: "grey.600",
            "&:hover": { bgcolor: "grey.700" },
            mb: { xs: 2, lg: 0 },
            mr: { lg: 2 },
          }}
          onClick={handleShare}
        >
          Share
        </Button>
        {user._id === currentUser._id && (
          <Link to="/edit-profile">
            <Button variant="contained" color="secondary">
              Edit Profile
            </Button>
          </Link>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileCard;
