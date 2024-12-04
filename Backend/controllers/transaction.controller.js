import Transaction from "../models/transaction.model.js";

/**
 * createTransaction
 * @description Creates a new transaction
 * @function - The function creates a new transaction
 * @async - The function is asynchronous
 * @returns {Object} - The created transaction
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
export const createTransaction = async (req, res) => {
  try {
    const { user, amount, currency, status, paymentMethod } = req.body;
    const transaction = new Transaction({
      user,
      amount,
      currency,
      status,
      paymentMethod,
    });
    await transaction.save();
    res.status(201).json({ message: "Transaction created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * getTransactions
 * @description Gets all transactions
 * @function - The function gets all transactions
 * @async - The function is asynchronous
 * @returns {Object} - The transactions
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * deleteTransaction
 * @description Deletes a transaction
 * @function - The function deletes a transaction
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns - {Object} - The deleted transaction
 */
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * updateTransaction
 * @description Updates a transaction
 * @function - The function updates a transaction
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns - {Object} - The updated transaction
 */
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * getTransactionById
 * @description Gets a transaction by id
 * @function - The function gets a transaction by id
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns - {Object} - The transaction
 * @pmethod GET
 */
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * getTransactionsByUser
 * @description Gets all transactions by user
 * @function - The function gets all transactions by user
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The transactions
 * @pmethod GET
 */
export const getTransactionsByUser = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * getTransactionsByStatus
 * @description Gets all transactions by status
 * @function - The function gets all transactions by status
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The transactions
 * @pmethod GET
 */
export const getTransactionsByStatus = async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: req.params.status });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * getTransactionsByPaymentMethod
 * @description Gets all transactions by payment method
 * @function - The function gets all transactions by payment method
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The transactions
 * @pmethod GET
 */
export const getTransactionsByPaymentMethod = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      paymentMethod: req.params.paymentMethod,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * getTransactionsByCurrency
 * @description Gets all transactions by currency
 * @function - The function gets all transactions by currency
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The transactions
 * @pmethod GET
 */
export const getTransactionsByCurrency = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      currency: req.params.currency,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
