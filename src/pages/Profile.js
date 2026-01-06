import { useAuth } from "../context/Authcontext";
import { useUI } from "../context/UiContext";

function Profile() {
  const { user } = useAuth();
  const { theme } = useUI();

  if (!user) return null;

  const styles = {
    page: {
      padding: 30,
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "#f4f6f8",
      color: theme === "dark" ? "white" : "black",
    },
    card: {
      maxWidth: 500,
      margin: "0 auto",
      background: theme === "dark" ? "#1e293b" : "white",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    },
    label: {
      opacity: 0.7,
      marginTop: 10,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Profile</h2>

        <p style={styles.label}>Email</p>
        <p>{user.email}</p>

        <p style={styles.label}>User ID</p>
        <p>{user.id}</p>

        <p style={styles.label}>Account Created</p>
        <p>
          {new Date(user.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default Profile;
