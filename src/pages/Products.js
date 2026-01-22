import { useEffect, useState, useRef} from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import { useAuth } from "../context/Authcontext";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import OrderConfirmModal from "../components/OrderConfirmModal";
import PromoCarousel from "../components/PromoCarousel";
import LazyImage from "../components/LazyImage";
import SkeletonLoader from "../components/SkeletonLoader";
import { Link } from "react-router-dom";

function Products() {
  const { theme, showAlert } = useUI();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // UI states
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [placing, setPlacing] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const LIMIT = 12;

  /* 🔁 RESET PAGE WHEN FILTERS CHANGE */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, minPrice, maxPrice]);

  /* SET SEARCH FROM URL PARAM */
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchParams]);

  /* DEBOUNCE SEARCH */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* LOAD RECENT SEARCHES */
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  /* FETCH SUGGESTIONS */
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await api.get("/api/products/suggestions", {
          params: { search: debouncedSearch }
        });
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearch]);

  /* 📦 FETCH PRODUCTS (SINGLE SOURCE OF TRUTH) */
  const lastFetchRef = useRef({});

 useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products", {
        params: {
          search,
          minPrice,
          maxPrice,
          page,
          limit: LIMIT,
        },
      });

      const data = Array.isArray(res.data) ? res.data : [];

      setProducts((prev) => {
        const merged = page === 1 ? data : [...prev, ...data];
        return Array.from(
          new Map(merged.map((p) => [p.id, p])).values()
        );
      });

    } catch (err) {
      console.error("Product fetch error:", err);
      showAlert("Failed to load products", "error");
      setProducts([]); // ⛑ safety fallback
    }
  };

  loadProducts();
}, [page, search, minPrice, maxPrice, showAlert]);

       

  /* 🛒 ADD TO CART */
  const handleAddToCart = async (productId) => {
    if (!user) {
      showAlert("Please login first", "info");
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

  /* PROMO BANNERS */
  const banners = [
    {
      image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      title: "Mega Sale",
      subtitle: "Up to 70% Off on Electronics",
      badge: "LIMITED TIME",
    },
    {
      image_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop",
      title: "Fashion Fiesta",
      subtitle: "Trendy Clothes at Best Prices",
      badge: "NEW ARRIVALS",
    },
    {
      image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      title: "Home & Kitchen",
      subtitle: "Everything You Need for Your Home",
      badge: "FREE SHIPPING",
    },
    {
      image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
      title: "Electronics Hub",
      subtitle: "Latest Gadgets & Accessories",
      badge: "UP TO 50% OFF",
    },
  ];

  /* 🎨 STYLES */
  const styles = {
    page: {
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      backgroundSize: theme === "dark" ? "auto" : "400% 400%",
      animation: theme === "dark" ? "none" : "gradientShift 15s ease infinite",
      color: theme === "dark" ? "white" : "black",
      position: "relative",
      paddingTop: "70px",
    },
    hero: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "60px 30px",
      textAlign: "center",
      marginBottom: 40,
    },
    heroTitle: {
      fontSize: "2.5rem",
      margin: "0 0 10px 0",
      fontWeight: "bold",
    },
    heroSubtitle: {
      fontSize: "1.2rem",
      margin: 0,
      opacity: 0.9,
    },
    filters: {
      display: "flex",
      gap: 10,
      marginBottom: 30,
      justifyContent: "center",
      flexWrap: "wrap",
      padding: "0 10px",
    },
    filterInput: {
      padding: "12px 15px",
      border: "1px solid #ddd",
      borderRadius: "25px",
      outline: "none",
      fontSize: "14px",
      background: theme === "dark" ? "#1e293b" : "white",
      color: theme === "dark" ? "white" : "black",
      minWidth: "150px",
    },
    searchContainer: {
      position: "relative",
    },
    suggestionsDropdown: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: theme === "dark" ? "#1e293b" : "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      zIndex: 1000,
      maxHeight: "200px",
      overflowY: "auto",
    },
    suggestionItem: {
      padding: "10px 15px",
      cursor: "pointer",
      borderBottom: "1px solid #eee",
      color: theme === "dark" ? "white" : "black",
    },
    suggestionItemHover: {
      background: theme === "dark" ? "#334155" : "#f8f9fa",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: 20,
      padding: "0 15px",
      marginBottom: 40,
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
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
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
    loadMoreBtn: {
      display: "block",
      margin: "0 auto 40px",
      padding: "12px 30px",
      border: "none",
      borderRadius: "25px",
      background: "#2563eb",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    footer: {
      background: theme === "dark" ? "#1e293b" : "#2d3748",
      color: "white",
      padding: "40px 30px 20px",
      marginTop: "60px",
    },
    footerContent: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "30px",
      marginBottom: "30px",
    },
    footerSection: {
      display: "flex",
      flexDirection: "column",
    },
    footerTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      margin: "0 0 15px 0",
      color: "#ffffff",
    },
    footerText: {
      fontSize: "0.9rem",
      lineHeight: "1.6",
      margin: "0 0 10px 0",
      color: "#e2e8f0",
    },
    socialLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    socialLink: {
      color: "#e2e8f0",
      textDecoration: "none",
      fontSize: "0.9rem",
      transition: "color 0.3s",
    },
    footerLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    footerLink: {
      color: "#e2e8f0",
      textDecoration: "none",
      fontSize: "0.9rem",
      transition: "color 0.3s",
    },
    footerBottom: {
      borderTop: "1px solid #4a5568",
      paddingTop: "20px",
      textAlign: "center",
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
      {/* Hero Banner */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Discover Amazing Products</h1>
        <p style={styles.heroSubtitle}>Find the best deals on electronics, fashion, and more</p>
      </div>

      {/* Promo Carousel */}
      <PromoCarousel banners={banners} theme={theme} />

      {/* 🔍 FILTERS */}
      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={styles.filterInput}
          />
          {showSuggestions && (suggestions.length > 0 || (search === "" && recentSearches.length > 0)) && (
            <ul style={styles.suggestionsDropdown}>
              {search !== "" ? (
                suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={styles.suggestionItem}
                    onMouseEnter={(e) => e.target.style.background = styles.suggestionItemHover.background}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                    onClick={() => {
                      setSearch(suggestion);
                      setShowSuggestions(false);
                      const updated = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
                      setRecentSearches(updated);
                      localStorage.setItem("recentSearches", JSON.stringify(updated));
                    }}
                  >
                    {suggestion}
                  </li>
                ))
              ) : (
                recentSearches.map((recent, index) => (
                  <li
                    key={index}
                    style={styles.suggestionItem}
                    onMouseEnter={(e) => e.target.style.background = styles.suggestionItemHover.background}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                    onClick={() => {
                      setSearch(recent);
                      setShowSuggestions(false);
                    }}
                  >
                    {recent}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={styles.filterInput}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      {/* 🧱 PRODUCTS GRID */}
      <div style={styles.grid}>
        {loading ? (
          <SkeletonLoader type="productCard" count={12} />
        ) : (
           Array.isArray(products) &&
           products.map((product) => (
           <div
              key={product.id}
              style={styles.card}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <LazyImage
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    style={styles.buyNowBtn}
                    disabled={placing}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setShowConfirm(true);
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

      {/* ⬇ LOAD MORE */}
      {hasMore && (
        <button
          style={styles.loadMoreBtn}
          onClick={() => setPage((p) => p + 1)}
        >
          Load More Products
        </button>
      )}

      {/* ✅ ORDER CONFIRM */}
      <OrderConfirmModal
        open={showConfirm}
        product={selectedProduct}
        theme={theme}
        onClose={() => {
          setShowConfirm(false);
          setSelectedProduct(null);
        }}
        onConfirm={() => {
          setShowConfirm(false);
          setShowPayment(true);
        }}
      />

      {/* 💳 PAYMENT */}
      <PaymentModal
        open={showPayment}
        total={selectedProduct ? selectedProduct.price : 0}
        onClose={() => {
          setShowPayment(false);
          setSelectedProduct(null);
        }}
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
          } catch {
            showAlert("Payment failed", "error");
          } finally {
            setPlacing(false);
            setShowPayment(false);
            setSelectedProduct(null);
          }
        }}
      />

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>ShopSphere</h3>
            <p style={styles.footerText}>
              Your ultimate destination for quality products at unbeatable prices.
              Discover amazing deals on electronics, fashion, home essentials, and more.
            </p>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Contact Us</h4>
            <p style={styles.footerText}>
              Email: support@shopsphere.com<br />
              Phone: +91 98765 43210<br />
              Address: 123 Shopping Street, E-commerce City, India
            </p>
          </div>
          

<div style={styles.footerSection}>
  <h4 style={styles.footerTitle}>Follow Us</h4>

  <div style={styles.socialLinks}>
    <a
      href="https://www.instagram.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={styles.socialLink}
    >
      📷 Instagram
    </a>

    <a
      href="https://twitter.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={styles.socialLink}
    >
      🐦 Twitter / X
    </a>

    <a
      href="https://www.facebook.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={styles.socialLink}
    >
      📘 Facebook
    </a>
  </div>
</div>

<div style={styles.footerSection}>
  <h4 style={styles.footerTitle}>Quick Links</h4>

  <div style={styles.footerLinks}>
    <Link to="/" style={styles.footerLink}>
      About Us
    </Link>

    <Link to="/" style={styles.footerLink}>
      Privacy Policy
    </Link>

    <Link to="/" style={styles.footerLink}>
      Terms of Service
    </Link>

    <Link to="/" style={styles.footerLink}>
      Return Policy
    </Link>
  </div>
</div>


        <div style={styles.footerBottom}>
          <p style={styles.footerText}>
            © 2024 ShopSphere. All rights reserved. | Made with ❤️ in India
          </p>
        </div>
        </div>
      </footer>
    </div>

    </>
  );
}

export default Products;
