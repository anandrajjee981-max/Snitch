import React from 'react';
import usecart from './hooks/usecart';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRazorpay } from "react-razorpay";

export default function CartDrawer() {
  const { error, isLoading, Razorpay } = useRazorpay();

  const { 
    cart, 
    isCartOpen, 
    closeCart,
    cartTotal,
    removecartitemapi,
    updateCartQuantityApi ,createPaymentOrderApi,updatePaymentStatusApi
  } = usecart();

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  };

async function handlemyPayment() {
    try {
      const orderResponse = await createPaymentOrderApi(cartTotal * 100, "INR");
      const { orderId } = orderResponse;

      const options = {
        key: process.env.RAZOR_KEY_ID,
        amount: cartTotal * 100,
        currency: "INR",
        name: "Your Company Name",
        description: "Purchase Description",
        order_id: orderId,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          try {
            await updatePaymentStatusApi(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            alert("Payment Successful!");
          } catch (err) {
            console.error("Error updating payment status:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe  @example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Error creating payment order:", err);
      alert("Payment initiation failed. Please try again.");
    }
  }




  const springTransition = {
    type: 'spring',
    mass: 0.5,
    damping: 12,
    stiffness: 100
  };
  const user = useSelector(state=>state.auth.user)
  async function checklogin(){
    if(!user){
      alert('need to login first...')
      return;
    }
    alert('Proceeding to checkout...')
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div 
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer Sidebar */}
          <motion.div 
            className="cart-drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={springTransition}
          >
            <div className="cart-header">
              <h2>Your Bag ({cart.reduce((a, b) => a + (b.quantity || 1), 0)})</h2>
              <button className="btn-close-drawer" onClick={closeCart} aria-label="Close cart">
                <X size={24} />
              </button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} />
                  <h3>Your bag is empty</h3>
                  <p>Explore our products and find the perfect additions to your wardrobe.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemId = (typeof item._id === 'string' ? item._id : null) || (typeof item.productid === 'string' ? item.productid : item.productid?._id) || item.id;
                  const details = item.productDetails;
                  const title = details?.title || item.title || 'Product';
                  const itemPrice = details?.price ?? item.productprice?.price ?? item.price ?? item.product?.price ?? 0;
                  const itemCurrency = (details?.currency === 'INR' || item.currency === 'INR' || item.product?.currency === 'INR') ? '₹' : '$';
                  const itemImage = (details?.images && details.images.length > 0)
                    ? details.images[0]
                    : (Array.isArray(item.image) ? item.image[0] : item.image);

                  const quantity = item.quantity || 1;
                  const productId = (typeof item.productid === 'object' && item.productid !== null ? (item.productid._id || item.productid.id) : item.productid) || item._id;
                  
                  return (
                    <div className="cart-item" key={itemId}>
                      <div className="item-img-wrapper">
                        <img src={itemImage || 'https://placehold.co/150'} alt={title} />
                      </div>
                      <div className="item-details">
                        <div className="item-top">
                          <h4 className="item-name">{title}</h4>
                          <button 
                            className="btn-remove-item" 
                            onClick={() => removecartitemapi(productId)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="item-bottom">
                          <div className="quantity-controller">
                            <button onClick={() => {
                              const newQty = quantity - 1;
                              if (newQty <= 0) {
                                removecartitemapi(productId);
                              } else {
                                updateCartQuantityApi(productId, newQty);
                              }
                            }} aria-label="Decrease quantity">
                              <Minus size={12} />
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => updateCartQuantityApi(productId, quantity + 1)} aria-label="Increase quantity">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="item-price">
                            {itemCurrency}{(itemPrice * quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="summary-row">
                  <span className="label">Total amount:</span>
                  <span className="value">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button onClick={handlemyPayment} className="btn-checkout">
                  Checkout Now
                </button>
                <p className="shipping-info">Complimentary shipping on all orders over $75.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
