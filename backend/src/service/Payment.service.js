import { Config } from "../config/config.js";
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: Config.RAZOR_KEY_ID,
  key_secret:Config.RAZOR_KEY_SECRET,
});

export const createOrder = async (amount, currency) => {
  try {
    const options = {
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: currency,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};




