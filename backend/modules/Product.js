import supabase from "../config/supabase.js";

const getAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;
  return data;
};

const getProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category);

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
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const searchAndFilterProducts = async ({
  search,
  minPrice,
  maxPrice,
  limit,
  offset,
}) => {
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

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};


const deleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

export default {
  getAllProducts,
  getProductsByCategory, // ✅ IMPORTANT
  getProductById,
  addProduct,
  searchAndFilterProducts,
  deleteProduct,
};
