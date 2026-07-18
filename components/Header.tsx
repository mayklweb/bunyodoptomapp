import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SearchIcon } from "./icons";
import { router } from "expo-router";

type Product = {
  id: string;
  name: string; // Kirillcha, masalan: "Печенье Choco"
  price: number;
  image?: string;
};

type Props = {
  cartCount?: number;
  showSearch?: boolean;
  title?: string;
  onCartPress?: () => void;
  products?: Product[];
  onProductPress?: (product: Product) => void;
};

// --- Lotin <-> Kirill (o'zbekcha) transliteratsiya ---
// Kirillni lotinga o'giramiz, keyin qidiruv ham shu holatga keltiriladi.
const KIRILL_TO_LOTIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "x",
  ц: "s",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ы: "i",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  ў: "o'",
  қ: "q",
  ғ: "g'",
  ҳ: "h",
};

function normalizeText(text: string): string {
  let result = text.toLowerCase();
  result = result
    .split("")
    .map((ch) => (KIRILL_TO_LOTIN[ch] !== undefined ? KIRILL_TO_LOTIN[ch] : ch))
    .join("");
  // apostrof va tinish belgilarini soddalashtiramiz (o'/o‘/oʻ bir xil bo'lsin)
  result = result.replace(/[’‘ʻ`]/g, "'");
  return result.trim();
}

export function Header({ products = [], onProductPress }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = normalizeText(searchQuery);
    if (!q) return [];
    return products.filter((p) => normalizeText(p.name).includes(q));
  }, [searchQuery, products]);

  const showDropdown = isFocused && searchQuery.trim().length > 0;

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    // Bu yerda filter allaqachon ishlaydi (yuqorida useMemo orqali)
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    // Tugma bosilganda qidirish (filter allaqachon amal qilgan)
  }, [searchQuery]);

  const handleProductPress = useCallback(
    (product: Product) => {
      onProductPress?.(product);
      setSearchQuery("");
      setIsFocused(false);
      router.push(`/product/${product.id}`)
    },
    [onProductPress],
  );

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

          <View style={{ flex: 1, position: "relative" }}>
            <View style={header.searchForm}>
              <TextInput
                placeholder="Pechenlar..."
                placeholderTextColor="#A3A3A3"
                style={header.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={handleSearchSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Mahsulotga bosishga ulgurish uchun kichik kechikish
                  setTimeout(() => setIsFocused(false), 150);
                }}
                returnKeyType="search"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={header.searchButton}
                activeOpacity={0.5}
                onPress={handleSearchSubmit}
              >
                <SearchIcon size={24} color="#A3A3A3" />
              </TouchableOpacity>
            </View>

            {showDropdown && (
              <View style={header.dropdown}>
                {filteredProducts.length === 0 ? (
                  <View style={header.emptyState}>
                    <Text style={header.emptyText}>
                      "{searchQuery}" bo'yicha mahsulot topilmadi
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    style={{ maxHeight: 320 }}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={header.productRow}
                        activeOpacity={0.6}
                        onPress={() => handleProductPress(item)}
                      >
                        {item.image ? (
                          <Image
                            source={{
                              uri: "https://api.bunyodoptom.uz" + item.image,
                            }}
                            style={header.productImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={header.productImagePlaceholder} />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text style={header.productName}>{item.name}</Text>
                          <Text style={header.productPrice}>
                            {item.price.toLocaleString()} so'm
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
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
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    paddingVertical: 4,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#A3A3A3",
    fontSize: 14,
  },
  productRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  productImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  productImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
  },
  productName: {
    fontSize: 15,
    color: "#111",
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
