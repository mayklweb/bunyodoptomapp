import { ProductsType } from '@/types/types';
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  type: ToastType;
  message: string;
};

type UIState = {
  isModalOpen: boolean;
  isLoading: boolean;
  toast: Toast | null;
  selectedProduct: ProductsType | null;

  openModal: (product: ProductsType) => void;
  closeModal: () => void;

  setLoading: (value: boolean) => void;

  showToast: (toast: Toast) => void;
  clearToast: () => void;
};

export const useUIStore = create<UIState>()((set) => ({
  isModalOpen: false,
  isLoading: false,
  toast: null,
  selectedProduct: null,

  // 🪟 Modal
  openModal: (product) =>
    set({
      selectedProduct: product,
      isModalOpen: true,
    }),

  closeModal: () =>
    set({
      selectedProduct: null,
      isModalOpen: false,
    }),

  // ⏳ Loading
  setLoading: (value) => set({ isLoading: value }),

  // 🍞 Toast
  showToast: (toast) => set({ toast }),

  clearToast: () => set({ toast: null }),
}));
