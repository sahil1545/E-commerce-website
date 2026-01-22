import { useEffect, useState } from "react";
import api from "../services/api";
import { useUI } from "../context/UiContext";
import SkeletonLoader from "../components/SkeletonLoader";

function Analytics() {
  const { theme, showAlert } = useUI();
  const [totalSales, setTotalSales] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [revenuePerDay, setRevenuePerDay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [totalRes, topRes, ordersRes, revenueRes] = await Promise.all([
          api.get("/api/analytics/total-sales"),
          api.get("/api/analytics/top-products"),
          api.get("/api/analytics/orders-per-day"),
          api.get("/api/analytics/revenue-per-day"),
        ]);

        setTotalSales(totalRes.data.total);
        setTopProducts(topRes.data);
        setOrdersPerDay(ordersRes.data);
        setRevenuePerDay(revenueRes.data);
      } catch {
        showAlert("Failed to load analytics", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [showAlert]);

  const styles = {
    page: {
      padding: "70px 30px 20px",
      minHeight: "100vh",
      background: theme === "dark" ? "#020617" : "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
      backgroundSize: theme === "dark" ? "auto" : "400% 400%",
      animation: theme === "dark" ? "none" : "gradientShift 15s ease infinite",
      color: theme === "dark" ? "white" : "black",
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
    metrics: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: 20,
      marginBottom: 40,
    },
    metricCard: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      padding: 25,
      borderRadius: 15,
      textAlign: "center",
      boxShadow: theme === "dark" ? "0 4px 15px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    metricValue: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#2563eb",
      marginBottom: 5,
    },
    metricLabel: {
      fontSize: "1rem",
      color: theme === "dark" ? "#e2e8f0" : "#666",
    },
    chartContainer: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      padding: 15,
      borderRadius: 15,
      marginBottom: 25,
      boxShadow: theme === "dark" ? "0 4px 15px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    chartTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: 20,
      color: theme === "dark" ? "white" : "#333",
    },
    chart: {
      display: "flex",
      alignItems: "end",
      gap: 10,
      height: 200,
      padding: "20px 0",
    },
    bar: {
      flex: 1,
      background: "#2563eb",
      borderRadius: "4px 4px 0 0",
      position: "relative",
      transition: "all 0.3s",
    },
    barLabel: {
      position: "absolute",
      top: -25,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "0.8rem",
      color: theme === "dark" ? "white" : "#333",
      whiteSpace: "nowrap",
    },
    topProducts: {
      background: theme === "dark" ? "#1e293b" : "rgba(255, 255, 255, 0.25)",
      backdropFilter: theme === "dark" ? "none" : "blur(10px)",
      border: theme === "dark" ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      padding: 25,
      borderRadius: 15,
      boxShadow: theme === "dark" ? "0 4px 15px rgba(0,0,0,0.1)" : "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    productItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      borderBottom: "1px solid #e5e7eb",
    },
    productName: {
      fontSize: "1rem",
      fontWeight: "600",
      color: theme === "dark" ? "white" : "#333",
    },
    productStats: {
      fontSize: "0.9rem",
      color: "#666",
    },
  };

  const renderBarChart = (data, valueKey, labelKey = 'date') => {
    const maxValue = Math.max(...data.map(d => d[valueKey]));
    return (
      <div style={styles.chart}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.bar,
              height: `${(item[valueKey] / maxValue) * 100}%`,
              minHeight: "10px",
            }}
          >
            <div style={styles.barLabel}>
              {valueKey === 'revenue' ? `₹${item[valueKey]}` : item[valueKey]}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Analytics Dashboard</h1>
        </div>
        <div style={styles.metrics}>
          <SkeletonLoader type="card" count={4} />
        </div>
        <SkeletonLoader type="analytics" count={2} />
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
        <div style={styles.header}>
          <h1 style={styles.title}>Analytics Dashboard</h1>
        </div>

        <div style={styles.metrics}>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>₹{totalSales.toLocaleString()}</div>
            <div style={styles.metricLabel}>Total Sales</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{ordersPerDay.reduce((sum, d) => sum + d.count, 0)}</div>
            <div style={styles.metricLabel}>Total Orders</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{topProducts.length}</div>
            <div style={styles.metricLabel}>Products Sold</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>
              ₹{(revenuePerDay.reduce((sum, d) => sum + d.revenue, 0) / Math.max(ordersPerDay.length, 1)).toFixed(0)}
            </div>
            <div style={styles.metricLabel}>Avg Order Value</div>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Orders Per Day (Last 30 Days)</h3>
          {renderBarChart(ordersPerDay, 'count')}
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Revenue Per Day (Last 30 Days)</h3>
          {renderBarChart(revenuePerDay, 'revenue')}
        </div>

        <div style={styles.topProducts}>
          <h3 style={styles.chartTitle}>Top Products</h3>
          {topProducts.map((product, index) => (
            <div key={product.id} style={styles.productItem}>
              <div style={styles.productName}>
                {index + 1}. {product.name}
              </div>
              <div style={styles.productStats}>
                {product.totalQuantity} sold • ₹{product.totalRevenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Analytics;