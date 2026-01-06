import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";

function Orders() {
  const { theme, showAlert } = useUI();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders");
        setOrders(res.data);
      } catch {
        showAlert("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showAlert]);

  const styles = {
    page: {
      padding: 30,
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "#f4f6f8",
      color: theme === "dark" ? "white" : "black",
    },
    order: {
      background: theme === "dark" ? "#1e293b" : "white",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
  };

  if (loading) return <p style={{ padding: 30 }}>Loading orders...</p>;

  return (
    <div style={styles.page}>
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.order}>
            <h4>Status: {order.status}</h4>
            <p>Total: ₹{order.total_price}</p>
            <p>
              Date: {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
