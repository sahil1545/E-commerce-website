import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useUI } from "../context/UiContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showAlert, theme } = useUI();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      showAlert("Login successful", "success");
      navigate("/");
    } catch (err) {
      showAlert(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      backgroundSize: theme === "dark" ? "auto" : "400% 400%",
      animation: theme === "dark" ? "none" : "gradientShift 15s ease infinite",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
    },
    card: {
      background: theme === "dark" ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "30px 20px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      position: "relative",
      overflow: "hidden",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "30px",
      color: theme === "dark" ? "white" : "#333",
    },
    inputGroup: {
      marginBottom: "20px",
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "15px 20px",
      border: "2px solid transparent",
      borderRadius: "12px",
      fontSize: "16px",
      background: theme === "dark" ? "rgba(51, 65, 85, 0.8)" : "rgba(255, 255, 255, 0.8)",
      color: theme === "dark" ? "white" : "#333",
      outline: "none",
      transition: "all 0.3s",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
    },
    passwordInput: {
      paddingRight: "50px",
    },
    togglePassword: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: theme === "dark" ? "#e2e8f0" : "#666",
      cursor: "pointer",
      fontSize: "18px",
    },
    error: {
      color: "#ef4444",
      fontSize: "14px",
      marginTop: "5px",
      marginLeft: "5px",
    },
    button: {
      width: "100%",
      padding: "15px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      marginBottom: "20px",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    link: {
      textAlign: "center",
      color: theme === "dark" ? "#e2e8f0" : "#666",
      fontSize: "14px",
    },
    linkAnchor: {
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "600",
    },
  };

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
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome Back</h1>

          <div style={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Email address"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "transparent"}
            />
            {errors.email && <div style={styles.error}>{errors.email}</div>}
          </div>

          <div style={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              style={{ ...styles.input, ...styles.passwordInput }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "transparent"}
            />
            <button
              type="button"
              style={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && <div style={styles.error}>{errors.password}</div>}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div style={styles.link}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.linkAnchor}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
