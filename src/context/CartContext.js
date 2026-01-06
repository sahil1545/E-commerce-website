import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./Authcontext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // 🔄 Fetch full cart from backend
  const fetchCart = async () => {
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
    } catch (error) {
      setCart([]);
      setCartCount(0);
    }
  };

  // ➕ ADD TO CART (🔥 THIS WAS MISSING)
  const addToCart = async (productId) => {
    if (!user) return;

    try {
      await api.post("/api/cart", {
        product_id: productId,
        quantity: 1,
      });

      // 🔁 Sync cart & navbar count
      fetchCart();
    } catch (error) {
      throw error;
    }
  };

  // 🔁 Auto sync cart on login/logout
  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
