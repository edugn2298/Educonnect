import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Divider,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const ProfilePost = ({ posts, onSave, onDelete }) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [comments, setComments] = useState({});

  const handleCommentChange = (e, postId) => {
    setComments({
      ...comments,
      [postId]: e.target.value,
    });
  };

  const handleCommentSubmit = (postId) => {
    setComments({
      ...comments,
      [postId]: "",
    });
  };

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} lg={4} key={post._id}>
          <Card
            sx={{
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              boxShadow: 3,
              borderRadius: "16px",
              bgcolor: theme.palette.background.paper,
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
              }}
            >
              <Avatar
                src={post.author.profilePicture}
                alt={`${post.author.username}'s profile picture`}
                sx={{ width: 40, height: 40, marginRight: 2 }}
              />
              <Box>
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
                sx={{ borderRadius: "16px 16px 0 0", maxHeight: 300 }}
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
                  aria-label="add to favorites"
                  sx={{ color: theme.palette.error.main }}
                >
                  <FavoriteIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {post.likes} likes
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="comment"
                  sx={{ color: theme.palette.primary.main }}
                >
                  <CommentIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {post.comments.length} comments
                </Typography>
              </Box>
            </CardContent>
            {currentUser._id === post.author._id && (
              <>
                <Divider />
                <CardContent
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => onSave(post)}
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(post._id)}
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </>
            )}
            <Divider />
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                value={comments[post._id] || ""}
                onChange={(e) => handleCommentChange(e, post._id)}
                sx={{ bgcolor: theme.palette.background.paper }}
              />
              <IconButton
                color="primary"
                aria-label="send"
                onClick={() => handleCommentSubmit(post._id)}
              >
                <SendIcon />
              </IconButton>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

ProfilePost.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfilePost;
