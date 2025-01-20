import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  ListItem,
  TextField,
  Divider,
  List,
  ListItemText,
  Menu,
  MenuItem,
  Collapse,
  CircularProgress,
  Button,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Post = ({
  posts,
  lastPostElementRef,
  handleCommentSubmit,
  postingComments,
  currentUser,
  handleEditCommentFeed,
  handleDeleteCommentFeed,
  handleLikeFeed,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const handleProfileRedirect = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleLike = async (postId) => {
    try {
      await handleLikeFeed(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
    // Implement the logic to like the post here
  };

  const toggleComments = (postId) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };

  const handleInputChange = (postId, value) => {
    setNewComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleEditComment = async () => {
    if (!editingContent.trim() || !selectedComment) return;

    setLoadingAction(true);
    console.log(
      "Editing comment:",
      selectedComment._id,
      "with content:",
      editingContent
    );
    try {
      await handleEditCommentFeed(selectedComment._id, editingContent);
    } catch (error) {
      console.error("Error editing comment:", error);
    } finally {
      setLoadingAction(false);
      setEditingCommentId(null);
      handleCloseMenu(); // Close the menu after editing
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    console.log("Deleting comment:", selectedComment._id);
    setLoadingAction(true);
    try {
      await handleDeleteCommentFeed(selectedComment._id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setLoadingAction(false);
      handleCloseMenu(); // Close the menu after deleting
    }
  };

  const handleSendComment = async (postId) => {
    if (!newComments[postId]?.trim()) return; // Empty comment, do nothing

    try {
      await handleCommentSubmit({
        postId,
        content: newComments[postId],
      });
      setNewComments((prevComments) => ({
        ...prevComments,
        [postId]: "", // Clear the comment input for the specific post
      }));
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleOpenMenu = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  return posts.map((post, index) => (
    <ListItem
      key={post._id}
      ref={posts.length === index + 1 ? lastPostElementRef : null}
      sx={{ mb: 3 }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: 3,
          borderRadius: "16px",
          bgcolor: "background.default",
        }}
      >
        <CardContent
          sx={{ display: "flex", alignItems: "center", padding: "10px 16px" }}
        >
          <Avatar
            src={post.author.profilePicture}
            alt={`${post.author.username}'s profile picture`}
            sx={{ width: 56, height: 56, marginRight: 2, cursor: "pointer" }}
            onClick={() => handleProfileRedirect(post.author._id)}
          />
          <Box
            onClick={() => handleProfileRedirect(post.author._id)}
            sx={{ cursor: "pointer" }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
            >
              {post.author.username}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              @{post.author.username} ·{" "}
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        {post.media.length > 0 && (
          <CardMedia
            component="img"
            height="400"
            image={post.media[0]}
            alt="post image"
            sx={{ borderRadius: "16px 16px 0 0" }}
          />
        )}
        <CardContent>
          <Typography
            variant="body2"
            sx={{ marginTop: 1, color: theme.palette.text.secondary }}
          >
            {post.content}
          </Typography>
        </CardContent>
        <Divider />
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="like"
              sx={{
                color: post.likes.includes(currentUser._id)
                  ? "red"
                  : theme.palette.primary.main,
              }}
              onClick={() => handleLike(post._id)}
            >
              <FavoriteIcon />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {post.likes.length} Likes
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="comment"
              sx={{ color: theme.palette.primary.main }}
              onClick={() => toggleComments(post._id)}
            >
              <CommentIcon />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {post.comments.length} Comments
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <Collapse in={expandedPostId === post._id} timeout="auto" unmountOnExit>
          <CardContent sx={{ maxHeight: 200, overflowY: "auto" }}>
            <List>
              {post.comments.map((comment) => (
                <Box
                  component={ListItem}
                  disablePadding
                  key={comment._id}
                  sx={{ py: 1 }}
                >
                  <Avatar
                    src={comment.author.profilePicture}
                    alt={comment.author.username}
                    sx={{ width: 24, height: 24, marginRight: 1 }}
                  />
                  <ListItemText
                    primary={`${comment.author.username}`}
                    secondary={`${comment.content}`}
                  />
                  {(currentUser.role === "premium" ||
                    currentUser.role === "enterprise" ||
                    comment.author._id === currentUser._id) && (
                    <IconButton
                      aria-label="more"
                      sx={{ color: theme.palette.text.secondary }}
                      onClick={(e) => handleOpenMenu(e, comment)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </List>
          </CardContent>
        </Collapse>
        <Divider />
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Write a comment..."
            fullWidth
            value={newComments[post._id] || ""}
            onChange={(e) => handleInputChange(post._id, e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                color: "text.primary",
              },
            }}
            InputProps={{
              sx: {
                color: "text.primary",
              },
            }}
          />
          <IconButton
            aria-label="send"
            sx={{ color: theme.palette.primary.main, ml: 1 }}
            onClick={() => handleSendComment(post._id)}
            disabled={postingComments[post._id]}
          >
            <SendIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {editingCommentId === selectedComment?._id ? (
              <>
                <TextField
                  fullWidth
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <Button onClick={handleEditComment} disabled={loadingAction}>
                  {loadingAction ? <CircularProgress size={24} /> : "Save"}
                </Button>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => setEditingCommentId(selectedComment?._id)}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
              </>
            )}
          </Menu>
        </CardContent>
      </Card>
    </ListItem>
  ));
};

Post.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastPostElementRef: PropTypes.func,
  handleCommentSubmit: PropTypes.func.isRequired,
  postingComments: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  handleEditCommentFeed: PropTypes.func.isRequired,
  handleDeleteCommentFeed: PropTypes.func.isRequired,
  handleLikeFeed: PropTypes.func.isRequired,
};

export default Post;
