import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import { useAuth } from "../context/Authcontext";
import PaymentModal from "../components/PaymentModal";
import OrderConfirmModal from "../components/OrderConfirmModal";

function ProductDetails() {
  const { id } = useParams();
  const { theme, showAlert } = useUI();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Dummy variants data
  const colors = ["Black", "White", "Blue", "Red", "Green"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      const productData = res.data;

      setProduct(productData);

      // ✅ Set default variants safely from product data
      if (productData.colors?.length) {
        setSelectedColor(productData.colors[0]);
      }

      if (productData.sizes?.length) {
        setSelectedSize(productData.sizes[0]);
      }

      // ✅ Fetch related products
      if (productData.category) {
        const relatedRes = await api.get("/api/products", {
          params: { category: productData.category, limit: 4 }
        });

        setRelatedProducts(
          relatedRes.data.filter(p => p.id !== productData.id)
        );
      }
    } catch {
      showAlert("Failed to load product", "error");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id, navigate, showAlert]);


  const handleAddToCart = async () => {
    if (!user) {
      showAlert("Please login first", "info");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/cart", {
        product_id: product.id,
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
      padding: "70px 20px 20px",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      background: theme === "dark" ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      alignItems: "center",
    },
    imageContainer: {
      textAlign: "center",
      position: "relative",
    },
    image: {
      width: "100%",
      maxWidth: "400px",
      height: "400px",
      objectFit: "cover",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: "transform 0.3s",
      cursor: "zoom-in",
    },
    imageZoom: {
      transform: "scale(1.1)",
    },
    thumbnails: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      marginTop: "15px",
      flexWrap: "wrap",
    },
    thumbnail: {
      width: "60px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "8px",
      cursor: "pointer",
      border: "2px solid transparent",
      transition: "border 0.3s",
    },
    thumbnailSelected: {
      border: "2px solid #2563eb",
    },
    stock: {
      fontSize: "1rem",
      fontWeight: "600",
      color: product?.stock > 0 ? "#10b981" : "#ef4444",
      margin: "10px 0",
    },
    skuBrand: {
      fontSize: "0.9rem",
      color: theme === "dark" ? "#e2e8f0" : "#666",
      margin: "5px 0",
    },
    relatedSection: {
      marginTop: "60px",
      textAlign: "center",
    },
    relatedTitle: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: theme === "dark" ? "white" : "#333",
    },
    relatedGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
    },
    relatedCard: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.9)",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "transform 0.3s",
    },
    relatedImg: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
    },
    relatedContent: {
      padding: "15px",
    },
    relatedName: {
      fontSize: "1rem",
      fontWeight: "600",
      margin: "0 0 5px 0",
      color: theme === "dark" ? "white" : "#333",
    },
    relatedPrice: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#2563eb",
      margin: 0,
    },
    details: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: 0,
      color: theme === "dark" ? "white" : "#333",
    },
    price: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#2563eb",
      margin: 0,
    },
    description: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: theme === "dark" ? "#e2e8f0" : "#666",
      margin: 0,
    },
    variants: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    variantGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    variantLabel: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: theme === "dark" ? "white" : "#333",
    },
    colorOptions: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    colorOption: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      border: "3px solid transparent",
      cursor: "pointer",
      transition: "border 0.3s",
    },
    sizeOptions: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    sizeOption: {
      padding: "10px 15px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      background: "transparent",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s",
    },
    selected: {
      border: "2px solid #2563eb",
      background: "#2563eb",
      color: "white",
    },
    actions: {
      display: "flex",
      gap: "15px",
      marginTop: "20px",
    },
    addToCartBtn: {
      flex: 1,
      padding: "15px 25px",
      border: "none",
      borderRadius: "10px",
      background: "#16a34a",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    buyNowBtn: {
      flex: 1,
      padding: "15px 25px",
      border: "none",
      borderRadius: "10px",
      background: "#2563eb",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    backBtn: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      background: "#6b7280",
      color: "white",
      cursor: "pointer",
      marginBottom: "20px",
      alignSelf: "flex-start",
    },
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "1.2rem" }}>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ ...styles.page, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "1.2rem" }}>Product not found</p>
      </div>
    );
  }

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
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div style={styles.container}>
          <div style={styles.imageContainer}>
            <img
              src={product.image_urls ? product.image_urls[selectedImage] : product.image_url}
              alt={product.name}
              style={styles.image}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            />
            {product.image_urls && product.image_urls.length > 1 && (
              <div style={styles.thumbnails}>
                {product.image_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      ...styles.thumbnail,
                      ...(selectedImage === index ? styles.thumbnailSelected : {}),
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={styles.details}>
            <h1 style={styles.title}>{product.name}</h1>
            <p style={styles.price}>₹{product.price}</p>
            <p style={styles.stock}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
            {product.sku && <p style={styles.skuBrand}>SKU: {product.sku}</p>}
            {product.brand && <p style={styles.skuBrand}>Brand: {product.brand}</p>}
            <p style={styles.description}>
              {product.description || "This is a high-quality product from our collection. Experience premium quality and excellent value for money. Perfect for your everyday needs."}
            </p>

            <div style={styles.variants}>
              <div style={styles.variantGroup}>
                <label style={styles.variantLabel}>Color:</label>
                <div style={styles.colorOptions}>
                  {colors.map((color) => (
                    <div
                      key={color}
                      style={{
                        ...styles.colorOption,
                        background: color.toLowerCase(),
                        border: selectedColor === color ? "3px solid #2563eb" : "3px solid transparent",
                      }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div style={styles.variantGroup}>
                <label style={styles.variantLabel}>Size:</label>
                <div style={styles.sizeOptions}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      style={{
                        ...styles.sizeOption,
                        ...(selectedSize === size ? styles.selected : {}),
                      }}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.addToCartBtn} onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button
                style={styles.buyNowBtn}
                disabled={placing}
                onClick={() => setShowConfirm(true)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={styles.relatedSection}>
            <h2 style={styles.relatedTitle}>Related Products</h2>
            <div style={styles.relatedGrid}>
              {relatedProducts.map((related) => (
                <div
                  key={related.id}
                  style={styles.relatedCard}
                  onClick={() => navigate(`/product/${related.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <img
                    src={related.image_url}
                    alt={related.name}
                    style={styles.relatedImg}
                  />
                  <div style={styles.relatedContent}>
                    <h3 style={styles.relatedName}>{related.name}</h3>
                    <p style={styles.relatedPrice}>₹{related.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <OrderConfirmModal
          open={showConfirm}
          product={product}
          theme={theme}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            setShowPayment(true);
          }}
        />

        <PaymentModal
          open={showPayment}
          total={product.price}
          onClose={() => setShowPayment(false)}
          onSuccess={async (method) => {
            try {
              setPlacing(true);

              await api.post("/api/orders", {
                items: [
                  {
                    product_id: product.id,
                    quantity: 1,
                    price: product.price,
                  },
                ],
                payment_method: method,
              });

              showAlert("Payment successful! Order completed 🎉", "success");
              navigate("/orders");
            } catch {
              showAlert("Payment failed", "error");
            } finally {
              setPlacing(false);
              setShowPayment(false);
            }
          }}
        />
      </div>
    </>
  );
}

export default ProductDetails;