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
 *@example http://localhost:3050/user/createUser
 */
export const createUser = async (req, res) => {
  const user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 8);
  try {
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const user = await User.findOne({ email: req.body.email });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: "Invalid email or password" });
  }
};
