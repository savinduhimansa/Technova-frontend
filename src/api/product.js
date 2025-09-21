import api from "./client";

export const getProducts = () => api.get("/products");
