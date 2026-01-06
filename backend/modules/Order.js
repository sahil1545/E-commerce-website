import supabase from "../config/supabase.js";

const createOrder = async (order) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export default {
  createOrder,
  getUserOrders
};
