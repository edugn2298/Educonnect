import Post from "../models/post.model.js";
import User from "../models/user.model.js";

/**
 * Get all posts
 * @function getAllPosts
 * @async
 * @params {Object} req - The request object
 * @params {Object} res - The response object
 * @query {number} page - The page number
 * @query {number} limit - The number of posts per page
 * @method GET
 * @example http://localhost:3050/posts?page=1&limit=10
 */

export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const post = await Post.paginate(
      { deleted: false },
      {
        page,
        limit,
      }
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get posts by user ID with pagination
 * @function getPostById
 * @async
 * @params {Object} req - The request object
 * @params {Object} res - The response object
 * @method GET
 * @example http://localhost:3050/posts/postbyid?id=USER_ID&page=1&limit=10
 */
export const getPostById = async (req, res) => {
  try {
    const userId = req.query.id; // Obteniendo el id del query string
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const posts = await Post.find({ author: userId, deleted: false })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación, más reciente primero
      .skip(offset)
      .limit(limit)
      .populate("author", "username fullname profilePicture"); // Popula los datos adicionales del autor

    const totalPosts = await Post.countDocuments({
      author: userId,
      deleted: false,
    });

    res.json({
      posts: posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Search posts
 * @function searchPosts
 * @async
 * @params {Object} req - The request object
 * @params {Object} res - The response object
 * @query {string} search - The search query
 * @query {number} page - The page number
 * @query {number} limit - The number of posts per page
 * @method GET
 * @example http://localhost:3050/posts/search?search=hello&page=1&limit=10
 */

export const searchPosts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    if (!search) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const posts = await Post.Paginate(
      { deleted: false, title: { $regex: search, $options: "i" } },
      {
        page,
        limit,
      }
    );
    if (posts.docs.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

/**
 * Create post
 * @function createPost
 * @async
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @method POST
 * @example http://localhost:3050/posts
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The created post
 * @example http://localhost:3050/posts
 */

export const createPost = async (req, res) => {
  const { body, file, user } = req;

  try {
    const post = new Post({
      ...body,
      media: file
        ? `http://localhost:3005/public/images/${file.filename}`
        : undefined,
      user: user._id,
    });
    await post.save();

    await User.findByIdAndUpdate(user._id, { $push: { posts: post._id } });

    res.status(201).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

/**
 * Update post
 * @function updatePost
 * @async
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @method PATCH
 * @example http://localhost:3050/posts/:id
 * @param {*} req
 * @param {*} res
 * @returns {Object} - The updated post
 */

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (file) {
      const mediaUrl = `http://localhost:3005/public/images/${file.filename}`;
      body.media = mediaUrl;
    } else if (file === undefined) {
      post.media = [];
    }

    Object.assign(post, body);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};
/**
 * Delete post
 * @function deletePost
 * @async
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @method Patch
 * @example http://localhost:3050/posts/:id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The deleted post
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true }
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

/**
 * Feed posts
 * @function feedPosts
 * @async
 * @requires - authenticate middleware
 * @method GET
 * @example http://localhost:3005/feed
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The feed posts
 */
export const feedPosts = async (req, res) => {
  console.log(req.query.page);
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId).populate("following");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following.map((follow) => follow._id);
    following.push(userId); // Agregar el ID del usuario actual

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const posts = await Post.find({
      author: { $in: following },
      deleted: false,
    })
      .populate("author") // Incluye la información del autor
      .populate("comments")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          model: "User",
          select: "username fullname profilePicture",
        },
      })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación, más reciente primero
      .skip(offset)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      author: { $in: following },
    });

    res.json({
      posts: posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  console.log(req.params.id);
  console.log(req.user.id);
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
      return res.status(200).json({ success: "Post unliked successfully" });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
      });
      return res.status(200).json({ success: "Post liked successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
