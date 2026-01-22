import supabase from "../config/supabase.js";

const getCartItems = async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

const addToCart = async (item) => {
  // Check if item already exists in cart
  const { data: existing, error: fetchError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", item.user_id)
    .eq("product_id", item.product_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
    throw fetchError;
  }

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + (item.quantity || 1) })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

const updateQuantity = async (cartId, userId, quantity) => {
  const { data, error } = await supabase
    .from("cart_items")      // ✅ CORRECT TABLE NAME
    .update({ quantity })
    .eq("id", cartId)
    .eq("user_id", userId)   // 🔒 SECURITY
    .select()
    .single();

  if (error) throw error;
  return data;
};




const updateCartItem = async (id, quantity) => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const removeFromCart = async (id) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export default {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  updateQuantity,
};
