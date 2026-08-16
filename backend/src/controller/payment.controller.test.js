import test from 'node:test';
import assert from 'node:assert/strict';

import { updatePaymentStatus } from './payment.controller.js';
import paymentmodel from '../models/payment.models.js';
import cartModel from '../models/cart.model.js';

const originalFindOne = paymentmodel.findOne;
const originalSave = paymentmodel.prototype?.save;
const originalCartFindOne = cartModel.findOne;
const originalCartFindOneAndUpdate = cartModel.findOneAndUpdate;

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
