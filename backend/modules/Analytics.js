import supabase from "../config/supabase.js";

const getTotalSales = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("total_price");

  if (error) throw error;

  const total = data.reduce((sum, order) => sum + order.total_price, 0);
  return total;
};

const getTopProducts = async (limit = 10) => {
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      product_id,
      quantity,
      products (
        name,
        price
      )
    `);

  if (error) throw error;

  const productSales = {};
  data.forEach(item => {
    if (!productSales[item.product_id]) {
      productSales[item.product_id] = {
        name: item.products.name,
        totalQuantity: 0,
        totalRevenue: 0,
      };
    }
    productSales[item.product_id].totalQuantity += item.quantity;
    productSales[item.product_id].totalRevenue += item.quantity * item.products.price;
  });

  return Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
};

const getOrdersPerDay = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at")
    .gte("created_at", startDate.toISOString());

  if (error) throw error;

  const ordersByDay = {};
  data.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    ordersByDay[date] = (ordersByDay[date] || 0) + 1;
  });

  return Object.entries(ordersByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const getRevenuePerDay = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_price")
    .gte("created_at", startDate.toISOString());

  if (error) throw error;

  const revenueByDay = {};
  data.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    revenueByDay[date] = (revenueByDay[date] || 0) + order.total_price;
  });

  return Object.entries(revenueByDay)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export default {
  getTotalSales,
  getTopProducts,
  getOrdersPerDay,
  getRevenuePerDay,
};