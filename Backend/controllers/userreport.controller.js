import User from "../models/user.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import mongoose from "mongoose";

/**
 * get filtered users
 * @function getFilteredUsers
 * @async
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @method GET
 * @returns {Object} - The filtered users
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
export const getFilteredUsers = async (req, res) => {
  try {
    const {
      username,
      email,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (username) match.username = new RegExp(username, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (email) match.email = new RegExp(email, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const users = await User.paginate(match, options);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * download pdf report
 * @function downloadPDFReport
 * @async
 * @method GET
 * @returns {Object} - The filtered users
 * @requires - authenticate middleware
 * @requires - authorize middleware
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The filtered users
 */
export const downloadPDFReport = async (req, res) => {
  try {
    const { username, email, startDate, endDate } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (username) match.username = new RegExp(username, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (email) match.email = new RegExp(email, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const users = await User.find(match);

    const doc = new PDFDocument();

    // Generar la cadena de fecha y hora
    const now = new Date();
    const dateTimeString = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(
      now.getHours()
    ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    const filePath = `./reports/user_report_${dateTimeString}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("User Report", { align: "center" });

    users.forEach((user) => {
      doc
        .fontSize(12)
        .text(`Username: ${user.username}`)
        .text(`Email: ${user.email}`)
        .text(`Created At: ${user.createdAt}`)
        .moveDown();
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(filePath, `user_report_${dateTimeString}.pdf`, (err) => {
        if (err) {
          res.status(500).send({ message: "Could not download the file." });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
