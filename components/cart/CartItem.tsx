import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CartIcon from "@/components/icons/CartIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";

import CartCounter from "./CartCounter";

import { CartRowItem } from "@/types/cart";

const API_URL = "https://api.bunyodoptom.uz";

type Props = {
  item: CartRowItem;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
  onIncrease: (id: string | number) => void;
  onDecrease: (id: string | number) => void;
  onRemove: (id: string | number) => void;
};

function CartItem({
  item,
  isSelected,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const imageUrl = item.images?.[0]?.url;

  const imageSource = imageUrl
    ? {
        uri: imageUrl.startsWith("https")
          ? imageUrl
          : `${API_URL}${imageUrl}`,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {/* Top */}
      <View style={styles.top}>
        <View style={styles.imageWrap}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <CartIcon size={28} color="#9CA3AF" />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            {(Number(item.price) * item.count).toLocaleString()} so'm
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggle(item.id)}
          hitSlop={8}
        >
          <View
            style={[
              styles.checkbox,
              isSelected && styles.checkboxActive,
            ]}
          >
            {isSelected && (
              <CheckIcon size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Bottom */}
      <View style={styles.bottom}>
        <CartCounter
          value={item.count}
          onDecrease={() => onDecrease(item.id)}
          onIncrease={() => onIncrease(item.id)}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.deleteBtn}
          onPress={() => onRemove(item.id)}
        >
          <DeleteIcon
            size={16}
            stroke={2}
            color="#ef4444"
          />

          <Text style={styles.deleteText}>
         O'chirish
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(CartItem);

const styles = StyleSheet.create({
  container: {
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

  top: {
    flexDirection: "row",
    gap: 14,
  },

  imageWrap: {
    width: 107,
    height: 80,
    borderRadius: 14,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },

  image: {
    width: 107,
    height: 80,
  },

  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18181b",
    marginBottom: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#09090b",
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: "#0040B1",
    borderColor: "#0040B1",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginVertical: 12,
  },

  bottom: {
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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

  deleteText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
  },
});