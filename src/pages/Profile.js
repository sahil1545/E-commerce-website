import { useAuth } from "../context/Authcontext";
import { useUI } from "../context/UiContext";

function Profile() {
  const { user } = useAuth();
  const { theme } = useUI();

  if (!user) return null;

  const styles = {
    page: {
      padding: "20px 30px",
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
    card: {
      maxWidth: 600,
      margin: "0 auto",
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      padding: 30,
      borderRadius: 15,
      boxShadow: theme === "dark" ? "0 8px 25px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    profileHeader: {
      textAlign: "center",
      marginBottom: 30,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem",
      fontWeight: "bold",
      margin: "0 auto 15px",
    },
    userName: {
      fontSize: "1.5rem",
      fontWeight: "600",
      margin: "0 0 5px 0",
      color: theme === "dark" ? "white" : "#333",
    },
    userEmail: {
      fontSize: "1rem",
      color: "#666",
      margin: 0,
    },
    infoSection: {
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: 15,
      color: theme === "dark" ? "white" : "#333",
    },
    infoItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      borderBottom: "1px solid #e5e7eb",
    },
    infoLabel: {
      fontSize: "1rem",
      color: "#666",
    },
    infoValue: {
      fontSize: "1rem",
      fontWeight: "500",
      color: theme === "dark" ? "white" : "#333",
    },
    editBtn: {
      marginTop: 20,
      padding: "12px 25px",
      border: "none",
      borderRadius: 25,
      background: "#2563eb",
      color: "white",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
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
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
      </div>
      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user.email.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.userName}>{user.email.split('@')[0]}</h2>
          <p style={styles.userEmail}>{user.email}</p>
        </div>

        <div style={styles.infoSection}>
          <h3 style={styles.sectionTitle}>Account Information</h3>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>User ID</span>
            <span style={styles.infoValue}>{user.id}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Email Address</span>
            <span style={styles.infoValue}>{user.email}</span>
          </div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Account Created</span>
            <span style={styles.infoValue}>
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <button style={styles.editBtn}>
          Edit Profile
        </button>
      </div>
    </div>
    </>
  );
}

export default Profile;
