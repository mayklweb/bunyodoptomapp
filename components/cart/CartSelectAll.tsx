import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CheckIcon from "@/components/icons/CheckIcon";

type Props = {
  selectedCount: number;
  isAllSelected: boolean;
  onToggleAll: () => void;
  onClear: () => void;
};

export default function CartSelectAll({
  selectedCount,
  isAllSelected,
  onToggleAll,
  onClear,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.left}
        onPress={onToggleAll}
      >
        <View
          style={[
            styles.checkbox,
            isAllSelected && styles.checkboxActive,
          ]}
        >
          {isAllSelected && (
            <CheckIcon size={16} color="#fff" />
          )}
        </View>

        <Text style={styles.label}>
          Tanlangan: {selectedCount} ta mahsulot
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onClear}
        activeOpacity={0.7}
      >
        <Text style={styles.clear}>
          Tozalash
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#cecfff80",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },

  left: {
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

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },

  clear: {
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "500",
  },
});