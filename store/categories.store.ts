import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCategoryStore = create()(
  persist(
    (set) => ({
      selectedCategoryId: null,
      setSelectedCategoryId: (id: number) => set({ selectedCategoryId: id }),
      clearSelectedCategoryId: () => set({ selectedCategoryId: null }),
    }),
    {
      name: 'category-store',
    }
  )
);
