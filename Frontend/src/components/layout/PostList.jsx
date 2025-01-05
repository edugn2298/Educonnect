import { Box, CircularProgress, Typography, Button } from "@mui/material";
import Post from "../../components/layout/Post";
import { PropTypes } from "prop-types";

const PostList = ({ posts, loading, hasMore, initialLoad, reloadPosts }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
      {posts.length <= 0 && (
        <Button
          variant="contained"
          onClick={reloadPosts}
          sx={{ my: 2, display: "block", mx: "auto" }}
        >
          Reload Posts
        </Button>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && posts.length === 0 && !initialLoad && (
        <Typography variant="body2" align="center" sx={{ py: 2 }}>
          No posts found.
        </Typography>
      )}
      {!hasMore && posts.length > 0 && (
        <Typography variant="body2" align="center" sx={{ py: 2 }}>
          No more posts
        </Typography>
      )}
    </Box>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  initialLoad: PropTypes.bool.isRequired,
  reloadPosts: PropTypes.func.isRequired,
};

export default PostList;
