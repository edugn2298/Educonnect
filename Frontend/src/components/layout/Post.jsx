import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  ListItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import PropTypes from "prop-types";

const Post = ({ posts, lastPostElementRef }) => {
  console.log(posts);

  const cardStyle = {
    width: "100%", // Asegurar que el ancho del Card sea el mismo para todos los posts
    maxWidth: "600px", // Define un ancho máximo uniforme
    margin: "0 auto", // Centrar el Card
    mb: 3,
  };

  return posts.map((post, index) => (
    <ListItem
      key={post._id}
      ref={posts.length === index + 1 ? lastPostElementRef : null}
      sx={{ mb: 3 }}
    >
      <Card sx={cardStyle}>
        <CardContent
          sx={{ display: "flex", alignItems: "center", padding: "10px" }}
        >
          <Avatar
            src={post.author.profilePicture}
            alt={`${post.author.username}'s profile picture`}
            sx={{ width: 40, height: 40, marginRight: 2 }}
          />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {post.author.username}
          </Typography>
        </CardContent>
        {post.media.length > 0 ? (
          <CardMedia
            component="img"
            height="400"
            image={post.media[0]} // Utiliza la primera imagen si existe
            alt="post image"
          />
        ) : (
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: 1 }}
            >
              {post.content}
            </Typography>
          </CardContent>
        )}
        {post.media.length > 0 && (
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: 1 }}
            >
              {post.content}
            </Typography>
          </CardContent>
        )}
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <Typography variant="body2">{post.likes} likes</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton aria-label="comment">
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">
              {post.comments.length} comments
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </ListItem>
  ));
};

Post.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Post;
