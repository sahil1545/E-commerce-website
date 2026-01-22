import express from "express";
import Analytics from "../modules/Analytics.js";
import fetchUser from "../middleware/fetchUser.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// All analytics routes require admin access
router.use(fetchUser, isAdmin);

router.get("/total-sales", async (req, res) => {
  try {
    const total = await Analytics.getTotalSales();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/top-products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Analytics.getTopProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/orders-per-day", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await Analytics.getOrdersPerDay(days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/revenue-per-day", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await Analytics.getRevenuePerDay(days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;