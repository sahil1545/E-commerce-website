import express from "express";
import Order from "../modules/Order.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

// ✅ CREATE ORDER (Cart + Buy Now)
router.post("/", fetchUser, async (req, res) => {
  try {
    const { items, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: "No items" });
    }

    const order = await Order.createOrder({
      user_id: req.user.id,
      items,
      payment_status: "SUCCESS",
      payment_method: payment_method || "COD",
    });

    // ✅ ALWAYS return success true
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({
      success: false,
      error: "Order creation failed",
    });
  }
});






// GET user orders
router.get("/", fetchUser, async (req, res) => {
  try {
    const orders = await Order.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { delivery_status } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ delivery_status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default router;
