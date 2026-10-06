import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";

type Props = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function CartCounter({
  value,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <View style={styles.counter}>
      <TouchableOpacity
        style={styles.counterBtn}
        onPress={onDecrease}
        activeOpacity={0.7}
      >
        <MinusIcon size={20} color="#52525b" />
      </TouchableOpacity>

      <Text style={styles.counterQty}>{value}</Text>

      <TouchableOpacity
        style={styles.counterBtn}
        onPress={onIncrease}
        activeOpacity={0.7}
      >
        <PlusIcon size={20} color="#52525b" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});