import { storage } from "@/lib/secure-storage";
import { useCartStore } from "@/store/cart.store";
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

      setAuth: (data) => {
        // Har qanday yangi login/signup'da eski akkauntning savati
        // qolib ketmasligi uchun — bu yerda markazlashtirilgan,
        // shuning uchun kelajakda alohida chaqirishni unutib qo'yish xavfi yo'q
        useCartStore.getState().clearCart();

        set({
          token: data.token,
          user: data.user,
          isHydrated: true,
        });
      },

      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      clearAuth: () => {
        useCartStore.getState().clearCart();

        set({
          token: null,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.log("Hydration error:", error);
          }
          useAuthStore.setState({ isHydrated: true });
        };
      },
    },
  ),
);