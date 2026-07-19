import React from 'react';
import { useCart } from './productroute.slice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  };

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
              <h2>Your Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
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
                  const itemId = item._id || item.id;
                  const itemPrice = item.productprice?.price || item.price || 0;
                  const itemCurrency = item.productprice?.currency === 'INR' || item.currency === 'INR' ? '₹' : '$';
                  const itemImage = Array.isArray(item.image) ? item.image[0] : item.image;
                  
                  return (
                    <div className="cart-item" key={itemId}>
                      <div className="item-img-wrapper">
                        <img src={itemImage || 'https://placehold.co/150'} alt={item.title} />
                      </div>
                      <div className="item-details">
                        <div className="item-top">
                          <h4 className="item-name">{item.title}</h4>
                          <button 
                            className="btn-remove-item" 
                            onClick={() => removeFromCart(itemId)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="item-bottom">
                          <div className="quantity-controller">
                            <button onClick={() => updateQuantity(itemId, -1)} aria-label="Decrease quantity">
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(itemId, 1)} aria-label="Increase quantity">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="item-price">
                            {itemCurrency}{(itemPrice * item.quantity).toLocaleString()}
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
                    {cart[0]?.productprice?.currency === 'INR' || cart[0]?.currency === 'INR' ? '₹' : '$'}
                    {cartTotal.toLocaleString()}
                  </span>
                </div>
                <button className="btn-checkout" onClick={checklogin}>
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
