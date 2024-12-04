import Comment from "../models/comment.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import mongoose from "mongoose";

/*
 * @function getFilteredComments
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The filtered comments.
 */
export const getFilteredComments = async (req, res) => {
  try {
    const {
      postId,
      authorId,
      content,
      deleted,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (postId) match.post = mongoose.Types.ObjectId(postId);
    if (authorId) match.author = mongoose.Types.ObjectId(authorId);
    if (content) match.content = new RegExp(content, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (typeof deleted !== "undefined") match.deleted = deleted === "true";
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: ["post", "author"],
      sort: { createdAt: -1 },
    };

    const comments = await Comment.paginate(match, options);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
 * @function downloadPDFReport
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The filtered comments.
 */
export const downloadPDFReport = async (req, res) => {
  try {
    const { postId, authorId, content, deleted, startDate, endDate } =
      req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (postId) match.post = mongoose.Types.ObjectId(postId);
    if (authorId) match.author = mongoose.Types.ObjectId(authorId);
    if (content) match.content = new RegExp(content, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (typeof deleted !== "undefined") match.deleted = deleted === "true";
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const comments = await Comment.find(match).populate("post author");

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

    const filePath = `./reports/comment_report_${dateTimeString}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Comment Report", { align: "center" });

    comments.forEach((comment) => {
      doc
        .fontSize(12)
        .text(`Post: ${comment.post.content}`)
        .text(`Author: ${comment.author.username}`)
        .text(`Content: ${comment.content}`)
        .text(`Deleted: ${comment.deleted}`)
        .text(`Created At: ${comment.createdAt}`)
        .moveDown();
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(filePath, `comment_report_${dateTimeString}.pdf`, (err) => {
        if (err) {
          res.status(500).send({ message: "Could not download the file." });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
