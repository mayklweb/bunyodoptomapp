import { api } from '@/services/api/api';
import { create } from 'zustand';

export interface ProductsType {
  id: number;
  category_id: number;

  name: string;
  slug: string;

  price: number;

  kg_price: number;
  piece_price: number;

  kg: number;
  piece: number;

  stock_qty: number;

  description: string;

  status: string;

  created_at: string;
  updated_at: string;

  brand_id: number;

  images: {
    url: string;
  }[];
}

type ProductsState = {
  products: ProductsType[];

  loading: boolean;

  error: string | null;

  fetchProducts: () => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],

  loading: false,

  error: null,

  fetchProducts: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await api.get('/products');

      set({
        products: response.data,
      });
    } catch (e: any) {
      set({
        error: e?.response?.data?.message || 'Something went wrong',
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
