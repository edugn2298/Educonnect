import { useState, useEffect, useCallback, useRef } from "react";
import { Box, Snackbar, Alert, List, CircularProgress } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import PostCreator from "../../../components/layout/PostCreator";
import Post from "../../../components/layout/Post";
import { feedPosts, likePost } from "../../../services/PostRequest";
import { useAuth } from "../../../context/AuthContext";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../../services/commentRequest";

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
  const [postingComments, setPostingComments] = useState({});

  const handleLikeFeed = async (postId) => {
    try {
      const response = await likePost(postId);
      if (response) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.includes(currentUser._id)
                    ? (setAlert({
                        open: true,
                        message: "Post unliked successfully",
                        severity: "success",
                      }),
                      post.likes.filter((id) => id !== currentUser._id))
                    : (setAlert({
                        open: true,
                        message: "Post liked successfully",
                        severity: "success",
                      }),
                      [...post.likes, currentUser._id]),
                }
              : post
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCommentFeed = async (selectedComment, editingContent) => {
    console.log(selectedComment, editingContent);
    try {
      const response = await updateComment(selectedComment, editingContent);
      console.log(response);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === selectedComment.post
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === selectedComment._id
                    ? { ...comment, content: editingContent }
                    : comment
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteCommentFeed = async (comment) => {
    console.log(comment);
    try {
      const response = await deleteComment(comment);
      console.log(response);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === comment.post
            ? {
                ...post,
                comments: post.comments.filter((c) => c._id !== comment._id),
              }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (comment) => {
    console.log("Comment submitted:", comment);
    comment["user"] = currentUser._id;
    console.log("Comment with user:", comment);
    setPostingComments((prev) => ({ ...prev, [comment.postId]: true }));
    try {
      const response = await createComment(comment);
      console.log(response.data.comment);
      const commentComplete = response.data.comment;
      commentComplete["author"] = currentUser;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === comment.postId
            ? { ...post, comments: [response.data.comment, ...post.comments] }
            : post
        )
      );
      setAlert({
        open: true,
        message: "Comment created successfully",
        severity: "success",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setPostingComments((prev) => ({ ...prev, [comment.postId]: false }));
    }
  };

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
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #2e3b55, #243b4d)"
            : "linear-gradient(to right, #4b6cb7, #182848)",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
          p: 4,
        }}
      >
        <PostCreator onSubmit={handlePostSubmit} />

        <List
          sx={{ width: "100%", maxWidth: 600, mx: "auto", overflowX: "hidden" }}
        >
          <Post
            posts={posts}
            lastPostElementRef={lastPostElementRef}
            handleCommentSubmit={handleCommentSubmit}
            postingComments={postingComments}
            currentUser={currentUser}
            handleEditCommentFeed={handleEditCommentFeed}
            handleDeleteCommentFeed={handleDeleteCommentFeed}
            handleLikeFeed={handleLikeFeed}
          />
        </List>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
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
