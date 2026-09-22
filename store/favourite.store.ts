import { ProductsType } from "@/types/index";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoriteState {
  favorites: ProductsType[];
  addFavorite: (product: ProductsType) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: ProductsType) => void;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      // ➕ Add
      addFavorite: (product) => {
        if (!product?.id) return;

        const exists = get().favorites.some((p) => p.id === product.id);

        if (exists) return;

        set((state) => ({
          favorites: [...state.favorites, product],
        }));
      },

      // ❌ Remove
      removeFavorite: (id) => {
        if (!id) return;

        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== id),
        }));
      },

      // 🔄 Toggle
      toggleFavorite: (product) => {
        if (!product?.id) return;

        const exists = get().favorites.some((p) => p.id === product.id);

        if (exists) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },

      // ❤️ Check
      isFavorite: (id) => {
        if (!id) return false;

        return get().favorites.some((p) => p.id === id);
      },

      // 🧹 Clear
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),

      // 🧹 cleanup corrupted data
      onRehydrateStorage: () => (state) => {
        if (state?.favorites) {
          state.favorites = state.favorites.filter(
            (p) => p && typeof p === "object" && p.id,
          );
        }
      },
    },
  ),
);
