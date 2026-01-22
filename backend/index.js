import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import { startDeliverySimulator } from "./jobs/deliverySimulator.js";
import supportRoutes from "./routes/support.js";


const app = express();

app.use(cors());
app.use(express.json());
 
startDeliverySimulator();
app.get("/", (req, res) => {
  res.send("🚀 Backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/support", supportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
