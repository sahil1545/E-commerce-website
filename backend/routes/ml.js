import express from "express";
import Recommendation from "../modules/Recommendation.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

router.get("/recommendations", fetchUser, async (req, res) => {
  try {
    const data = await Recommendation.getRecommendations(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "ML service error" });
  }
});

export default router;
