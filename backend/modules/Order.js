import supabase from "../config/supabase.js";

const createOrder = async ({
  user_id,
  items,
  payment_status,
  payment_method,
}) => {
  // 1️⃣ Fetch products (price is REQUIRED)
  const productIds = items.map((i) => i.product_id);

  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (productError) throw productError;

  // 2️⃣ Calculate total price
  let total_price = 0;

  const orderItems = items.map((item) => {
    const product = products.find(
      (p) => p.id === item.product_id
    );

    if (!product) {
      throw new Error("Product not found");
    }

    total_price += product.price * item.quantity;

    return {
      product_id: item.product_id,
      quantity: item.quantity,
      price: product.price, // ✅ FIX HERE
    };
  });

  // 3️⃣ Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id,
      total_price,
      status: "PLACED",
      delivery_status: "PLACED",
      payment_status,
      payment_method,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 4️⃣ Insert order items (WITH PRICE)
  const itemsWithOrderId = orderItems.map((i) => ({
    ...i,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);

  if (itemsError) throw itemsError;

  return order;
};

const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_price,
      status,
      delivery_status,
      payment_method,
      payment_status,
      created_at,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          image_url
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export default {
  createOrder,
  getUserOrders,
};
