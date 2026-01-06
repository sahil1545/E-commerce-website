import express from "express";
const router = express.Router();

// Health check
router.get("/status", (req, res) => {
  res.json({ success: true, message: "Auth route working" });
});

export default router;
