import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import ProfileCard from "../../../components/layout/ProfileCard";
import ProfilePost from "../../../components/layout/ProfilePost";
import EditPostsModal from "../../../components/layout/EditPostsModal";
import { Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import {
  getPosts,
  deletePost,
  updatePost,
} from "../../../services/PostRequest";
import { getUser } from "../../../services/auth";

export const ProfilePage = () => {
  const { currentUser, setCurrentUser, Logout } = useAuth();
  const { userId } = useParams(); // Obtén el ID del usuario desde la URL
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userDetailsError, setUserDetailsError] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const hasFetchedUserDetails = useRef(false);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await getUser(userId || currentUser._id);
      console.log(currentUser);
      setUserDetails(response.data);
      if (userId === currentUser._id) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      setUserDetailsError(error);
    }
  }, [userId, currentUser, setCurrentUser]);

  const fetchPosts = useCallback(
    async (page = 1) => {
      try {
        const response = await getPosts(userId || currentUser._id, page);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setPostsError(error);
      } finally {
        setLoading(false);
      }
    },
    [userId, currentUser._id]
  );

  useEffect(() => {
    setLoading(true);
    if (!hasFetchedUserDetails.current) {
      fetchUserDetails();
      hasFetchedUserDetails.current = true;
    }
    fetchPosts(currentPage);
  }, [userId, currentPage, fetchUserDetails, fetchPosts]);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      fetchPosts(currentPage);
      setSnackbarMessage("Post eliminado con éxito!");
      setSnackbarSeverity("success");
    } catch (error) {
      setPostsError(error);
      setSnackbarMessage("Error al eliminar el post.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleEditPost = async (postId, formData) => {
    try {
      const response = await updatePost(postId, formData);
      if (response.ok) {
        fetchPosts(currentPage);
      }
    } catch (error) {
      setPostsError(error);
      setSnackbarMessage("Error al editar el post.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCommentPost = async (postId, comment) => {
    // Funcionalidad no implementada
  };

  const handlePageChange = (newPage) => {
    setLoading(true);
    setCurrentPage(newPage);
  };

  const handleEditClick = (post) => {
    if (post && typeof post === "object") {
      setSelectedPost(post);
      setEditModalOpen(true);
    } else {
      console.error("Selected post is not an object");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedPost(null);
  };

  const isCurrentUser = userDetails && userDetails._id === currentUser._id;

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
          p: 4,
        }}
      >
        <ProfileCard user={userDetails || currentUser} />
        {loading && <Typography>Loading...</Typography>}
        {userDetailsError && (
          <Typography>
            Error: {userDetailsError.message || "Error fetching user details"}
          </Typography>
        )}
        {postsError && (
          <Typography>
            Error: {postsError.message || "Error fetching posts"}
          </Typography>
        )}
        {posts && posts.length > 0 ? (
          <ProfilePost
            posts={posts}
            onSave={handleEditClick}
            onDelete={handleDeletePost}
            onComment={handleCommentPost}
          />
        ) : (
          !loading &&
          !postsError && <Typography>No posts to display.</Typography>
        )}
        <Box display="flex" justifyContent="center" m={4} sx={{ gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
        {isCurrentUser && (
          <Box display="flex" justifyContent="flex-end" m={4} sx={{ gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/edit-profile/${currentUser._id}`}
            >
              Edit Profile
            </Button>
            <Button variant="contained" color="primary">
              Change Password
            </Button>
            <Button variant="contained" color="primary" onClick={Logout}>
              Log Out
            </Button>
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        {selectedPost && (
          <EditPostsModal
            open={editModalOpen}
            handleClose={handleEditModalClose}
            post={selectedPost}
            handleEdit={handleEditPost}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
