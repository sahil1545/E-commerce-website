import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./Authcontext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // 🔄 Fetch full cart
  const fetchCart = useCallback(async () => {
  if (!user) {
    setCart([]);
    setCartCount(0);
    return;
  }

  try {
    const res = await api.get("/api/cart");
    setCart(res.data);

    const total = res.data.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCartCount(total);
  } catch {
    setCart([]);
    setCartCount(0);
  }
}, [user]);


  // 🔥 Needed by Navbar, Cart, Buy Now, Quantity update etc.
  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/api/cart");
      const total = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  // ➕ Add to cart
  const addToCart = async (productId) => {
    if (!user) return;

    await api.post("/api/cart", {
      product_id: productId,
      quantity: 1,
    });

    await fetchCart();        // sync cart
    await fetchCartCount();   // sync navbar
  };

  // 🔁 Auto sync when login/logout
  useEffect(() => {
  fetchCart();
}, [fetchCart]);


  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        fetchCart,
        fetchCartCount, // 🔥 THIS FIXES YOUR CRASH
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
