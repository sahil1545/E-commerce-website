import { Link, useNavigate } from "react-router-dom";
import { useUI } from "../context/UiContext";
import { useAuth } from "../context/Authcontext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function Navbar() {
  const { theme, toggleTheme, showAlert } = useUI();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    showAlert("Logged out successfully", "success");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const styles = {
    nav: {
      background: theme === "dark" ? "#1e293b" : "#ffffff",
      color: theme === "dark" ? "white" : "#333",
      padding: "10px 15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      minHeight: "60px",
    },
    left: {
      display: "flex",
      alignItems: "center",
      gap: 20,
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2563eb",
      textDecoration: "none",
    },
    searchForm: {
      display: "flex",
      alignItems: "center",
      background: theme === "dark" ? "#374151" : "#f3f4f6",
      borderRadius: "25px",
      padding: "5px 15px",
      gap: 10,
    },
    searchInput: {
      border: "none",
      background: "transparent",
      outline: "none",
      padding: "8px",
      flex: 1,
      color: theme === "dark" ? "white" : "#333",
    },
    searchButton: {
      border: "none",
      background: "#2563eb",
      color: "white",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 20,
    },
    link: {
      textDecoration: "none",
      color: "inherit",
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "background 0.3s",
    },
    linkHover: {
      background: theme === "dark" ? "#374151" : "#e5e7eb",
    },
    cartLink: {
      position: "relative",
      textDecoration: "none",
      color: "inherit",
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "background 0.3s",
    },
    badge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      background: "#dc2626",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "12px",
      minWidth: "18px",
      textAlign: "center",
    },
    userMenu: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
    },
    userAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      background: "#2563eb",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    dropdown: {
      position: "absolute",
      top: "40px",
      right: 0,
      background: theme === "dark" ? "#374151" : "white",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      minWidth: "150px",
      zIndex: 1001,
    },
    dropdownItem: {
      padding: "10px 15px",
      borderBottom: "1px solid " + (theme === "dark" ? "#4b5563" : "#e5e7eb"),
      cursor: "pointer",
      color: theme === "dark" ? "white" : "#333",
    },
    dropdownItemLast: {
      borderBottom: "none",
    },
    button: {
      padding: "8px 12px",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      background: theme === "dark" ? "#374151" : "#e5e7eb",
      color: "inherit",
      transition: "background 0.3s",
    },
  };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>
          🛒 ShopSphere
        </Link>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍
          </button>
        </form>
      </div>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>Products</Link>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/cart" style={styles.cartLink}>
          🛒 Cart
          {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </Link>
        <Link to="/orders" style={styles.link}>Orders</Link>

        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <div
            style={styles.userMenu}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div style={styles.userAvatar}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            {showDropdown && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem}>
                  <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                    Profile
                  </Link>
                </div>
                <div
                  style={{ ...styles.dropdownItem, ...styles.dropdownItemLast }}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}

        <button
          style={styles.button}
          onClick={() => {
            toggleTheme();
            showAlert("Theme changed", "info");
          }}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
