import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";

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
  const { userId, plan, price, isActive } = req.body;
  console.log(req.body);
  try {
    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const subscription = await Subscription.create({
      user: userId,
      plan,
      isActive,
      price,
      startDate: startDate,
      endDate: endDate,
    });
    await subscription.save();

    const userSubscription = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { subscriptions: subscription._id } },
      { new: true }
    );
    if (!userSubscription) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(subscription);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.log(error);
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
      { delete: true },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res
      .status(200)
      .json({ message: "Subscription deleted ", subscription: subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubscriptionsByUser = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.params.id,
      delete: false,
    });

    if (subscriptions.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renewSubscription = async (req, res) => {
  const { userId, plan } = req.body;
  const newEndDate = new Date();
  newEndDate.setDate(newEndDate.getDate() + 30);
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { user: userId, plan: plan },
      { endDate: newEndDate, isActive: true },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
