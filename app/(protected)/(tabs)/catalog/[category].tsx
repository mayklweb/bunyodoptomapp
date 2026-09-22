import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "@/components/ProductCard";
import { useAllProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import Container from "@/components/Container";

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width < 720 ? width : 720;
const CARD_SIZE = (CONTENT_WIDTH - 20 * 2 - 16) / 2;

export default function CategoryProductsScreen() {
  const { data: categories } = useCategories();
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();

  const matchedCategory = useMemo(() => {
    if (!category || !categories) return undefined;
    const value = decodeURIComponent(category).toLowerCase();
    return categories.find(
      (c: any) => c.id === Number(value) || c.name?.toLowerCase() === value,
    );
  }, [category, categories]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAllProducts(matchedCategory?.id);

  const products = useMemo(
    () => data?.pages.flatMap((page: any) => page.data ?? []) ?? [],
    [data],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View style={{ flex: 1 }}>
      <Container>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0040B1"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {matchedCategory
                  ? "Bu kategoriyada mahsulot yo'q"
                  : "Bunday kategoriya mavjud emas"}
              </Text>
            }
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                width={CARD_SIZE}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/product/[id]",
                    params: { id: item.id },
                  })
                }
              />
            )}
            ListFooterComponent={
              hasNextPage ? (
                <TouchableOpacity
                  style={[
                    loadMoreBtn.button,
                    isFetchingNextPage && { opacity: 0.6 },
                  ]}
                  onPress={handleLoadMore}
                  disabled={isFetchingNextPage}
                  activeOpacity={0.8}
                >
                  {isFetchingNextPage ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={loadMoreBtn.text}>Yana yuklash</Text>
                  )}
                </TouchableOpacity>
              ) : null
            }
          />
        )}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
    color: "#111",
  },
  list: {
    paddingVertical: 24,
    gap: 16, // qatorlar orasidagi vertikal bo'shliq
  },
  row: {
    gap: 16, // ustunlar orasidagi gorizontal bo'shliq
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
});
const loadMoreBtn = StyleSheet.create({
  button: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#0040B1",
  },
  text: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});
