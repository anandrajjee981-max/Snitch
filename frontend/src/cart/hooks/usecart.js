import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addtocart, getcart, removecartitem, updatecartquantity, createPaymentOrder, updatePaymentStatus, getPaymentDetails, getUserPayments } from "../service/cart.api";
import { setcart, addtocarts, setcartloaded, toggleCart, openCart, closeCart } from "../cart.slice";

let cartFetchInProgress = false;

const usecart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart || []);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen || false);
  const isCartLoaded = useSelector((state) => state.cart.isLoaded || false);

  async function getcartapi(force = false) {
    if (!force && isCartLoaded) return;
    if (cartFetchInProgress) return;

    cartFetchInProgress = true;
    try {
      const res = await getcart();
      if (res && res.cart) {
        const nextCartItems = Array.isArray(res.cart.items) ? res.cart.items : [];
        dispatch(setcart(nextCartItems));
      }
      dispatch(setcartloaded(true));
      return res;
    } catch (err) {
      console.error("Error fetching cart:", err);
      throw err;
    } finally {
      cartFetchInProgress = false;
    }
  }

  const extractId = (target) => {
    if (!target) return null;
    if (typeof target === 'string') return target;
    if (typeof target === 'object') {
      if (target.productid) return extractId(target.productid);
      if (target._id) return extractId(target._id);
      if (target.id) return extractId(target.id);
    }
    return String(target);
  };

  async function addtocartapi(productid, quantity = 1) {
    try {
      const cleanId = extractId(productid);
      if (!cleanId) {
        console.error("Invalid product ID passed to addtocartapi:", productid);
        return;
      }
      const res = await addtocart(cleanId, quantity);
      if (res && res.cart) {
        const nextCartItems = Array.isArray(res.cart.items) ? res.cart.items : [];
        dispatch(addtocarts(nextCartItems));
        dispatch(setcartloaded(true));
      }
      dispatch(openCart());
      return res;
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  }

  async function removecartitemapi(productid) {
    try {
      const cleanId = extractId(productid);
      if (!cleanId) {
        console.error("Invalid product ID passed to removecartitemapi:", productid);
        return;
      }
      const res = await removecartitem(cleanId);
      if (res && res.cart) {
        const nextCartItems = Array.isArray(res.cart.items) ? res.cart.items : [];
        dispatch(addtocarts(nextCartItems));
        dispatch(setcartloaded(true));
      }
      return res;
    } catch (err) {
      console.error("Error removing from cart:", err);
      throw err;
    }
  }

  async function updateCartQuantityApi(productid, quantity) {
    try {
      const cleanId = extractId(productid);
      if (!cleanId) {
        console.error("Invalid product ID passed to updateCartQuantityApi:", productid);
        return;
      }
      const res = await updatecartquantity(cleanId, quantity);
      if (res && res.cart) {
        const nextCartItems = Array.isArray(res.cart.items) ? res.cart.items : [];
        dispatch(addtocarts(nextCartItems));
        dispatch(setcartloaded(true));
      }
      return res;
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      throw err;
    }
  }

  const addToCart = (productOrId, quantity = 1) => {
    let id = productOrId;
    if (typeof productOrId === "object" && productOrId !== null) {
      if (productOrId.selectedVariant && productOrId.selectedVariant._id) {
        id = productOrId.selectedVariant._id;
      } else {
        id = productOrId._id || productOrId.id;
      }
    }
    return addtocartapi(id, quantity);
  };

  useEffect(() => {
    if (!isCartLoaded) {
      getcartapi();
    }
  }, [isCartLoaded]);

  const cartTotal = cart.reduce((total, item) => {
    const price = item.productDetails?.price ?? item.productprice?.price ?? item.price ?? item.product?.price ?? 0;
    const qty = item.quantity || 1;
    return total + price * qty;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);
async function createPaymentOrderApi(amount, currency) {
    try {
      const res = await createPaymentOrder(amount, currency); 
      return res; 
    } catch (err) {
      console.error("Error creating payment order:", err);
      throw err;
    }
  }
    async function updatePaymentStatusApi(orderId, paymentId, signature) {
    try {
      const res = await updatePaymentStatus(orderId, paymentId, signature);
      return res;
    } catch (err) {
      console.error("Error updating payment status:", err);
      throw err;
    }
  }
  async function getPaymentDetailsApi(orderId) {
    try {
      const res = await getPaymentDetails(orderId);
      return res;
    } catch (err) {
      console.error("Error fetching payment details:", err);
      throw err;
    }
  }

  async function getUserPaymentsApi() {
    try {
      const res = await getUserPayments();
      return res;
    } catch (err) {
      console.error("Error fetching user payments:", err);
      throw err;
    }
  }

  return {
    cart,
    isCartOpen,
    cartTotal,
    cartCount,
    addtocartapi,
    getcartapi,
    addToCart,
    toggleCart: () => dispatch(toggleCart()),
    closeCart: () => dispatch(closeCart()),
    openCart: () => dispatch(openCart()),
    removecartitemapi,
    updateCartQuantityApi,
    createPaymentOrderApi,
    updatePaymentStatusApi,
    getPaymentDetailsApi,
    getUserPaymentsApi
  };

}
export default usecart;




