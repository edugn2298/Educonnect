import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

const ProfilePost = ({ posts, onSave, onDelete }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                boxShadow: 4,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: post.media && post.media.length > 0 ? "0" : "16px",
                backgroundColor:
                  post.media && post.media.length > 0 ? "white" : "#f5f5f5",
              }}
            >
              {post.media && post.media.length > 0 && (
                <Box>
                  {post.media.map((media, idx) => (
                    <CardMedia
                      key={idx}
                      component="img"
                      height="200"
                      image={media}
                      alt="post image"
                      sx={{ objectFit: "cover" }}
                    />
                  ))}
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
                  {post.author.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {post.content}
                </Typography>
              </CardContent>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop:
                    post.media && post.media.length > 0
                      ? "1px solid #e0e0e0"
                      : "none",
                  padding: "8px 16px",
                }}
              >
                <IconButton
                  aria-label="edit"
                  onClick={() => onSave(post)}
                  sx={{ color: "primary.main" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(post._id)}
                  sx={{ color: "error.main" }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

ProfilePost.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      author: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }).isRequired,
      media: PropTypes.arrayOf(PropTypes.string), // Definir media como array de strings
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfilePost;
