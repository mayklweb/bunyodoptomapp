import { ProductsType } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favorites: ProductsType[];
  addFavorite: (product: ProductsType) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (product: ProductsType) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
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
