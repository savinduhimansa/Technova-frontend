// src/api/product.js
import api from "./client";

// ✅ Always normalize to array
export const getProductsList = async (params) => {
  const res = await api.get("/product", { params }); // singular
  return res?.data?.data ?? [];
};
