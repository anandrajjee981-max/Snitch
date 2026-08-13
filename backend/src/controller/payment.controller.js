import paymentmodel from "../models/payment.models.js";
import cartModel from "../models/cart.model.js";
import { aggregationResult } from "../dao/cart.dao.js";
import { createOrder } from "../service/Payment.service.js";
import { validatePaymentVerification } from '../utils/razorpay.utils.js';
import { Config } from "../config/config.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const cartAggregation = await aggregationResult(req.user._id);
    if (!cartAggregation || cartAggregation.length === 0 || !cartAggregation[0].items || cartAggregation[0].items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let amountInPaise = 0;
    if (req.body.amount && Number(req.body.amount) > 0) {
      amountInPaise = Number(req.body.amount);
    } else {
      const rupees = cartAggregation[0].totalCartAmount || 0;
      amountInPaise = Math.round(rupees * 100);
    }

    if (amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid payment amount in cart" });
    }

    let currency = req.body.currency || cartAggregation[0].currency || "INR";
    const order = await createOrder(amountInPaise, currency);
    const payment = await paymentmodel.create({
      user: req.user._id,
      orderId: order.id,
      amount: amountInPaise,
      currency: currency,
    });
    res.status(201).json({
      message: "Payment order created successfully",
      payment
    });
  } catch (error) {
    console.error("Error in createPaymentOrder:", error);
    res.status(500).json({ message: error.message || "Failed to create payment order" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body; 
    const payment = await paymentmodel.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment order not found" });
    }
    const isSignatureValid = validatePaymentVerification(
      signature,
      paymentId,
      Config.RAZOR_KEY_SECRET
    );
    if (!isSignatureValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    payment.status = "paid";
    payment.paymentId = paymentId;
    payment.signature = signature;
    await payment.save();

    // Clear cart upon successful payment
    await cartModel.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.status(200).json({ message: "Payment status updated successfully", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentmodel.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment order not found" });
    }
    res.status(200).json({ message: "Payment details fetched successfully", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const getUserPayments = async (req, res) => {
  try {
    const payments = await paymentmodel.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "User payments fetched successfully", payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};