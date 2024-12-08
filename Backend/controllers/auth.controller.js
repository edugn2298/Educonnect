import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 *Creates a new user
 *@function createUser
 *@returns {Promise<void>}
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 *@returns {Obeject} - User and token or  Message
 *@method POST
 *@example http://localhost:3050/auth/user/register
 */
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .send({ error: "Username or email already in use." });
    }
    const user = new User({ username, email, password, role });
    user.password = bcrypt.hashSync(user.password, 8);
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
/**
 *Logs in a user
 *@function loginUser
 *@returns {Promise<void>}
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 *@returns {Obeject} - User and token or  Message
 *@method POST
 *@example http://localhost:3050/user/loginUser
 */
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: req.body.emailOrUsername },
        { username: req.body.emailOrUsername },
      ],
    });
    console.log("User Found:", user);
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Invalid email or password" });
  }
};

/**
 * Logs out a user
 * @function logOutUser
 */

export const logOutUser = async (req, res) => {
  try {
    res.status(200).send({ message: "User logged out successfully." });
  } catch (error) {
    res.status(400).send(error);
  }
};
