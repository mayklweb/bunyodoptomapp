import { api } from "./api";

export const getAllProducts = async (params?: {
  offset?: number;
  limit?: number;
  category_id?: string | number;
  all?: boolean;
}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getProduct = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
