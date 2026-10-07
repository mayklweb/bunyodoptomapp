import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { useCategories } from "@/hooks/categories/useCategories";
import { useProducts } from "@/hooks/products/useProducts";

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
      (c: any) =>
        c.id === Number(value) ||
        c.name?.toLowerCase() === value,
    );
  }, [category, categories]);

  const {
    data: products = [],
    isLoading,
  } = useProducts(matchedCategory?.id);

  console.log("CATEGORY PARAM:", category);
  console.log("MATCHED CATEGORY:", matchedCategory);
  console.log("PRODUCTS:", products);

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
                    pathname: "/product/[id]",
                    params: {
                      id: String(item.id),
                    },
                  })
                }
              />
            )}
          />
        )}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 24,
    gap: 16,
  },

  row: {
    gap: 16,
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
});