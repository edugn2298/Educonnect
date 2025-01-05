import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
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
} from "@mui/material";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  searchUsers,
} from "../../services/auth";
import { PropTypes } from "prop-types";

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

  // Fetch followers and following lists on initial load
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

  // Fetch lists based on listType
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
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleUnfollow(friend._id)} // Cambiado a friend._id
        sx={{ ml: 2 }}
      >
        Unfollow
      </Button>
    ) : (
      <Button
        variant="outlined"
        onClick={() => handleFollow(friend._id)} // Cambiado a friend._id
        sx={{ ml: 2 }}
      >
        Follow
      </Button>
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
      setAlert({
        open: true,
        message: error.response.data,
        severity: "error",
      });
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
      setAlert({
        open: true,
        message: error.response.data,
        severity: "error",
      });
    }
  };

  const handleAlertClose = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  const renderListItems = (friendsList) => {
    return friendsList.map((friend) => (
      <ListItem
        key={friend._id}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar
          src={friend.profilePicture}
          alt={friend.fullname}
          sx={{ mr: 2 }}
        />
        <ListItemText primary={friend.fullname} secondary={friend.username} />
        <Button
          variant="contained"
          onClick={() => onProfileView(friend._id)}
          sx={{ ml: 2 }}
        >
          View Profile
        </Button>
        {renderFollowButton(friend)}
      </ListItem>
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
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        {listType === "followers" ? "My Followers" : "My Following"}
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="list-type-label">List Type</InputLabel>
        <Select
          labelId="list-type-label"
          value={listType}
          onChange={(e) => setListType(e.target.value)}
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
        sx={{ mb: 2 }}
      />
      {friendsToRender.length === 0 && !searchQuery && (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
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
          <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
            Global Search Results
          </Typography>
          {searchResults.global.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
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
