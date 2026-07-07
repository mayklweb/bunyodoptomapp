import { api } from './api';

export const addressApi = {
  get: async () => {
    const { data } = await api.get('/addresses');
    return data.data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/addresses', payload);
    return data.data;
  },

  update: async (id: number, payload: any) => {
    const { data } = await api.put(`/addresses/${id}`, payload);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/addresses/${id}`);
    return data.data;
  },
};
