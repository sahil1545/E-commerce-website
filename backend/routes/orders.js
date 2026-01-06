import express from "express";
import Order from "../modules/Order.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

// CREATE order
router.post("/", fetchUser, async (req, res) => {
  try {
    const order = await Order.createOrder({
      user_id: req.user.id,
      total_price: req.body.total_price,
      status: "PLACED",
    });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
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

export default router;
