import express from "express";
import Product from "../modules/Product.js";
import fetchUser from "../middleware/fetchUser.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: "Product not found" });
  }
});

// ADD product (Admin)
router.post("/", fetchUser, isAdmin, async (req, res) => {
    //router.post("/", async (req, res) => {
  try {
    const product = await Product.addProduct(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE product (Admin)
router.delete("/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    await Product.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
