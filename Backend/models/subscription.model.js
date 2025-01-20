import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["free", "premium", "enterprise"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

// Añadir el plugin de paginación al esquema
subscriptionSchema.plugin(mongoosePaginate);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
