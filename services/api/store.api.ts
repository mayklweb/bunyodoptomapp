import { api } from './api';

export const storeApi = {
  get: async () => {
    const { data } = await api.get('/markets');
    return data.data;
  },

  create: async (payload: any) => {
    const { data } = await api.post('/markets', payload);
    return data.data;
  },

  update: async (id: number, payload: any) => {
    const { data } = await api.put(`/markets/${id}`, payload);
    return data.data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/markets/${id}`);
    return data.data;
  },
};
