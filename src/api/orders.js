import api from "./client";

export const createOrder = (data) => api.post("/orders", data);
export const getOrders = () => api.get("/orders");
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
export const getConfirmedOrders = () => api.get("/orders/confirmed");

// Public multi-item checkout
export const createPublicOrder = (data) => api.post("/public/orders", data);
