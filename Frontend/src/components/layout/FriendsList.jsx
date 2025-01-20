import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemText,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  searchUsers,
} from "../../services/auth";
import { PropTypes } from "prop-types";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useTheme } from "@mui/material/styles";

const FriendsList = ({ currentUser, onProfileView }) => {
  const [listType, setListType] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [searchResults, setSearchResults] = useState({
    friends: [],
    global: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const followersResponse = await getFollowers(currentUser._id);
        const followingResponse = await getFollowing(currentUser._id);
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
      } catch (error) {
        setAlert({
          open: true,
          message: error.response.data,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [currentUser._id]);

  useEffect(() => {
    const fetchListsBasedOnType = async () => {
      setLoading(true);
      try {
        const followersResponse = await getFollowers(currentUser._id);
        const followingResponse = await getFollowing(currentUser._id);
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
      } catch (error) {
        setAlert({
          open: true,
          message: error.response.data,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListsBasedOnType();
  }, [listType, currentUser._id]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await searchUsers(query);
        setSearchResults(response.data);
      } catch (error) {
        setAlert({
          open: true,
          message: error.response.data,
          severity: "error",
        });
      }
    } else {
      setSearchResults({ friends: [], global: [] });
    }
  };

  const renderFollowButton = (friend) => {
    const isFollowing = following.some((f) => f._id === friend._id);
    return isFollowing ? (
      <IconButton color="error" onClick={() => handleUnfollow(friend._id)}>
        <PersonRemoveIcon />
      </IconButton>
    ) : (
      <IconButton color="primary" onClick={() => handleFollow(friend._id)}>
        <PersonAddIcon />
      </IconButton>
    );
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(currentUser._id, userId);
      setAlert({
        open: true,
        message: "User followed successfully",
        severity: "success",
      });
      const updatedFollowing = await getFollowing(currentUser._id);
      setFollowing(updatedFollowing.data);
      const updatedFollowers = await getFollowers(currentUser._id);
      setFollowers(updatedFollowers.data);
    } catch (error) {
      setAlert({ open: true, message: error.response.data, severity: "error" });
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(currentUser._id, userId);
      setAlert({
        open: true,
        message: "User unfollowed successfully",
        severity: "success",
      });
      const updatedFollowing = await getFollowing(currentUser._id);
      setFollowing(updatedFollowing.data);
      const updatedFollowers = await getFollowers(currentUser._id);
      setFollowers(updatedFollowers.data);
    } catch (error) {
      setAlert({ open: true, message: error.response.data, severity: "error" });
    }
  };

  const handleAlertClose = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  const handleNavigate = (id) => {
    navigate(`/profile/${id}`);
  };

  const renderListItems = (friendsList) => {
    return friendsList.map((friend) => (
      <Paper
        key={friend._id}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          mb: 1,
          bgcolor: theme.palette.background.default,
          borderRadius: 2,
          boxShadow: 1,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 3,
            transform: "scale(1.02)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleNavigate(friend._id)}
        >
          <Avatar
            src={friend.profilePicture}
            alt={friend.fullname}
            sx={{ mr: 2 }}
          />
          <ListItemText
            primary={<Typography variant="body1">{friend.fullname}</Typography>}
            secondary={
              <Typography
                variant="body2"
                color="textSecondary"
              >{`@${friend.username}`}</Typography>
            }
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => onProfileView(friend._id)}
            sx={{ mr: 1 }}
          >
            View
          </Button>
          {renderFollowButton(friend)}
        </Box>
      </Paper>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const friendsToRender = listType === "followers" ? followers : following;

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, textAlign: "center", color: theme.palette.text.primary }}
      >
        {listType === "followers" ? "My Followers" : "My Following"}
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="list-type-label">List Type</InputLabel>
        <Select
          labelId="list-type-label"
          value={listType}
          onChange={(e) => setListType(e.target.value)}
          sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1 }}
        >
          <MenuItem value="followers">Followers</MenuItem>
          <MenuItem value="following">Following</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        placeholder="Search friends or users..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ mb: 2, bgcolor: theme.palette.background.paper, borderRadius: 1 }}
        InputProps={{
          sx: { color: theme.palette.text.primary },
        }}
      />
      {friendsToRender.length === 0 && !searchQuery && (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            mt: 4,
            color: theme.palette.text.secondary,
          }}
        >
          You don&apos;t have any {listType} yet.
        </Typography>
      )}
      <List>
        {searchQuery
          ? renderListItems(searchResults.friends)
          : renderListItems(friendsToRender)}
      </List>
      {searchQuery && (
        <>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              textAlign: "center",
              color: theme.palette.text.primary,
            }}
          >
            Global Search Results
          </Typography>
          {searchResults.global.length === 0 ? (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                mt: 2,
                color: theme.palette.text.secondary,
              }}
            >
              No users found.
            </Typography>
          ) : (
            <List>{renderListItems(searchResults.global)}</List>
          )}
        </>
      )}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

FriendsList.propTypes = {
  onProfileView: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default FriendsList;
