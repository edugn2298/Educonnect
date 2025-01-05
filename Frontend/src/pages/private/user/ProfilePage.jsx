import { useState, useEffect, useRef, useCallback } from "react";
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
  const { currentUser, setCurrentUser } = useAuth();
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
      const response = await getUser(currentUser._id);
      console.log(currentUser);
      setUserDetails(response.data);
      setCurrentUser(response.data);
    } catch (error) {
      setUserDetailsError(error);
    }
  }, [currentUser, setCurrentUser]);

  const fetchPosts = useCallback(
    async (page = 1) => {
      try {
        const response = await getPosts(currentUser._id, page);
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setPostsError(error);
      } finally {
        setLoading(false);
      }
    },
    [currentUser._id]
  );

  useEffect(() => {
    if (!hasFetchedUserDetails.current && currentUser) {
      setLoading(true);
      fetchUserDetails();
      fetchPosts(currentPage);
      hasFetchedUserDetails.current = true;
    }
  }, [currentUser, fetchUserDetails, fetchPosts, currentPage]);

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
        /*setSnackbarMessage("Post editado con éxito!");
        setSnackbarSeverity("success");*/
      }
    } catch (error) {
      setPostsError(error);
      setSnackbarMessage("Error al editar el post.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
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
        {posts.length > 0 ? (
          <ProfilePost
            posts={posts}
            onSave={handleEditClick}
            onDelete={handleDeletePost}
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
        <Box display="flex" justifyContent="flex-end" m={4} sx={{ gap: 1 }}>
          <Button variant="contained" color="primary">
            Change Password
          </Button>
          <Button variant="contained" color="primary">
            Log Out
          </Button>
        </Box>
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
