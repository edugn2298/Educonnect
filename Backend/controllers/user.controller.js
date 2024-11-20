import e from "express";
import User from "../models/user.model.js";
import mongoosePaginate from "mongoose-paginate-v2";

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
  try {
    const { id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta
    const updates = req.body; // Obtener los datos de actualización del cuerpo de la solicitud
    // Encontrar al usuario por ID y actualizarlo con los nuevos datos
    const user = await User.findByIdAndUpdate(id, updates);
    if (!user || user.deleted) {
      return res.status(404).send({ error: "User not found" });
    } else {
      await user.save();
      res.send({ message: "User updated successfully" });
    }
    res.send(user); // Enviar la respuesta con el usuario actualizado
  } catch (error) {
    res.status(400).send(error); // Manejar errores y enviar una respuesta con código 400
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
