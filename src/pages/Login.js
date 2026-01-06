import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useUI } from "../context/UiContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { showAlert } = useUI();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      showAlert("Login successful", "success");
      navigate("/");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>Login</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ width: "100%", padding: 12, marginBottom: 10 }}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ width: "100%", padding: 12, marginBottom: 10 }}
      />

      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: 12 }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
