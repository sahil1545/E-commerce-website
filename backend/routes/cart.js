import express from "express";
import Cart from "../modules/Cart.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

// GET user cart
router.get("/", fetchUser, async (req, res) => {
  try {
    const cart = await Cart.getCartItems(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD to cart
router.post("/", fetchUser, async (req, res) => {
  try {
    const item = await Cart.addToCart({
      user_id: req.user.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity || 1,
    });
    res.json(item);
  } 
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE cart item quantity
router.put("/:id", fetchUser, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({
        error: "Invalid quantity",
      });
    }

    const updated = await Cart.updateQuantity(
      req.params.id,
      req.user.id,
      quantity
    );

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});


   



// UPDATE cart item quantity
router.put("/:id", fetchUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);
    if (!qty || qty < 1 || !Number.isInteger(qty)) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }

    const updatedItem = await Cart.updateQuantity(req.params.id, req.user.id, qty);
    res.json(updatedItem);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(400).json({ error: error.message });
  }
});

// REMOVE from cart
router.delete("/:id", fetchUser, async (req, res) => {
  try {
    await Cart.removeFromCart(req.params.id);
    res.json({ success: true });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", fetchUser, async (req, res) => {
  console.log("ADD TO CART BODY:", req.body);
  console.log("USER ID:", req.user.id);

  try {
    const item = await Cart.addToCart({
      user_id: req.user.id,
      product_id: req.body.product_id,
      quantity: req.body.quantity || 1,
    });
    res.json(item);
  } catch (error) {
    console.error("CART ERROR:", error.message);
    res.status(400).json({ error: error.message });
  }
});


export default router;
