import { api } from "./api";

export const ordersApi = {
  fetchAll: async () => {
    const { data } = await api.get("/orders");
    return data.data;
  },
  
  fetchById: async (id: number) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },
  
  checkout: async (payload: any) => {
    const { data } = await api.post("/orders/checkout", payload);
    return data.data;
  },
  
  cancel: async (id: number) => {
    const { data } = await api.post(`/orders/${id}/cancel`);
    return data.data;
  },
  
  updateStatus: async (id: number, payload: any) => {
    const { data } = await api.put(`/orders/${id}/status`, payload);
    return data.data;
  },
};