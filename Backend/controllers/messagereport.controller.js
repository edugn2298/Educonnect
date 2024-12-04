import Message from "../models/message.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import mongoose from "mongoose";

/**
 * get filtered messages
 * @function getFilteredMessages
 * @async - The function is asynchronous
 * @method GET
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The messages
 */
export const getFilteredMessages = async (req, res) => {
  try {
    const {
      senderId,
      receiverId,
      content,
      read,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (senderId) match.sender = mongoose.Types.ObjectId(senderId);
    if (receiverId) match.receiver = mongoose.Types.ObjectId(receiverId);
    if (content) match.content = new RegExp(content, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (typeof read !== "undefined") match.read = read === "true";
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: ["sender", "receiver"],
      sort: { createdAt: -1 },
    };

    const messages = await Message.paginate(match, options);
    res.status(200).json(messages);
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
 * @returns {Object} - The filtered messages
 */
export const downloadPDFReport = async (req, res) => {
  try {
    const { senderId, receiverId, content, read, startDate, endDate } =
      req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (senderId) match.sender = mongoose.Types.ObjectId(senderId);
    if (receiverId) match.receiver = mongoose.Types.ObjectId(receiverId);
    if (content) match.content = new RegExp(content, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (typeof read !== "undefined") match.read = read === "true";
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const messages = await Message.find(match).populate("sender receiver");

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

    const filePath = `./reports/message_report_${dateTimeString}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Message Report", { align: "center" });

    messages.forEach((message) => {
      doc
        .fontSize(12)
        .text(`Sender: ${message.sender.username}`)
        .text(`Receiver: ${message.receiver.username}`)
        .text(`Content: ${message.content}`)
        .text(`Read: ${message.read}`)
        .text(`Date: ${message.createdAt}`)
        .moveDown();
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(filePath, `message_report_${dateTimeString}.pdf`, (err) => {
        if (err) {
          res.status(500).send({ message: "Could not download the file." });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
