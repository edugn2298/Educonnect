import { useLocation } from "react-router-dom";
import { Box, Avatar, Typography, Button, Divider } from "@mui/material";
import { Share } from "@mui/icons-material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  const location = useLocation();

  return (
    <Box className="flex flex-col md:flex-row justify-between items-center p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800 mb-6">
      {/* Parte Izquierda */}
      <Box className="flex flex-col items-center mb-4 md:mb-0">
        <Avatar
          src={user.profilePicture}
          alt={user.name}
          className="w-24 h-24"
        />
        <Typography
          variant="h6"
          className="mt-2 text-center text-black dark:text-white"
        >
          {user.username}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className="mt-1 text-center text-black dark:text-white"
        >
          {user.fullname}
        </Typography>
      </Box>

      {/* Parte Central */}
      <Box className="flex flex-col items-center mb-4 md:mb-0">
        <Box className="flex items-center">
          <Box className="flex flex-col items-center mx-4">
            <Typography variant="h6" className="text-black dark:text-white">
              {user.posts.length}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-black dark:text-white"
            >
              Posts
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            className="h-16 mx-2 dark:bg-gray-700"
          />
          <Box className="flex flex-col items-center mx-4">
            <Typography variant="h6" className="text-black dark:text-white">
              {user.followers.length}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-black dark:text-white"
            >
              Followers
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            className="h-16 mx-2 dark:bg-gray-700"
          />
          <Box className="flex flex-col items-center mx-4">
            <Typography variant="h6" className="text-black dark:text-white">
              {user.following.length}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="text-black dark:text-white"
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
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          startIcon={<Share />}
          className="bg-gray-600 hover:bg-gray-700"
          sx={{
            marginBottom: { xs: 2, md: 0 },
            marginRight: { md: 2 },
          }}
        >
          Share
        </Button>
        {location.pathname === "/edit-profile" ? (
          <Link to="/profile">
            <Button variant="contained" color="secondary">
              View Profile
            </Button>
          </Link>
        ) : (
          <Link to="/edit-profile">
            <Button variant="contained" color="secondary">
              Edit Profile
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

ProfileCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileCard;
