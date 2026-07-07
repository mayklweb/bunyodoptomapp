import React from "react";
import { SearchIcon } from "./icons";
import Container from "./layout/Container";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { useState, useCallback } from "react";

type Props = {
  cartCount?: number;
  showSearch?: boolean;
  title?: string;
  onCartPress?: () => void;
};

export function Header() {
  // Component ichida:
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    // Bu yerda filter qiling yoki API chaqiring
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    // Tugma bosilganda qidirish
  }, [searchQuery]);

  return (
    <View style={header.header}>
      <View
        style={{
          maxWidth: 720,
          width: "100%",
          marginInline: "auto",
          paddingInline: 20,
        }}
      >
        <View style={header.headerRow}>
          <View style={header.logo}>
            <Image
              style={{ width: 44, height: 44 }}
              source={require("@/assets/images/logo.png")}
              resizeMode="contain"
            />
          </View>
          <View style={header.searchForm}>
            <TextInput
              placeholder="Pechenlar..."
              placeholderTextColor="#A3A3A3"
              style={header.searchInput}
              value={searchQuery}
              onChangeText={handleSearch} // Har harf kiritilganda
              onSubmitEditing={handleSearchSubmit} // Keyboard "Enter" bosilganda
              returnKeyType="search"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={header.searchButton}
              activeOpacity={0.5}
              onPress={handleSearchSubmit} // Tugma bosilganda
            >
              <SearchIcon size={24} color="#A3A3A3" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const header = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logo: { width: 44, height: 44 },
  searchForm: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F1F1F1",
    borderRadius: 12,
  },
  searchButton: { paddingHorizontal: 12, paddingVertical: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    paddingHorizontal: 12,
    paddingVertical: 8,
    outlineStyle: "solid",
    outlineOffset: -2,
    outlineColor: "transparent",
    outlineWidth: 0,
  },
});
