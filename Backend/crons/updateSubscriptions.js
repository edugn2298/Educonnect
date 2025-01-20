import Subscription from "../models/subscription.model.js";

export const updateSubscriptions = async () => {
  const now = new Date();
  console.log(now);
  try {
    const subscriptions = await Subscription.find({
      endDate: { $lte: now },
      isActive: true,
    });

    console.log(subscriptions);

    if (subscriptions.length === 0) {
      console.log("No subscriptions to update");
      return;
    }

    const updatedSubscriptions = await Subscription.updateMany(
      { endDate: { $lte: now }, isActive: true },
      { $set: { isActive: false } }
    );
    console.log(updatedSubscriptions);
    console.log("Subscriptions updated successfully");
  } catch (err) {
    console.error("Error updating subscriptions:", err);
  }
};
