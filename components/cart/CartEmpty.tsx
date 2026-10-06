import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CartIcon from "@/components/icons/CartIcon";

type Props = {
  onCatalogPress: () => void;
};

export default function CartEmpty({
  onCatalogPress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <CartIcon size={48} color="#9CA3AF" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Savat bo'sh
        </Text>

        <Text style={styles.subtitle}>
          Mahsulot qo'shish uchun katalogga o'ting
        </Text>
      </View>

      <TouchableOpacity
        onPress={onCatalogPress}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          Katalogga o'tish
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 60,
  },

  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    alignItems: "center",
    gap: 6,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },

  button: {
    marginTop: 4,
    backgroundColor: "#0040B1",
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});