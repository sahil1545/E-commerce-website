import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../context/UiContext";
import { useAuth } from "../context/Authcontext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { theme, toggleTheme, showAlert } = useUI();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showAlert("Logged out successfully", "success");
    navigate("/login");
  };

  const styles = {
    nav: {
      background: theme === "dark" ? "#111827" : "#e5e7eb",
      color: theme === "dark" ? "white" : "black",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 16,
    },
    link: {
      textDecoration: "none",
      color: "inherit",
    },
    badge: {
      background: "#dc2626",
      color: "white",
      borderRadius: "50%",
      padding: "2px 8px",
      fontSize: 12,
      marginLeft: 5,
    },
    button: {
      padding: "6px 12px",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      background: theme === "dark" ? "#1f2937" : "#d1d5db",
      color: "inherit",
    },
    email: {
      fontSize: 14,
      opacity: 0.9,
    },
  };

  return (
    <nav style={styles.nav}>
      <strong>ShopSphere</strong>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>Products</Link>

        <Link to="/cart" style={styles.link}>
          Cart
          {cartCount > 0 && (
            <span style={styles.badge}>{cartCount}</span>
          )}
        </Link>

        <Link to="/orders" style={styles.link}>Orders</Link>

        {/* 🔐 AUTH LOGIC */}
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={styles.link}>
              Profile
            </Link>

            <span style={styles.email}>{user.email}</span>

            <button
              style={styles.button}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

        {/* 🌗 THEME TOGGLE */}
        <button
          style={styles.button}
          onClick={() => {
            toggleTheme();
            showAlert("Theme changed", "info");
          }}
        >
          🌗
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
