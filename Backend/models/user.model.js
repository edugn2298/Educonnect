import mongoose from "mongoose";

/**
 * Schema for user
 * @type {Schema}
 * @typedef {Object} userSchema
 * @category Models
 * @module User
 * @requires mongoose
 * @requires mongoose.Schema
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} role - The role of the user.
 * @property {boolean} deleted - The deleted status of the user.
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "teacher"],
    default: "user",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

/**
 * Model for user
 * @type {Model}
 * @category Models
 */
const User = mongoose.model("User", userSchema);
export default User;
