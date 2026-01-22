import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import SkeletonLoader from "../components/SkeletonLoader";

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
    noOrders: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#666",
    },
    order: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      padding: 15,
      borderRadius: 15,
      marginBottom: 25,
      boxShadow: theme === "dark" ? "0 4px 15px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    orderId: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: theme === "dark" ? "white" : "#333",
    },
    statusBadge: {
      padding: "5px 12px",
      borderRadius: 20,
      fontSize: "0.9rem",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    orderDetails: {
      display: "flex",
      gap: 20,
      marginBottom: 15,
      flexWrap: "wrap",
    },
    detailItem: {
      fontSize: "0.95rem",
      color: "#666",
    },
    item: {
      display: "flex",
      gap: 15,
      marginTop: 15,
      alignItems: "center",
      padding: "15px 0",
      borderTop: "1px solid #e5e7eb",
    },
    img: {
      width: 70,
      height: 70,
      objectFit: "cover",
      borderRadius: 10,
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: "1rem",
      fontWeight: "600",
      margin: "0 0 5px 0",
      color: theme === "dark" ? "white" : "#333",
    },
    itemInfo: {
      fontSize: "0.9rem",
      color: "#666",
      margin: 0,
    },
    orderTotal: {
      textAlign: "right",
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "#2563eb",
      marginTop: 15,
    },
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Your Orders</h1>
        </div>
        <SkeletonLoader type="orderItem" count={3} />
      </div>
    );
  }

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
        <h1 style={styles.title}>Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div style={styles.noOrders}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.order}>
            <div style={styles.orderHeader}>
              <h3 style={styles.orderId}>Order #{order.id}</h3>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                }}
              >
                {order.status}
              </span>
            </div>

            {/* 🚚 Delivery Tracking */}
<div style={{ marginTop: 15 }}>
  <p>
    <strong>Delivery:</strong>{" "}
    <span style={{ color: "#2563eb" }}>
      {order.delivery_status || "PLACED"}
    </span>
  </p>

  <div style={{ marginTop: 10 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 12,
        opacity: 0.8,
      }}
    >
      <span>Placed</span>
      <span>Packed</span>
      <span>Shipped</span>
      <span>Out</span>
      <span>Delivered</span>
    </div>

    <progress
      value={
        ["PLACED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"]
          .indexOf(order.delivery_status || "PLACED") + 1
      }
      max="5"
      style={{
        width: "100%",
        height: 8,
        marginTop: 5,
      }}
    />
  </div>
</div>


            <div style={styles.orderDetails}>
              <span style={styles.detailItem}>
                Payment: {order.payment_method} ({order.payment_status})
              </span>
              <span style={styles.detailItem}>
                Date: {new Date(order.created_at).toLocaleString()}
              </span>
            </div>

            {order.order_items.map((item) => (
              <div key={item.id} style={styles.item}>
                <img
                  src={item.products.image_url}
                  alt={item.products.name}
                  style={styles.img}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.products.name}</h4>
                  <p style={styles.itemInfo}>
                    Quantity: {item.quantity} × ₹{item.products.price}
                  </p>
                </div>
              </div>
            ))}

            <div style={styles.orderTotal}>
              Total: ₹{order.total_price}
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
}

export default Orders;
