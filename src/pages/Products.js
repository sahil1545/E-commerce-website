import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

function Products() {
  const { theme, showAlert } = useUI();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        showAlert("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showAlert]);

  // 🔥 ADD TO CART HANDLER
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

      showAlert("Product added to cart", "success");
    } catch (err) {
      showAlert("Failed to add to cart", "error");
    }
  };

  const styles = {
    page: {
      padding: 30,
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "#f4f6f8",
      color: theme === "dark" ? "white" : "black",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: 20,
    },
    card: {
      background: theme === "dark" ? "#1e293b" : "white",
      padding: 15,
      borderRadius: 10,
      boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    },
    img: {
      width: "100%",
      height: 180,
      objectFit: "cover",
      borderRadius: 8,
    },
    button: {
      marginTop: 10,
      width: "100%",
      padding: 10,
      border: "none",
      borderRadius: 6,
      background: "#16a34a",
      color: "white",
      cursor: "pointer",
    },
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Loading products...</p>;
  }

  return (
    <div style={styles.page}>
      <h2>Products</h2>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <img
                style={styles.img}
                src={product.image_url}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>

              <button
                style={styles.button}
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
