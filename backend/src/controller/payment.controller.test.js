import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import { updatePaymentStatus } from './payment.controller.js';
import paymentmodel from '../models/payment.models.js';
import cartModel from '../models/cart.model.js';
import { Config } from '../config/config.js';

const originalFindOne = paymentmodel.findOne;
const originalSave = paymentmodel.prototype?.save;
const originalCartFindOne = cartModel.findOne;
const originalCartFindOneAndUpdate = cartModel.findOneAndUpdate;

test('updatePaymentStatus accepts Razorpay response aliases and verifies valid signatures', async () => {
  const orderId = 'order_123';
  const paymentId = 'pay_456';
  const validSignature = crypto
    .createHmac('sha256', Config.RAZOR_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  paymentmodel.findOne = async () => ({
    orderId,
    status: 'pending',
    save: async function save() {
      return this;
    }
  });

  cartModel.findOne = async () => ({ items: [] });
  cartModel.findOneAndUpdate = async () => ({ ok: true });

  const req = {
    body: {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: validSignature
    },
    user: { _id: 'user_123' }
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };

  await updatePaymentStatus(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(String(res.body?.message || ''), /updated successfully|success/i);

  paymentmodel.findOne = originalFindOne;
  cartModel.findOne = originalCartFindOne;
  cartModel.findOneAndUpdate = originalCartFindOneAndUpdate;
});

test('updatePaymentStatus rejects invalid Razorpay signatures with 400', async () => {
  paymentmodel.findOne = async () => ({
    orderId: 'order_123',
    status: 'pending',
    save: async function save() {
      return this;
    }
  });

  cartModel.findOne = async () => ({ items: [] });
  cartModel.findOneAndUpdate = async () => ({ ok: true });

  const req = {
    body: {
      orderId: 'order_123',
      paymentId: 'pay_456',
      signature: 'bad-signature'
    },
    user: { _id: 'user_123' }
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };

  await updatePaymentStatus(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(String(res.body?.message || ''), /signature|verification/i);

  paymentmodel.findOne = originalFindOne;
  cartModel.findOne = originalCartFindOne;
  cartModel.findOneAndUpdate = originalCartFindOneAndUpdate;
});
