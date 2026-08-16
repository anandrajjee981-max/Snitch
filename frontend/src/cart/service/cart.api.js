import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export async function addtocart(productid, quantity) {
    const res = await api.post(`/cart/add/${productid}`, { quantity });
    return res.data;
}

export async function getcart() {
    const res = await api.get(`/cart`);
    return res.data;
}

export async function removecartitem(productid) {
    const res = await api.delete(`/cart/remove/${productid}`);
    return res.data;
}

export async function updatecartquantity(productid, quantity) {
  const res = await api.patch(`/cart/${productid}`, { quantity });
  return res.data;
}

export async function createPaymentOrder(amount, currency) {
  const res = await api.post(`/payment/create`, { amount, currency });
  return res.data;
}
export async function updatePaymentStatus(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  const res = await api.patch(`/payment/update`, { orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature });
  return res.data;
}
export async function getPaymentDetails(orderId) {
  const res = await api.get(`/payment/details/${orderId}`);
  return res.data;
}

export async function getUserPayments() {
  const res = await api.get(`/payment/user-payments`);
  return res.data;
}
