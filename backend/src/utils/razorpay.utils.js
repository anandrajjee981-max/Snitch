import crypto from 'crypto';

/**
 * Validate Razorpay payment signature
 * @param {string} signature - Razorpay signature from response
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} keySecret - Razorpay key secret
 * @returns {boolean} - True if signature is valid, false otherwise
 */
export const validatePaymentVerification = (signature, paymentId, keySecret) => {
  try {
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  } catch (error) {
    console.error('Error validating payment signature:', error);
    return false;
  }
};
