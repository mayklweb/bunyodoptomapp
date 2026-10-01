import { storage } from "@/lib/secure-storage";
import { useCartStore } from "@/stores/cart.store";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: string;
  name: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;

  setAuth: (data: { token: string; user: User }) => void;

  setUser: (user: User) => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false,

      setAuth: ({ token, user }) => {
        useCartStore.getState().clearCart();

        set({
          token,
          user,
          isHydrated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
        });
      },

      clearAuth: () => {
        useCartStore.getState().clearCart();

        set({
          token: null,
          user: null,
          isHydrated: true,
        });
      },
    }),

    {
      name: "auth-storage",

      storage: createJSONStorage(() => storage),

      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
          }

          useAuthStore.setState({
            isHydrated: true,
          });
        };
      },
    },
  ),
);
