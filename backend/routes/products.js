import express from "express";
import Product from "../modules/Product.js";
import fetchUser from "../middleware/fetchUser.js";
import isAdmin from "../middleware/isAdmin.js";
import supabase from "../config/supabase.js";

const router = express.Router();

// GET all products with filters, pagination
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const offset = (page - 1) * limit;

    let query = supabase.from("products").select("*");

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    if (category) {
      query = query.eq("category", category);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET search suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const { search } = req.query;
    if (!search || search.length < 2) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from("products")
      .select("name")
      .ilike("name", `%${search}%`)
      .limit(10);

    if (error) throw error;
    res.json(data.map(p => p.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);
    res.json(product);
  } catch {
    res.status(404).json({ error: "Product not found" });
  }
});

// ADD product (Admin)
router.post("/", fetchUser, isAdmin, async (req, res) => {
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
