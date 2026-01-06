import { useUI } from "../context/UiContext";

function Alert() {
  const { alert } = useUI();

  if (!alert) return null;

  const colors = {
    success: "#16a34a",
    error: "#dc2626",
    info: "#2563eb",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: colors[alert.type],
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      {alert.message}
    </div>
  );
}

export default Alert;
