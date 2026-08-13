import { Config } from "../config/config.js";
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: Config.RAZOR_KEY_ID,
  key_secret:Config.RAZOR_KEY_SECRET,
});

export const createOrder = async (amount, currency = "INR") => {
  try {
    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid amount provided for payment order");
    }

    const options = {
      amount: Math.round(numericAmount),
      currency: currency || "INR",
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    const errorMessage = error?.error?.description || error?.message || "Failed to create Razorpay order";
    throw new Error(errorMessage);
  }
};




