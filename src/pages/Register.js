import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useUI } from "../context/UiContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const { showAlert } = useUI();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(email, password);
      showAlert("Account created successfully", "success");
      navigate("/login");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>Register</h2>

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
        onClick={handleRegister}
        style={{ width: "100%", padding: 12 }}
      >
        Register
      </button>
    </div>
  );
}

export default Register;
