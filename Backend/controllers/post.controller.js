import Post from "../models/post.model.js";

export const prueba = async (req, res) => {
  try {
    res.json({ message: "Hola mundo" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
 * Get post by ID
 * @function getPostById
 * @async
 * @params {Object} req - The request object
 * @params {Object} res - The response object
 * @method GET
 * @example http://localhost:3050/posts/:id
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id, deleted: false });
    if (post) {
      res.status(200).json(post);
    }
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  try {
    if (req.file) {
      req.body.image = `http://localhost:3005/${req.file.filename}`; // Asegúrate de usar path.resolve para definir la ruta correcta
    }
    console.log(req.body);
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
    return res.json({ error: error.message });
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
  try {
    if (req.file) {
      req.body.image = `http://localhost:3050/${req.file.filename}`; // Asegúrate de usar path.resolve para definir la ruta correcta
    }
    const post_image = await Post.findById(req.params.id);
    if (post_image) {
      if (post_image.image) {
        req.body.image = post_image.image;
      }
    }
    const post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
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

//En construccion
export const feed = async (req, res) => {
  const userId = req.user._id; // Suponiendo que el ID del usuario está disponible en req.user
  const user = await User.findById(userId).populate("following");
  const following = user.following.map((follow) => follow._id);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const posts = await Post.find({ author: { $in: following } })
    .sort({ createdAt: -1 }) // Ordenar por fecha de creación, más reciente primero
    .skip(offset)
    .limit(limit);

  const totalPosts = await Post.countDocuments({ author: { $in: following } });

  res.json({
    posts: posts,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: page,
  });
};
//En construccion
