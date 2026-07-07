import { storage } from "@/lib/secure-storage";
import { ProductsType } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem extends ProductsType {
  count: number;
}

type CartState = {
  cart: CartItem[];
  selectedIds: (string | number)[];

  getQuantity: (id: string | number) => number;

  addToCart: (item: Omit<CartItem, "count">) => void;

  inc: (id: string | number) => void;
  dec: (id: string | number) => void;

  remove: (id: string | number) => void;
  clearCart: () => void;

  changeQty: (id: string | number, delta: number) => void;

  allSelected: () => boolean;
  toggleAll: () => void;
  toggleItem: (id: string | number) => void;

  selectedItems: () => CartItem[];

  total: () => number;
  totalCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedIds: [],

      getQuantity: (id) => {
        const item = get().cart.find((p) => p.id === id);
        return item ? item.count : 0;
      },

      addToCart: (item) => {
        const existing = get().cart.find((p) => p.id === item.id);

        if (existing) {
          if (existing.count < item.stock_qty) {
            set((state) => ({
              cart: state.cart.map((p) =>
                p.id === item.id ? { ...p, count: p.count + 1 } : p,
              ),
            }));
          }
        } else {
          set((state) => ({
            cart: [
              ...state.cart,
              {
                ...item,
                count: 1,
                price: Number(item.price),
              },
            ],
            selectedIds: [...state.selectedIds, item.id],
          }));
        }
      },

      inc: (id) => {
        const item = get().cart.find((p) => p.id === id);

        if (item && item.count < item.stock_qty) {
          set((state) => ({
            cart: state.cart.map((p) =>
              p.id === id ? { ...p, count: p.count + 1 } : p,
            ),
          }));
        }
      },

      dec: (id) => {
        set((state) => ({
          cart: state.cart.map((p) =>
            p.id === id && p.count > 1 ? { ...p, count: p.count - 1 } : p,
          ),
        }));
      },

      remove: (id) => {
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        }));
      },

      clearCart: () => set({ cart: [], selectedIds: [] }),

      changeQty: (id, delta) => {
        if (delta > 0) get().inc(id);
        else get().dec(id);
      },

      allSelected: () => {
        const { cart, selectedIds } = get();
        return cart.length > 0 && cart.every((i) => selectedIds.includes(i.id));
      },

      toggleAll: () => {
        const { cart, allSelected } = get();

        set({
          selectedIds: allSelected() ? [] : cart.map((i) => i.id),
        });
      },

      toggleItem: (id) => {
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((i) => i !== id)
            : [...state.selectedIds, id],
        }));
      },

      selectedItems: () => {
        const { cart, selectedIds } = get();
        return cart.filter((i) => selectedIds.includes(i.id));
      },

      total: () =>
        get()
          .selectedItems()
          .reduce((sum, i) => sum + Number(i.price) * i.count, 0),

      totalCount: () =>
        get()
          .selectedItems()
          .reduce((sum, i) => sum + i.count, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
