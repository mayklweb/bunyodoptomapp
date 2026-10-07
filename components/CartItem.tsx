import CheckIcon from "@/components/icons/CheckIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { useCartStore } from "@/stores/cart.store";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartItem({ item }: any) {
  const { selectedIds, toggleItem, changeQty, remove } = useCartStore();
  const isSelected = selectedIds.includes(item.id);
  return (
    <View key={item.id} style={styles.cartItem}>
      {/* Top */}
      <View style={styles.itemTop}>
        <View style={styles.itemImgWrap}>
          <Image
            source={{
              uri: "https://api.bunyodoptom.uz" + item?.images?.[0]?.url,
            }}
            style={styles.itemImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.itemContent}>
          <Text numberOfLines={1} style={styles.itemName}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>
            {(item.price * item.count).toLocaleString()} so'm
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleItem(item.id)}
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
            onPress={() => changeQty(item.id, -1)}
          >
            <MinusIcon size={20} color="#52525b" />
          </TouchableOpacity>
          <Text style={styles.counterQty}>{item.count}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => changeQty(item.id, 1)}
          >
            <PlusIcon size={20} color="#52525b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.deleteBtn}
          onPress={() => remove(item.id)}
        >
          <DeleteIcon size={16} color="#ef4444" />
          <Text style={styles.deleteBtnText}>O'chirish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    padding: 10,
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerText: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#404040",
    textAlign: "center",
  },

  // Select all bar
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

  // Cart item
  cartItem: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f1f1f1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemTop: {
    flexDirection: "row",
    gap: 14,
  },
  itemImgWrap: {
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  itemImg: {
    width: 107,
    height: 80,
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

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginVertical: 12,
  },

  // Bottom row
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
    shadowOffset: { width: 0, height: 1 },
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

  // Footer
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
