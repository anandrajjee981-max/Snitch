import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
    },

    signature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    refundId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const paymentmodel = new mongoose.model("payment",paymentSchema)
export default paymentmodel