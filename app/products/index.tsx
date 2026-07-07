import { Header } from "@/components/Header";
import { LeftIcon } from "@/components/icons";
import Section from "@/components/layout/Section";
import { useAllProducts } from "@/hooks/useProducts";
// import { useInfiniteQuery } from "@tanstack/react-query";
import FilterSheet, {
  FilterSheetRef,
  ProductFilters,
} from "@/components/FilterSheet";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef, useState } from "react";

const { width } = Dimensions.get("window");
const CARD_SIZE = ((width < 720 ? width : 720) - 20 * 2 - 16) / 2;

export default function ProductsScreen() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  const filterSheetRef = useRef<FilterSheetRef>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    priceMin: "",
    priceMax: "",
    categoryId: null,
    sort: "default",
  });

  const {
    data: product,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useAllProducts(categoryId); // hook'ga filtrlarni ham uzatildi

  // Barcha sahifalardan productlarni birlashtirish
  const allProducts =
    product?.pages.flatMap((page: any) => page.data ?? []) ?? [];

  const products = allProducts
    .filter((item: any) => item.images && item.images.length > 0) // ✅ rasm yo'q bo'lsa chiqarib tashlaydi
    .filter(
      (item: any, index: number, self: any[]) =>
        index === self.findIndex((p) => p.id === item.id),
    );

  const total = product?.pages[0]?.pagination?.total ?? 0;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ width: CARD_SIZE }}
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={productStyles.card}>
        <Image
          source={{
            uri: "https://api.bunyodoptom.uz" + item?.images?.[0]?.url,
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View style={{ marginTop: 8, gap: 2 }}>
        <Text numberOfLines={1} style={productStyles.name}>
          {item.name}
        </Text>
        <Text style={productStyles.price}>
          {item.price.toLocaleString("uz-Latn-uz")} so'm
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F7F4" }}>
      <Header />

      <Section>
        {/* TOP BAR */}
        <View style={{ paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <TouchableOpacity
              style={{
                padding: 6,
                borderRadius: 12,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <LeftIcon size={26} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{ fontSize: 16, fontWeight: "700", color: "#111" }}
              >
                {categoryName}
              </Text>
              <Text
                style={{ fontSize: 12, color: "#737373", fontWeight: "500" }}
              >
                {products.length} ta mahsulot
              </Text>
            </View>
            {/* <TouchableOpacity
              style={{
                padding: 10,
                paddingHorizontal: 24,
                borderRadius: 12,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.7}
              onPress={() => filterSheetRef.current?.present()}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>Filter</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* LIST */}
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0040B1" />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ gap: 16 }}
            contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={{ alignItems: "center", paddingVertical: 60 }}>
                <Text style={{ fontSize: 14, color: "#9ca3af" }}>
                  Mahsulotlar topilmadi
                </Text>
              </View>
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={{ paddingVertical: 20, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#0040B1" />
                </View>
              ) : null
            }
          />
        )}
      </Section>
      <FilterSheet
        ref={filterSheetRef}
        brands={[
          { id: "1", name: "Brend A" },
          { id: "2", name: "Brend B" },
          // haqiqiy brendlar ro'yxatini backend'dan olib beriladi
        ]}
        categories={[
          { id: "1", name: "Kategoriya A" },
          { id: "2", name: "Kategoriya B" },
          // haqiqiy kategoriyalar ro'yxatini backend'dan olib beriladi
        ]}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </View>
  );
}

const productStyles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#404040" },
  price: { fontSize: 16, fontWeight: "700", color: "#0040B1" },
});
