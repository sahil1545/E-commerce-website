import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";

const categories = [
  { key: "electronics", label: "🔥 Electronics" },
  { key: "mobiles", label: "📱 Mobiles" },
  { key: "clothes", label: "👕 Clothes" },
  { key: "grocery", label: "🥦 Grocery" },
  { key: "toys", label: "🧸 Toys" },
  { key: "furniture", label: "🛋 Furniture" },
];

function Home() {
  const { theme, showAlert } = useUI();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [placing, setPlacing] = useState(false);


  // IMPORTANT: object keyed by category
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = {};

      for (const cat of categories) {
        try {
          const res = await api.get(
            `/api/products?category=${cat.key}`
          );

          // Store separately per category
          result[cat.key] = res.data.slice(0, 6);
        } catch (error) {
          result[cat.key] = [];
        }
      }

      setProductsByCategory(result);
    };

    fetchAllCategories();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      showAlert("Please login to add items to cart", "info");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/cart", {
        product_id: productId,
        quantity: 1,
      });
      showAlert("Added to cart", "success");
    } catch {
      showAlert("Failed to add to cart", "error");
    }
  };
  

  const styles = {
    page: {
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      backgroundSize: theme === "dark" ? "auto" : "400% 400%",
      animation: theme === "dark" ? "none" : "gradientShift 15s ease infinite",
      color: theme === "dark" ? "white" : "black",
      position: "relative",
    },
    banner: {
      background: "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
      color: "white",
      padding: "80px 30px",
      textAlign: "center",
      marginBottom: 60,
    },
    bannerTitle: {
      fontSize: "3rem",
      margin: "0 0 15px 0",
      fontWeight: "bold",
    },
    bannerSubtitle: {
      fontSize: "1.3rem",
      margin: 0,
      opacity: 0.9,
    },
    section: {
      padding: "0 30px 60px",
    },
    sectionTitle: {
      fontSize: "2rem",
      marginBottom: 30,
      textAlign: "center",
      color: theme === "dark" ? "white" : "#333",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 25,
    },
    card: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: theme === "dark" ? "0 8px 25px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
    },
    img: {
      width: "100%",
      height: 200,
      objectFit: "cover",
    },
    cardContent: {
      padding: 20,
    },
    productName: {
      fontSize: "1.1rem",
      fontWeight: "600",
      margin: "0 0 8px 0",
      color: theme === "dark" ? "white" : "#333",
    },
    productPrice: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#2563eb",
      margin: "0 0 15px 0",
    },
    cardActions: {
      display: "flex",
      gap: 10,
    },
    addToCartBtn: {
      flex: 1,
      padding: "10px 15px",
      border: "none",
      borderRadius: "8px",
      background: "#16a34a",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background 0.3s",
    },
    buyNowBtn: {
      flex: 1,
      padding: "10px 15px",
      border: "none",
      borderRadius: "8px",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
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
      {/* Banner */}
      <div style={styles.banner}>
        <h1 style={styles.bannerTitle}>Welcome to ShopSphere</h1>
        <p style={styles.bannerSubtitle}>Your one-stop shop for all your needs</p>
      </div>

      {categories.map((cat) => (
        <div key={cat.key} style={styles.section}>
          <h2 style={styles.sectionTitle}>{cat.label}</h2>

          <div style={styles.grid}>
            {(productsByCategory[cat.key] || []).length === 0 ? (
              <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>No products found</p>
            ) : (
              productsByCategory[cat.key].map((product) => (
                <div
                  key={product.id}
                  style={styles.card}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={styles.img}
                  />
                  <div style={styles.cardContent}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productPrice}>₹{product.price}</p>
                    <div style={styles.cardActions}>
                      <button
                        style={styles.addToCartBtn}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Add to Cart
                      </button>
                      <button
                        style={styles.buyNowBtn}
                        disabled={placing}
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowPayment(true);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      <PaymentModal
        open={showPayment}
        total={selectedProduct ? selectedProduct.price : 0}
        onClose={() => setShowPayment(false)}
        onSuccess={async (method) => {
          try {
            setPlacing(true);

            await api.post("/api/orders", {
              items: [
                {
                  product_id: selectedProduct.id,
                  quantity: 1,
                },
              ],
              payment_method: method,
            });

            showAlert("Payment successful! Order completed 🎉", "success");
            navigate("/orders");
          } catch (error) {
            console.error(error);
            showAlert("Payment failed", "error");
          } finally {
            setPlacing(false);
            setShowPayment(false);
            setSelectedProduct(null);
          }
        }}
      />
    </div>
    </>
  );
}

export default Home;
