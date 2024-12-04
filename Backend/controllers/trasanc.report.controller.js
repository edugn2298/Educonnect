import Transaction from "../models/transaction.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";

/**
 * @function getFilteredTransactions
 * @description Obtiene todas las transacciones filtradas por los parámetros proporcionados
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
export const getFilteredTransactions = async (req, res) => {
  try {
    const {
      userId,
      currency,
      status,
      paymentMethod,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const match = { deleted: false };

    if (userId) match.user = mongoose.Types.ObjectId(userId);
    if (currency) match.currency = currency;
    if (status) match.status = status;
    if (paymentMethod) match.paymentMethod = paymentMethod;
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: "user",
    };

    const transactions = await Transaction.paginate(match, options);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @function downloadPDFReport
 * @description Downloads a PDF report of the transactions filtered by the provided parameters
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 */
export const downloadPDFReport = async (req, res) => {
  try {
    const { userId, currency, status, paymentMethod, startDate, endDate } =
      req.query;

    // Construimos el objeto de coincidencia dinámicamente
    const match = { deleted: false };

    if (userId) match.user = mongoose.Types.ObjectId(userId);
    if (currency) match.currency = currency;
    if (status) match.status = status;
    if (paymentMethod) match.paymentMethod = paymentMethod;
    if (startDate)
      match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
    if (endDate)
      match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

    const transactions = await Transaction.find(match).populate("user");

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

    const filePath = `./reports/transaction_report_${dateTimeString}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Transaction Report", { align: "center" });

    transactions.forEach((transaction) => {
      doc
        .fontSize(12)
        .text(`User: ${transaction.user.username}`)
        .text(`Amount: ${transaction.amount}`)
        .text(`Currency: ${transaction.currency}`)
        .text(`Status: ${transaction.status}`)
        .text(`Payment Method: ${transaction.paymentMethod}`)
        .text(`Date: ${transaction.createdAt}`)
        .moveDown();
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(
        filePath,
        `transaction_report_${dateTimeString}.pdf`,
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

//GET /api/reports/transactions?userId=12345&currency=USD&status=completed&paymentMethod=PayPal&startDate=2023-01-01&endDate=2023-12-31
