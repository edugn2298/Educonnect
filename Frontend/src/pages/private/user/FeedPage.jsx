import { useState, useEffect, useCallback, useRef } from "react";
import { Box, Snackbar, Alert, List } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import PostCreator from "../../../components/layout/PostCreator";
import Post from "../../../components/layout/Post";
import { feedPosts } from "../../../services/PostRequest";
import { useAuth } from "../../../context/AuthContext";

const FeedPage = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const hasMore = useRef(true);
  const observer = useRef();
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const LoadMorePost = useCallback(async () => {
    setLoading(true);
    const newPosts = await feedPosts(currentUser._id, page);
    console.log(newPosts);
    if (newPosts.data.posts.length === 0) {
      hasMore.current = false;
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts.data.posts]);
    }

    setLoading(false);
  }, [currentUser._id, page]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore.current) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore.current) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (hasMore.current) {
      LoadMorePost();
    }
  }, [hasMore, LoadMorePost]);

  const handlePostSubmit = (success, message) => {
    setAlert({
      open: true,
      message,
      severity: success ? "success" : "error",
    });
  };

  const handleAlertClose = () => {
    setAlert({
      open: false,
      message: "",
      severity: "success",
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
      }}
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
          p: 2,
        }}
      >
        <PostCreator onSubmit={handlePostSubmit} />

        <List sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
          <Post posts={posts} lastPostElementRef={lastPostElementRef} />
        </List>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default FeedPage;
