import React, { useCallback, useMemo, useState } from "react";

import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";

import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

import CartWidget from "@/widgets/cart/CartWidget";
import CartFooter from "@/components/cart/CartFooter";
import { productService } from "@/services/product.service";

export default function CartScreen() {
  const cart = useCartStore((state) => state.cart);
  const selectedIds = useCartStore((state) => state.selectedIds);

  const changeQty = useCartStore((state) => state.changeQty);

  const remove = useCartStore((state) => state.remove);

  const toggleAll = useCartStore((state) => state.toggleAll);

  const toggleItem = useCartStore((state) => state.toggleItem);

  const clearCart = useCartStore((state) => state.clearCart);

  const isHydrated = useAuthStore((state) => state.isHydrated);

  const token = useAuthStore((state) => state.token);

  const updateProductData = useCartStore((state) => state.updateProductData);

  const [isCheckingPrices, setIsCheckingPrices] = useState(false);

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

  const handleCheckout = useCallback(async () => {
    if (!isHydrated || isCheckingPrices) return;

    if (!token) {
      router.push("/login");
      return;
    }

    const selectedItems = useCartStore.getState().selectedItems();

    if (selectedItems.length === 0) return;

    setIsCheckingPrices(true);

    try {
      const freshProducts = await Promise.all(
        selectedItems.map(async (item) => {
          const product = await productService.getProductById(item.id);

          const price = Number(product.price);
          const stock = Number(product.stock_qty);

          if (
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isFinite(stock) ||
            stock < 0
          ) {
            throw new Error(`Mahsulot ma'lumotlari noto'g'ri: ${item.id}`);
          }

          return {
            id: item.id,
            name: product.name,
            price,
            stock_qty: stock,
            images: product.images,
            oldPrice: Number(item.price),
            oldStock: Number(item.stock_qty),
            count: item.count,
          };
        }),
      );

      const changes: string[] = [];
      const insufficientStock: string[] = [];

      for (const product of freshProducts) {
        const priceChanged = product.price !== product.oldPrice;
        const stockChanged = product.stock_qty !== product.oldStock;

        if (priceChanged) {
          changes.push(
            `${product.name ?? `Mahsulot #${product.id}`}: narx ${product.oldPrice} → ${product.price}`,
          );
        }

        if (stockChanged) {
          changes.push(
            `${product.name ?? `Mahsulot #${product.id}`}: qoldiq ${product.oldStock} → ${product.stock_qty}`,
          );
        }

        if (product.stock_qty < product.count) {
          insufficientStock.push(
            `${product.name ?? `Mahsulot #${product.id}`}: mavjud ${product.stock_qty} dona, savatda ${product.count} dona`,
          );
        }

        updateProductData(product.id, {
          price: product.price,
          stock_qty: product.stock_qty,
          name: product.name,
          images: product.images,
        });
      }

      if (changes.length > 0) {
        Alert.alert(
          "Mahsulot ma'lumotlari yangilandi",
          [
            ...changes,
            "",
            "Savatdagi jami summa qayta hisoblandi. Ma'lumotlarni tekshirib, buyurtmani yana tasdiqlang.",
            ...(insufficientStock.length
              ? ["", "Qoldiq yetarli emas:", ...insufficientStock]
              : []),
          ].join("\n"),
        );

        return;
      }

      if (insufficientStock.length > 0) {
        Alert.alert(
          "Qoldiq yetarli emas",
          insufficientStock.join("\n") +
            "\n\nIltimos, mahsulot miqdorini o'zgartiring.",
        );

        return;
      }

      router.push("/checkout");
    } catch (error) {
      console.error("Cart price validation failed:", error);

      Alert.alert(
        "Tekshirish amalga oshmadi",
        "Mahsulotlarning joriy narxi va qoldig'ini olish imkoni bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
      );
    } finally {
      setIsCheckingPrices(false);
    }
  }, [isHydrated, isCheckingPrices, token, updateProductData]);

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
