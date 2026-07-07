import { api } from './api/api';

export const loginRequest = async (phone: string, password: string) => {
  const { data } = await api.post('/users/login', {
    phone,
    password,
  });

  return data;
};

export const signupRequest = async (name: string, phone: string, password: string) => {
  const { data } = await api.post('/users/signup', { name, phone, password });
  return data;
};