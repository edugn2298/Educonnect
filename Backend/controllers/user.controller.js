import User from "../models/user.model.js";

/**
 * Get all users
 * @function getAllUsers
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - All users
 * @pmethod GET
 * @example http://localhost:3050/users/
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user by ID
 * @function getUserById
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - User by ID
 * @pmethod GET
 * @example http://localhost:3050/users/profile/:id
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * update user by ID
 * @function updateUser
 * @async
 * @param {*} req - The request object
 * @param {*} res  - The response object
 * @returns  message
 * @require -  authenticate middlewar and authorize middleware
 * @method PATCH
 * @example http://localhost:3050/users/update/:id
 */
export const updateUser = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const { id } = req.params;
    const updates = req.body;

    // Si se cargó una nueva imagen, actualiza la URL de la foto del perfil
    if (req.file) {
      updates.profilePicture = `http://localhost:3005/public/images/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user || user.deleted) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

/**
 * delete user by ID
 * @function deleteUser
 * @async
 * @param {*} req - The request object
 * @param {*} res  - The response object
 * @returns  message
 * @require -  authenticate middlewar and authorize middleware
 * @method PATCH
 * @example http://localhost:3050/user/:id
 */

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.deleted = true;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 *@description Follows a user
 * @param {@} req - The request object
 * @param {@} req.params.id - The ID of the user to follow
 * @param {*} req.user._id - The ID of the user who is following the other user
 * @returns {Object} - res.json({ message: "User followed successfully" })
 * @returns {Object} - res.status(500).json({ error: "An error occurred while following user" })
 * @require - authenticate middleware and authorize middleware
 * @method POST
 */
export const followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);
    if (!user.following.includes(friend._id)) {
      user.following.push(friend._id);
      friend.followers.push(user._id);
      await user.save();
      await friend.save();
    }
    res.json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while following user" });
  }
};

/**
 *@description Unfollows a user
 * @param {@} req - The request object
 * @param {@} req.params.id - The ID of the user to unfollow
 * @param {*} req.user._id - The ID of the user who is unfollowing the other user
 * @returns {Object} - res.json({ message: "User unfollowed successfully" })
 * @returns {Object} - res.status(500).json({ error: "An error occurred while unfollowing user" })
 * @require - authenticate middleware and authorize middleware
 * @method POST
 */
export const unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);
    user.following.pull(friend._id);
    friend.followers.pull(user._id);
    await user.save();
    await friend.save();
    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while unfollowing user" });
  }
};

/**
 * Retrieves the followers of a user.
 * @function getFollowers
 * @async
 * @param {Object} req - The request object
 * @param {string} req.params.id - The ID of the user whose followers are to be retrieved
 * @param {Object} res - The response object
 * @method GET
 * @returns {Object} - A list of followers
 * @requires - authenticate middleware
 * @example http://localhost:3050/users/:userId/followers
 */
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.followers.length === 0) {
      return res.status(404).json({ error: "No followers found" });
    }

    res.json(user.followers);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting followers" });
  }
};

/**
 * Retrieves the users that a user is following.
 * @function getFollowing
 * @async
 * @param {Object} req - The request object
 * @param {string} req.params.id - The ID of the user whose following are to be retrieved
 * @param {Object} res - The response object
 * @method GET
 * @returns {Object} - A list of the users that the user is following
 * @requires - authenticate middleware
 * @example http://localhost:3050/users/:userId/following
 */
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.following.length === 0) {
      return res.status(404).json({ error: "No following found" });
    }

    res.json(user.following);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while getting following" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId).populate("followers");
    const friends = user.followers;

    const friendsSearchResults = friends.filter(
      (friend) =>
        friend.fullname.toLowerCase().includes(query.toLowerCase()) ||
        friend.username.toLowerCase().includes(query.toLowerCase())
    );

    const globalSearchResults = await User.find({
      $or: [
        { fullname: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: userId },
    }).limit(10);

    res.json({
      friends: friendsSearchResults,
      global: globalSearchResults,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching users" });
  }
};
