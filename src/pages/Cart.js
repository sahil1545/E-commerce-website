import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";


function Cart() {
  const { theme, showAlert } = useUI();
  const { fetchCartCount } = useCart();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentSingle, setShowPaymentSingle] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


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
      fetchCartCount();
      showAlert("Item removed", "success");
    } catch {
      showAlert("Failed to remove item", "error");
    }
  };

  // 🟦 Buy now (single item)
  const buyNowItem = (item) => {
    setSelectedItem(item);
    setShowPaymentSingle(true);
  };

  // 🧾 Place order (all cart items)
  const placeOrder = async () => {
    if (placing) return;

    if (cartItems.length === 0) {
      showAlert("Cart is empty", "info");
      return;
    }

    const items = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price,
    }));

    try {
      setPlacing(true);

      await api.post("/api/orders", { items });

      setCartItems([]);
      fetchCartCount();
      showAlert("Order placed successfully 🎉", "success");
      navigate("/orders");
    } catch (error) {
      console.error("Order placement error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || "Failed to place order";
      showAlert(errorMessage, "error");
    } finally {
      setPlacing(false);
    }
  };

  const styles = {
    page: {
      padding: "70px 30px 20px",
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      backgroundSize: theme === "dark" ? "auto" : "400% 400%",
      animation: theme === "dark" ? "none" : "gradientShift 15s ease infinite",
      color: theme === "dark" ? "white" : "black",
      position: "relative",
    },
    header: {
      textAlign: "center",
      marginBottom: 40,
    },
    title: {
      fontSize: "2.5rem",
      margin: "0 0 10px 0",
      color: theme === "dark" ? "white" : "#333",
    },
    emptyCart: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#666",
    },
    item: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      padding: 15,
      borderRadius: 15,
      marginBottom: 20,
      display: "flex",
      flexDirection: "column",
      gap: 15,
      alignItems: "center",
      boxShadow: theme === "dark" ? "0 4px 15px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
      transition: "box-shadow 0.3s",
    },
    itemLeft: {
      display: "flex",
      alignItems: "center",
      gap: 20,
    },
    itemImg: {
      width: 80,
      height: 80,
      objectFit: "cover",
      borderRadius: 10,
    },
    itemDetails: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
    },
    itemName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      margin: 0,
      color: theme === "dark" ? "white" : "#333",
    },
    itemPrice: {
      fontSize: "1rem",
      color: "#2563eb",
      margin: 0,
    },
    quantityControls: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    qtyBtn: {
      width: 30,
      height: 30,
      border: "none",
      borderRadius: "50%",
      background: "#e5e7eb",
      color: "#333",
      cursor: "pointer",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    quantity: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      minWidth: "30px",
      textAlign: "center",
    },
    itemRight: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 10,
    },
    totalPrice: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#2563eb",
    },
    actionBtns: {
      display: "flex",
      gap: 10,
    },
    buyNowBtn: {
      padding: "8px 15px",
      border: "none",
      borderRadius: 8,
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
    },
    removeBtn: {
      padding: "8px 15px",
      border: "none",
      borderRadius: 8,
      background: "#dc2626",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
    },
    checkoutSection: {
      background: theme === "dark" ? "#1e293b" : "white",
      padding: 25,
      borderRadius: 15,
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      marginTop: 30,
      textAlign: "center",
    },
    totalAmount: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#2563eb",
      marginBottom: 20,
    },
    placeOrderBtn: {
      padding: "15px 30px",
      border: "none",
      borderRadius: 25,
      background: "#16a34a",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
    },
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Loading cart...</p>;
  }

  const updateQuantity = async (cartId, newQty) => {
  if (newQty < 1) return;

  try {
    await api.put(`/api/cart/${cartId}`, {
      quantity: newQty,
    });

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    fetchCartCount(); // 🔥 sync navbar
  } catch (error) {
  console.error(error);
  
}

};
 const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.products.price * item.quantity,
  0
);


  return (
    <>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div style={styles.emptyCart}>
          <p>Your cart is empty. Start shopping now!</p>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.item}>
              <div style={styles.itemLeft}>
                <img
                  src={item.products.image_url}
                  alt={item.products.name}
                  style={styles.itemImg}
                />
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.products.name}</h3>
                  <p style={styles.itemPrice}>₹{item.products.price} each</p>
                  <div style={styles.quantityControls}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span style={styles.quantity}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.itemRight}>
                <p style={styles.totalPrice}>
                  ₹{item.products.price * item.quantity}
                </p>
                <div style={styles.actionBtns}>
                  <button
                    style={styles.buyNowBtn}
                    disabled={placing}
                    onClick={() => buyNowItem(item)}
                  >
                    Buy Now
                  </button>
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div style={styles.checkoutSection}>
            <p style={styles.totalAmount}>Total: ₹{totalPrice}</p>
            <button
              style={styles.placeOrderBtn}
              onClick={() => setShowPayment(true)}
            >
              Place Order
            </button>
          </div>
  <PaymentModal
  open={showPayment}
  total={totalPrice}
  onClose={() => setShowPayment(false)}
  onSuccess={async (method) => {
    try {
      setPlacing(true);

      await api.post("/api/orders", {
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: method,
      });

      setCartItems([]);
      fetchCartCount();
      showAlert("Payment successful! Order completed 🎉", "success");
      navigate("/orders");
    } catch (error) {
  console.error(error);
  if (error.response?.data?.error) {
    showAlert(error.response.data.error, "error");
  }
}
 finally {
      setPlacing(false);
      setShowPayment(false);
    }
  }}
/>
<PaymentModal
  open={showPaymentSingle}
  total={selectedItem ? selectedItem.products.price * selectedItem.quantity : 0}
  onClose={() => setShowPaymentSingle(false)}
  onSuccess={async (method) => {
    try {
      setPlacing(true);

      await api.post("/api/orders", {
        items: [
          {
            product_id: selectedItem.product_id,
            quantity: selectedItem.quantity,
          },
        ],
        payment_method: method,
      });

      // Remove from cart after order
      await api.delete(`/api/cart/${selectedItem.id}`);
      setCartItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      fetchCartCount();

      showAlert("Payment successful! Order completed 🎉", "success");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      showAlert("Payment failed", "error");
    } finally {
      setPlacing(false);
      setShowPaymentSingle(false);
      setSelectedItem(null);
    }
  }}
/>


        </>
      )}
    </div>
    </>
  );
}

export default Cart;
