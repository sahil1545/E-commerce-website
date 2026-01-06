import supabase from "../config/supabase.js";

const getAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;
  return data;
};

const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

const addProduct = async (product) => {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const deleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export default {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct
};
