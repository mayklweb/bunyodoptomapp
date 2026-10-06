import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  totalQty: number;
  totalPrice: number;
  disabled: boolean;
  onCheckout: () => void;
};

export default function CartFooter({
  totalQty,
  totalPrice,
  disabled,
  onCheckout,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>
          Tanlangan mahsulotlar:
        </Text>

        <Text style={styles.value}>
          {totalQty} ta
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.total}>
          Jami:
        </Text>

        <Text style={styles.total}>
          {totalPrice.toLocaleString()} so'm
        </Text>
      </View>

      <TouchableOpacity
        onPress={onCheckout}
        activeOpacity={0.8}
        disabled={disabled}
        style={[
          styles.button,
          disabled && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          Buyurtma berish
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    gap: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    color: "#71717a",
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#18181b",
  },

  total: {
    fontSize: 16,
    fontWeight: "600",
    color: "#09090b",
  },

  button: {
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});