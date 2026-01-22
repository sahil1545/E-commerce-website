import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/Authcontext";
import { useUI } from "../context/UiContext";

export default function useOrderActions() {
  const { user } = useAuth();
  const { showAlert } = useUI();
  const navigate = useNavigate();

  const [isPlacing, setIsPlacing] = useState(false);

  const placeOrder = async (productId, quantity = 1) => {
    
    if (isPlacing) return;

    if (!user) {
      showAlert("Please login to place order", "info");
      navigate("/login");
      return;
    }

    setIsPlacing(true);

    try {
      const res = await api.post("/api/orders", {
        items: [
          {
            product_id: productId,
            quantity,
          },
        ],
      });

      if (res?.data) {
        showAlert("Order placed successfully 🎉", "success");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order placement error:", error.response?.data || error.message);
      // ❗ only show error if NO order was created
      const errorMessage = error.response?.data?.error || "Failed to place order";
      showAlert(errorMessage, "error");
    } finally {
      setIsPlacing(false);
    }
  };

  return { placeOrder, isPlacing };
}
