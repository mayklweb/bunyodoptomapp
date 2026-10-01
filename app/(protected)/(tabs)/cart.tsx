import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";

import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";

import Container from "@/components/Container";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CartIcon from "../../../components/icons/CartIcon";
import CheckIcon from "../../../components/icons/CheckIcon";
import DeleteIcon from "../../../components/icons/DeleteIcon";
import MinusIcon from "../../../components/icons/MinusIcon";
import PlusIcon from "../../../components/icons/PlusIcon";

type CartRowItem = {
  id: string | number;
  name: string;
  price: number;
  count: number;
  images?: { url: string }[];
};

type CartItemRowProps = {
  item: CartRowItem;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
  onInc: (id: string | number) => void;
  onDec: (id: string | number) => void;
  onRemove: (id: string | number) => void;
};

const API_URL = "https://api.bunyodoptom.uz";

const CartItemRow = React.memo(function CartItemRow({
  item,
  isSelected,
  onToggle,
  onInc,
  onDec,
  onRemove,
}: CartItemRowProps) {
  const imageUrl = item.images?.[0]?.url;

  const imageSource = imageUrl
    ? {
        uri: imageUrl.startsWith("http") ? imageUrl : `${API_URL}${imageUrl}`,
      }
    : undefined;

  return (
    <View style={styles.cartItem}>
      {/* Top */}
      <View style={styles.itemTop}>
        <View style={styles.itemImgWrap}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.itemImg}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <CartIcon size={28} color="#9CA3AF" />
            </View>
          )}
        </View>

        <View style={styles.itemContent}>
          <Text numberOfLines={2} style={styles.itemName}>
            {item.name}
          </Text>

          <Text style={styles.itemPrice}>
            {(Number(item.price) * item.count).toLocaleString()} so'm
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggle(item.id)}
          hitSlop={8}
        >
          <View
            style={[styles.itemCheck, isSelected && styles.itemCheckActive]}
          >
            {isSelected && <CheckIcon size={16} color="#fff" />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Bottom */}
      <View style={styles.itemBottom}>
        <View style={styles.counter}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => onDec(item.id)}
            activeOpacity={0.7}
          >
            <MinusIcon size={20} color="#52525b" />
          </TouchableOpacity>

          <Text style={styles.counterQty}>{item.count}</Text>

          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => onInc(item.id)}
            activeOpacity={0.7}
          >
            <PlusIcon size={20} color="#52525b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.deleteBtn}
          onPress={() => onRemove(item.id)}
        >
          <DeleteIcon size={16} stroke={2} color="#ef4444" />

          <Text style={styles.deleteBtnText}>Yo'q qilish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

