import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import User from "../modules/User.js";

const router = express.Router();

/**
 * GET current logged-in user profile
 * GET /api/users/me
 */
router.get("/me", fetchUser, async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * UPDATE current user profile
 * PUT /api/users/me
 */
router.put("/me", fetchUser, async (req, res) => {
  try {
    const updatedUser = await User.updateUser(
      req.user.id,
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
