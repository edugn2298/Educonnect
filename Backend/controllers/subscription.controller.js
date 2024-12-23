import Subscription from "../models/subscription.model.js";

/**
 * get all subscriptions
 * @function getSubscriptions
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The subscriptions
 */
export const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { startDate: -1 }, // Ordenar por fecha de inicio en orden descendente
    };

    const subscriptions = await Subscription.paginate({}, options);
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * get subscription by id
 * @function getSubscriptionById
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The subscription
 */
export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * create subscription
 * @function createSubscription
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The subscription
 */
export const createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

/**
 * update subscription
 * @function updateSubscription
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {Object} - The subscription
 * @method PATCH
 * @returns {Object} - The updated subscription
 * @returns {Object} - The subscription
 */
export const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};

/**
 * delete subscription
 * @function deleteSubscription
 * @async - The function is asynchronous
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @method PATCH
 * @returns {Object} - The deleted subscription
 */
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true }
    );
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
