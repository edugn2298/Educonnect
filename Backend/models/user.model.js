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

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      validate: /^[a-zA-Z0-9 ]+$/,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      validate: /^[a-zA-Z0-9_ ]+$/,
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [150, "Bio must be less than 150 characters"],
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
/**
 * Model for user
 * @type {Model}
 * @category Models
 */
const User = mongoose.model("User", userSchema);
export default User;
