import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { config } from "dotenv";
config({ path: "./config/.env" });

/**
 *@description creates a new user
 *@function createUser
 *@returns {Promise<void>}
 *@param {Object} req - The request object
 *@param {string} req.body.username - The username of the user
 *@param {string} req.body.email - The email of the user
 *@param {string} req.body.password - The password of the user
 *@param {string} req.body.role - The role of the user (user or admin)
 *@param {Object} res - The response object
 *@returns {Obeject} - User and token or  Message
 *@method POST
 *@example http://localhost:3050/auth/user/register
 */
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log(req.body);
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
 *@description Logs in a user
 *@function loginUser
 *@returns {Promise<void>}
 *@param {Object} req - The request object
 * @param {string} req.body.emailOrUsername - The email or username of the user
 * @param {string} req.body.password - The password of the user
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
 * @description Logs out a user
 * @function logOutUser
 * @returns {Promise<void>}
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - Message
 * @method POST
 * @example http://localhost:3050/user/logout
 */

export const logOutUser = async (req, res) => {
  try {
    res.status(200).send({ message: "User logged out successfully." });
  } catch (error) {
    res.status(400).send(error);
  }
};

/**
 * @description Transports an email
 * @function transport
 * This function contains access to send mails
 */
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Crear un token de restablecimiento de contraseña
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    // Enviar correo electrónico
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.

      Please click on the following link, or paste this into your browser to complete the process:

      ${resetUrl}

      If you did not request this, please ignore this email and your password will remain unchanged.
      `,
    };

    await transport.sendMail(mailOptions);

    res.status(200).send({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .send({ error: "Password reset token is invalid or has expired" });
    }

    user.password = bcrypt.hashSync(req.body.password, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).send({ message: "Password has been reset" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
