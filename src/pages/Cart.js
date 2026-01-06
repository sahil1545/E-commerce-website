import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { theme, showAlert } = useUI();
  const { fetchCartCount } = useCart(); // ✅ from context
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart");
      setCartItems(res.data);
    } catch {
      showAlert("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ❌ Remove item
  const removeFromCart = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      fetchCartCount(); // 🔥 SYNC NAVBAR COUNT
      showAlert("Item removed", "success");
    } catch {
      showAlert("Failed to remove item", "error");
    }
  };

  // 🧾 Place order
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      showAlert("Cart is empty", "info");
      return;
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.products.price * item.quantity,
      0
    );

    try {
      await api.post("/api/orders", {
        total_price: totalPrice,
      });

      setCartItems([]);
      fetchCartCount(); // 🔥 RESET COUNT TO 0
      showAlert("Order placed successfully", "success");
      navigate("/orders");
    } catch {
      showAlert("Failed to place order", "error");
    }
  };

  const styles = {
    page: {
      padding: 30,
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "#f4f6f8",
      color: theme === "dark" ? "white" : "black",
    },
    item: {
      background: theme === "dark" ? "#1e293b" : "white",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      display: "flex",
      justifyContent: "space-between",
    },
    btn: {
      padding: "8px 12px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
    },
  };

  if (loading) return <p style={{ padding: 30 }}>Loading cart...</p>;

  return (
    <div style={styles.page}>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>
                <h4>{item.products.name}</h4>
                <p>Qty: {item.quantity}</p>
                <strong>₹{item.products.price}</strong>
              </div>

              <button
                style={{ ...styles.btn, background: "#dc2626", color: "white" }}
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            style={{
              ...styles.btn,
              background: "#16a34a",
              color: "white",
              width: "100%",
              marginTop: 20,
              padding: 12,
            }}
            onClick={placeOrder}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
