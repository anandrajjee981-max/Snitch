import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addtocart, getcart, removecartitem, updatecartquantity } from "../service/cart.api";
import { setcart, addtocarts, toggleCart, openCart, closeCart } from "../cart.slice";

const usecart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart || []);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen || false);

  async function getcartapi() {
    try {
      const res = await getcart();
      if (res && res.cart && res.cart.items) {
        dispatch(setcart(res.cart.items));
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }

  async function addtocartapi(productid, quantity = 1) {
    try {
      const res = await addtocart(productid, quantity);
      if (res && res.cart && res.cart.items) {
        dispatch(addtocarts(res.cart.items));
      }
      await getcartapi();
      dispatch(openCart());
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }

  async function removecartitemapi(productid) {
    try {
      const res = await removecartitem(productid);
      if (res && res.cart && res.cart.items) {
        dispatch(addtocarts(res.cart.items));
      }
      await getcartapi();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  }

  // Update quantity for a specific cart item
  async function updateCartQuantityApi(productid, quantity) {
    try {
      const res = await updatecartquantity(productid, quantity);
      if (res && res.cart && res.cart.items) {
        dispatch(addtocarts(res.cart.items));
      }
      await getcartapi();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  }

  // Helper method accepting item object or product ID directly
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
    getcartapi();
  }, []);

  const cartTotal = cart.reduce((total, item) => {
    const price = item.productDetails?.price ?? item.productprice?.price ?? item.price ?? item.product?.price ?? 0;
    const qty = item.quantity || 1;
    return total + price * qty;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);

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
  };
};

export default usecart;




