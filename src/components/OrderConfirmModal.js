function OrderConfirmModal({ open, product, onClose, onConfirm, theme }) {
  if (!open || !product) return null; 


  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: theme === "dark" ? "#020617" : "white",
      color: theme === "dark" ? "white" : "black",
      padding: 25,
      borderRadius: 12,
      width: 350,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    },
    img: {
      width: "100%",
      height: 180,
      objectFit: "cover",
      borderRadius: 8,
      marginBottom: 10,
    },
    actions: {
      display: "flex",
      gap: 10,
      marginTop: 20,
    },
    cancel: {
      flex: 1,
      padding: 10,
      border: "none",
      borderRadius: 6,
      background: "#64748b",
      color: "white",
      cursor: "pointer",
    },
    confirm: {
      flex: 1,
      padding: 10,
      border: "none",
      borderRadius: 6,
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Confirm Order</h3>

        <img
  src={product.image_url}
  alt={product.name}
  style={{ width: "100%", borderRadius: 8 }}
   />



        <p><strong>{product.name}</strong></p>
        <p>Price: ₹{product.price}</p>

        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.confirm}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmModal;