function CartScreen() {
  // ===============================
  // Cart store
  // ===============================

  const cart = useCartStore((state) => state.cart);
  const selectedIds = useCartStore((state) => state.selectedIds);

  const changeQty = useCartStore((state) => state.changeQty);
  const remove = useCartStore((state) => state.remove);
  const toggleAll = useCartStore((state) => state.toggleAll);
  const toggleItem = useCartStore((state) => state.toggleItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // ===============================
  // Auth
  // ===============================

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // ===============================
  // Selected items
  // ===============================

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selected = useMemo(
    () => cart.filter((item) => selectedIdSet.has(item.id)),
    [cart, selectedIdSet],
  );

  // ===============================
  // Cart calculations
  // ===============================

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

  // ===============================
  // Stable handlers
  // ===============================

  const handleToggleItem = useCallback(
    (id: string | number) => {
      toggleItem(id);
    },
    [toggleItem],
  );

  const handleInc = useCallback(
    (id: string | number) => {
      changeQty(id, 1);
    },
    [changeQty],
  );

  const handleDec = useCallback(
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

  // ===============================
  // Checkout
  // ===============================

  const handleCheckout = useCallback(() => {
    // Auth hali yuklanmagan
    if (!isHydrated) {
      router.push("/login");
      return;
    }
    // Mahsulot tanlanmagan
    if (selectedCount === 0) {
      return;
    }
    // Login qilingan
    router.push("/checkout");
  }, [isHydrated, selectedCount, user, router]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          cart.length === 0 ? styles.emptyScrollContent : undefined
        }
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {cart.length === 0 ? (
            <View style={styles.empty}>
              {/* Icon */}
              <View style={styles.emptyIconWrap}>
                <CartIcon size={48} color="#9CA3AF" />
              </View>

              {/* Text */}
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyTitle}>Savat bo'sh</Text>

                <Text style={styles.emptySubtitle}>
                  Mahsulot qo'shish uchun katalogga o'ting
                </Text>
              </View>

              {/* Button */}
              <TouchableOpacity
                onPress={() => router.push("/catalog")}
                style={styles.emptyBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyBtnText}>Katalogga o'tish</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Select All Bar */}
              <View style={styles.selectAllBar}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.selectAllLeft}
                  onPress={toggleAll}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isAllSelected && styles.checkboxActive,
                    ]}
                  >
                    {isAllSelected && <CheckIcon size={16} color="#fff" />}
                  </View>

                  <Text style={styles.selectLabel}>
                    Tanlangan: {selectedCount} ta mahsulot
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={clearCart} activeOpacity={0.7}>
                  <Text style={styles.clearBtn}>Tozalash</Text>
                </TouchableOpacity>
              </View>

              {/* Cart Items */}
              {cart.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  isSelected={selectedIdSet.has(item.id)}
                  onToggle={handleToggleItem}
                  onInc={handleInc}
                  onDec={handleDec}
                  onRemove={handleRemove}
                />
              ))}
            </>
          )}
        </Container>
      </ScrollView>

      {/* Footer */}
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Tanlangan mahsulotlar:</Text>

            <Text style={styles.footerValue}>{totalQty} ta</Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerTotal}>Jami:</Text>

            <Text style={styles.footerTotal}>
              {totalPrice.toLocaleString()} so'm
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCheckout}
            activeOpacity={0.8}
            disabled={selectedCount === 0}
            style={[
              styles.checkoutBtn,
              selectedCount === 0 && styles.checkoutBtnDisabled,
            ]}
          >
            <Text style={styles.checkoutBtnText}>Buyurtma berish</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollView: {
    flex: 1,
    marginTop: 24,
  },

  emptyScrollContent: {
    flexGrow: 1,
  },

  // ─────────────────────────────────────────────
  // Empty state
  // ─────────────────────────────────────────────

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 60,
  },

  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTextContainer: {
    alignItems: "center",
    gap: 6,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },

  emptyBtn: {
    marginTop: 4,
    backgroundColor: "#0040B1",
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // ─────────────────────────────────────────────
  // Select all
  // ─────────────────────────────────────────────

  selectAllBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#cecfff80",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },

  selectAllLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#747474",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: "#0040B1",
    borderColor: "#0040B1",
  },

  selectLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },

  clearBtn: {
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "500",
  },

  // ─────────────────────────────────────────────
  // Cart item
  // ─────────────────────────────────────────────

  cartItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f1f1",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
    marginBottom: 12,
  },

  itemTop: {
    flexDirection: "row",
    gap: 14,
  },

  itemImgWrap: {
    width: 107,
    height: 80,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },

  itemImg: {
    width: 107,
    height: 80,
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  itemContent: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18181b",
    marginBottom: 6,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#09090b",
  },

  itemCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    alignItems: "center",
    justifyContent: "center",
  },

  itemCheckActive: {
    backgroundColor: "#0040B1",
    borderColor: "#0040B1",
  },

  // ─────────────────────────────────────────────
  // Divider
  // ─────────────────────────────────────────────

  divider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginVertical: 12,
  },

  // ─────────────────────────────────────────────
  // Bottom row
  // ─────────────────────────────────────────────

  itemBottom: {
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    borderRadius: 12,
    padding: 4,
    gap: 12,
  },

  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 1,
  },

  counterQty: {
    fontSize: 14,
    fontWeight: "600",
    width: 20,
    textAlign: "center",
  },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },

  deleteBtnText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
  },

  // ─────────────────────────────────────────────
  // Footer
  // ─────────────────────────────────────────────

  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    gap: 8,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerLabel: {
    fontSize: 14,
    color: "#71717a",
  },

  footerValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#18181b",
  },

  footerTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#09090b",
  },

  checkoutBtn: {
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },

  checkoutBtnDisabled: {
    opacity: 0.4,
  },

  checkoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
