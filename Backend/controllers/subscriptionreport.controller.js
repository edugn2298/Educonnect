import Subscription from "../models/subscription.model.js";
import fs from "fs";
import mongoose from "mongoose";

/**
 * get filtered subscriptions
 * @function getFilteredSubscriptions
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The subscriptions
 */
export const getFilteredSubscriptions = async (req, res) => {
  try {
    const {
      userId,
      plan,
      isActive,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (userId) match.user = mongoose.Types.ObjectId(userId);
    if (plan) match.plan = new RegExp(plan, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (typeof isActive !== "undefined") match.isActive = isActive === "true";
    if (startDate)
      match.startDate = { ...match.startDate, $gte: new Date(startDate) };
    if (endDate) match.endDate = { ...match.endDate, $lte: new Date(endDate) };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: {
        path: "user",
        select: "username profilePicture",
      },
    };

    const subscriptions = await Subscription.paginate(match, options);
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * download PDF report
 * @function downloadPDFReport
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The filtered subscriptions
 */
export const downloadPDFReport = async (req, res) => {
  try {
    const { userId, plan, isActive, startDate, endDate } = req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = {};

    if (userId) match.user = mongoose.Types.ObjectId(userId);
    if (plan) match.plan = new RegExp(plan, "i"); // Búsqueda insensible a mayúsculas/minúsculas
    if (typeof isActive !== "undefined") match.isActive = isActive === "true";
    if (startDate)
      match.startDate = { ...match.startDate, $gte: new Date(startDate) };
    if (endDate) match.endDate = { ...match.endDate, $lte: new Date(endDate) };

    const subscriptions = await Subscription.find(match).populate("user");

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

    const filePath = `./reports/subscription_report_${dateTimeString}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Subscription Report", { align: "center" });

    subscriptions.forEach((subscription) => {
      doc
        .fontSize(12)
        .text(`User: ${subscription.user.username}`)
        .text(`Plan: ${subscription.plan}`)
        .text(`Price: ${subscription.price}`)
        .text(`Start Date: ${subscription.startDate}`)
        .text(`End Date: ${subscription.endDate || "N/A"}`)
        .text(`Is Active: ${subscription.isActive}`)
        .text(`Created At: ${subscription.createdAt}`)
        .moveDown();
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(
        filePath,
        `subscription_report_${dateTimeString}.pdf`,
        (err) => {
          if (err) {
            res.status(500).send({ message: "Could not download the file." });
          }
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
