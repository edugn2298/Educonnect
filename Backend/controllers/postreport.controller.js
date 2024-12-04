import Post from "../models/post.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import mongoose from "mongoose";

/**
 * get filtered posts
 * @function getFilteredPosts
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The posts
 */
export const getFilteredPosts = async (req, res) => {
  try {
    const {
      authorId,
      content,
      hashtags,
      deleted,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (authorId) match.author = mongoose.Types.ObjectId(authorId);
    if (content) match.content = new RegExp(content, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (hashtags) match.hashtags = { $in: hashtags.split(",") };
    if (typeof deleted !== "undefined") match.deleted = deleted === "true";
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: ["author", "likes", "comments"],
      sort: { createdAt: -1 },
    };

    const posts = await Post.paginate(match, options);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * download pdf report
 * @function downloadPDFReport
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The filtered posts
 */
export const downloadPDFReport = async (req, res) => {
  try {
    const { authorId, content, hashtags, deleted, startDate, endDate } =
      req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (authorId) match.author = mongoose.Types.ObjectId(authorId);
    if (content) match.content = new RegExp(content, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (hashtags) match.hashtags = { $in: hashtags.split(",") };
    if (typeof deleted !== "undefined") match.deleted = deleted === "true";
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const posts = await Post.find(match).populate("author likes comments");

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

    const filePath = `./reports/post_report_${dateTimeString}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Post Report", { align: "center" });

    posts.forEach((post) => {
      doc
        .fontSize(12)
        .text(`Author: ${post.author.username}`)
        .text(`Content: ${post.content}`)
        .text(`Hashtags: ${post.hashtags.join(", ")}`)
        .text(`Likes: ${post.likes.length}`)
        .text(`Comments: ${post.comments.length}`)
        .text(`Deleted: ${post.deleted}`)
        .text(`Created At: ${post.createdAt}`)
        .moveDown();
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(filePath, `post_report_${dateTimeString}.pdf`, (err) => {
        if (err) {
          res.status(500).send({ message: "Could not download the file." });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
