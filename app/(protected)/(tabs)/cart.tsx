import React, { useCallback, useMemo } from "react";

import { View, StyleSheet } from "react-native";
import { router } from "expo-router";

import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

import CartWidget from "@/widgets/cart/CartWidget";
import CartFooter from "@/components/cart/CartFooter";

export default function CartScreen() {
  const cart = useCartStore((state) => state.cart);
  const selectedIds = useCartStore((state) => state.selectedIds);

  const changeQty = useCartStore((state) => state.changeQty);

  const remove = useCartStore((state) => state.remove);

  const toggleAll = useCartStore((state) => state.toggleAll);

  const toggleItem = useCartStore((state) => state.toggleItem);

  const clearCart = useCartStore((state) => state.clearCart);

  const isHydrated = useAuthStore((state) => state.isHydrated);

  // -----------------------------
  // Selected
  // -----------------------------

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selected = useMemo(
    () => cart.filter((item) => selectedIdSet.has(item.id)),
    [cart, selectedIdSet],
  );

  // -----------------------------
  // Calculations
  // -----------------------------

  const selectedCount = selected.length;

  const totalQty = useMemo(
    () => selected.reduce((sum, item) => sum + item.count, 0),
    [selected],
  );

  const totalPrice = useMemo(
    () =>
      selected.reduce((sum, item) => sum + Number(item.price) * item.count, 0),
    [selected],
  );

  const isAllSelected = cart.length > 0 && selectedCount === cart.length;

  // -----------------------------
  // Handlers
  // -----------------------------

  const handleToggleItem = useCallback(
    (id: string | number) => {
      toggleItem(id);
    },
    [toggleItem],
  );

  const handleIncrease = useCallback(
    (id: string | number) => {
      changeQty(id, 1);
    },
    [changeQty],
  );

  const handleDecrease = useCallback(
    (id: string | number) => {
      changeQty(id, -1);
    },
    [changeQty],
  );

  const handleRemove = useCallback(
    (id: string | number) => {
      remove(id);
    },
    [remove],
  );

  // -----------------------------
  // Navigation
  // -----------------------------

  const handleCatalogPress = useCallback(() => {
    router.push("/catalog");
  }, []);

  const handleCheckout = useCallback(() => {
    if (!isHydrated) {
      router.push("/login");
      return;
    }

    if (selectedCount === 0) {
      return;
    }

    router.push("/checkout");
  }, [isHydrated, selectedCount]);

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <CartWidget
          cart={cart}
          selectedIds={selectedIds}
          isAllSelected={isAllSelected}
          onToggleAll={toggleAll}
          onToggleItem={handleToggleItem}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onClear={clearCart}
          onCatalogPress={handleCatalogPress}
        />
      </View>

      {cart.length > 0 && (
        <CartFooter
          totalQty={totalQty}
          totalPrice={totalPrice}
          disabled={selectedCount === 0}
          onCheckout={handleCheckout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});
