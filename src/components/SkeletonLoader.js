import { useUI } from "../context/UiContext";

function SkeletonLoader({ type = "card", count = 1 }) {
  const { theme } = useUI();

  const styles = {
    skeleton: {
      background: theme === "dark" ? "rgba(51, 65, 85, 0.8)" : "rgba(255, 255, 255, 0.8)",
      borderRadius: "8px",
      animation: "pulse 1.5s ease-in-out infinite",
    },
    card: {
      height: "280px",
      marginBottom: "20px",
    },
    text: {
      height: "16px",
      marginBottom: "8px",
    },
    title: {
      height: "24px",
      width: "70%",
      marginBottom: "12px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
    },
    button: {
      height: "40px",
      width: "100px",
    },
  };

  const renderSkeleton = (type) => {
    switch (type) {
      case "productCard":
        return (
          <div style={{ padding: "20px", marginBottom: "20px" }}>
            <div style={{ ...styles.skeleton, ...styles.card, height: "200px", marginBottom: "15px" }} />
            <div style={{ ...styles.skeleton, ...styles.title }} />
            <div style={{ ...styles.skeleton, ...styles.text, width: "50%" }} />
            <div style={{ ...styles.skeleton, ...styles.text, width: "30%" }} />
          </div>
        );
      case "orderItem":
        return (
          <div style={{ padding: "20px", marginBottom: "15px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ ...styles.skeleton, width: "70px", height: "70px", borderRadius: "10px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...styles.skeleton, ...styles.title, width: "80%" }} />
                <div style={{ ...styles.skeleton, ...styles.text, width: "60%" }} />
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div style={{ padding: "25px", marginBottom: "25px" }}>
            <div style={{ ...styles.skeleton, height: "30px", width: "200px", marginBottom: "20px" }} />
            <div style={{ ...styles.skeleton, height: "200px", width: "100%" }} />
          </div>
        );
      default:
        return <div style={{ ...styles.skeleton, height: "20px", width: "100%" }} />;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton(type)}</div>
      ))}
    </>
  );
}

export default SkeletonLoader;