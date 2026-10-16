import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import CloseIcon from "../../components/icons/CloseIcon";
import SearchIcon from "../../components/icons/SearchIcon";
import Container from "@/components/Container";
import DismissKeyboard from "@/components/DismissKeyboard";
import { colors } from "@/styles/globalStyles";
import { normalizeForSearch } from "@/utils/uzbekTransliteration";
import { useProducts } from "@/hooks/products/useProducts";

export default function SearchScreen() {
  const { data: products } = useProducts();

  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Nomlarni bir marta normalizatsiya qilamiz (har harfda emas)
  const indexed = useMemo(
    () =>
      (Array.isArray(products) ? products : []).map((p: any) => ({
        product: p,
        key: normalizeForSearch(String(p?.name ?? "")),
      })),
    [products],
  );

  const results = useMemo(() => {
    if (!debounced.trim()) return [];
    const q = normalizeForSearch(debounced);
    return indexed.filter((i) => i.key.includes(q)).map((i) => i.product);
  }, [debounced, indexed]);

  return (
    <DismissKeyboard>
      <View style={styles.screen}>
        <Container>
          <View style={styles.searchRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <ArrowLeftIcon size={32} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <SearchIcon size={22} color={colors.textSecondary} />
                <TextInput
                  value={query}
                  autoFocus
                  returnKeyType="search"
                  onChangeText={setQuery}
                  placeholder="Mahsulot qidirish..."
                  style={styles.input}
                />
              </View>

              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => setQuery("")}
                  style={styles.clearButton}
                  accessibilityLabel="Qidiruvni tozalash"
                >
                  <CloseIcon />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            style={{ marginTop: 18, marginBottom: 44 }}
            data={results}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => {
                  // masalan: router.push(`/product/${item.id}`)
                }}
              >
                <Image
                  source={{
                    uri: "https://api.bunyodoptom.uz" + item?.images?.[0]?.url,
                  }}
                  style={styles.thumb}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>
                    {item.price?.toLocaleString()} so'm
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {query ? "Hech narsa topilmadi" : "Qidiruv so'zini kiriting"}
              </Text>
            }
          />
        </Container>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
    paddingTop: 24,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    marginLeft: -40,
    padding: 8,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  thumb: {
    aspectRatio: 4 / 3,
    height: 48,
    borderRadius: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
  price: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    paddingTop: 40,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
