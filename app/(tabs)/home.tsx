import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Header } from "@/components/Header";
import { HeartIcon, MinusIcon, PlusIcon, RightIcon } from "@/components/icons";
import Section from "@/components/layout/Section";
import { ProductCard } from "@/components/ProductCard";
import { useCategories } from "@/hooks/useCategories";
import { useAllProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart.store";
import { ProductsType } from "@/types/types";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Link, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");
const { height: screenHeight } = Dimensions.get("window");

const GAP = 10;
const ITEM_SIZE = ((width < 720 ? width : 720) - GAP * 5 - 20) / 4;

// ── Types ──────────────────────────────────────────────────
interface BannerItem {
  id: string;
  image: ImageSourcePropType;
}

// ── Data ───────────────────────────────────────────────────
const banners: BannerItem[] = [
  { id: "1", image: require("@/assets/images/banner-1.jpg") },
  { id: "2", image: require("@/assets/images/banner-2.jpg") },
  { id: "3", image: require("@/assets/images/banner-3.jpg") },
];

interface BannerSlideProps {
  item: BannerItem;
  animationValue: SharedValue<number>;
}

function BannerSlide({ item, animationValue }: BannerSlideProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(animationValue.value, [-1, 0, 1], [0.8, 1, 0.8]) },
    ],
    opacity: interpolate(animationValue.value, [-1, 0, 1], [0.6, 1, 0.6]),
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width: width - 40,
            height: 180,
            borderRadius: 18,
            overflow: "hidden",
          },
          animatedStyle,
        ]}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

interface ProductSheetProps {
  product: ProductsType;
}

function ProductSheet({ product }: ProductSheetProps) {
  const qty = useCartStore((state) => {
    const item = state.cart.find((i) => i.id === product.id);
    return item ? item.count : 0;
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);

  return (
    <>
      <View style={sheet.imageWrap}>
        <Image
          source={{
            uri: "https://api.bunyodoptom.uz" + product?.images?.[0]?.url,
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View style={sheet.info}>
        <Text style={sheet.productName}>{product.name}</Text>
        <Text style={sheet.productCategory}>{product.name}</Text>
        <Text style={sheet.price}>
          {product.price.toLocaleString("uz-Latn-uz")} so'm
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ backgroundColor: "#F5F5F5", borderRadius: 12, padding: 12 }}
        >
          <HeartIcon />
        </TouchableOpacity>
        {qty ? (
          <View
            style={{
              flex: 1,
              gap: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F5F5F5",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => dec(product.id)}
              activeOpacity={0.8}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F3F4F6",
              }}
            >
              <MinusIcon />
            </TouchableOpacity>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}
              >
                {qty}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => inc(product.id)}
              activeOpacity={0.8}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlusIcon color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => addToCart(product)}
            style={sheet.addBtn}
            activeOpacity={0.8}
          >
            <Text style={sheet.addBtnText}>Savatga qo'shish</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

// ── Header qismi (banner + categories) — FlatList'ning ListHeaderComponent'i ──
interface ListHeaderProps {
  categories: any[];
  router: ReturnType<typeof useRouter>;
}

function ListHeader({ categories, router }: ListHeaderProps) {
  return (
    <>
      {/* Banners */}
      <Section>
        <Carousel<BannerItem>
          style={{ width: "100%" }}
          loop
          width={width - 40}
          height={180}
          autoPlay
          autoPlayInterval={2000}
          data={banners}
          scrollAnimationDuration={1000}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 40,
          }}
          renderItem={({ item, animationValue }) => (
            <BannerSlide
              key={item.id}
              item={item}
              animationValue={animationValue}
            />
          )}
        />
      </Section>

      {/* Categories */}
      <Section>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={section.title}>Kategoriya</Text>
          <Link href="/(tabs)/catalog" style={{ paddingTop: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#0040B1" }}
              >
                Barchasini ko'rish
              </Text>
              <RightIcon size={18} color="#0040B1" stroke={2} />
            </View>
          </Link>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: GAP }}>
          {[...categories]
            .reverse()
            .slice(0, 8)
            .map((item: any) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/products",
                    params: { categoryId: item.id, categoryName: item.name },
                  })
                }
              >
                <View
                  style={{
                    width: ITEM_SIZE,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: ITEM_SIZE,
                      height: ITEM_SIZE,
                      aspectRatio: 1,
                      borderRadius: 12,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <Image
                      source={{
                        uri: `https://api.bunyodoptom.uz${item.image}`,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      color: "#0040B1",
                      fontSize: 14,
                      fontWeight: "600",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </Section>

      <View style={{ paddingHorizontal: 20 }}>
        <Text style={section.title}>Sizga yoqadiganlar</Text>
      </View>
    </>
  );
}

// ── Main screen ────────────────────────────────────────────
// ── Main screen ────────────────────────────────────────────
export default function HomeScreen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductsType | null>(
    null,
  );
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useAllProducts();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const openSheet = useCallback((item: ProductsType): void => {
    setSelectedProduct(item);
    bottomSheetRef.current?.present();
  }, []);

  const closeSheet = useCallback((): void => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.5}
      />
    ),
    [],
  );

  if (isProductsLoading || isCategoriesLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (isProductsError || isCategoriesError) {
    return (
      <View style={errorStyles.container}>
        <View style={errorStyles.iconWrap}>
          <Text style={errorStyles.iconText}>⚠️</Text>
        </View>
        <Text style={errorStyles.title}>Xatolik yuz berdi</Text>
        <Text style={errorStyles.subtitle}>
          Ma'lumotlarni yuklab bo'lmadi. Internet aloqangizni tekshirib, qayta
          urinib ko'ring.
        </Text>
        <TouchableOpacity
          style={errorStyles.retryBtn}
          activeOpacity={0.8}
          onPress={() => {
            refetchProducts();
            refetchCategories();
          }}
        >
          <Text style={errorStyles.retryText}>Qayta urinish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const allProducts = data?.pages.flatMap((page: any) => page.data ?? []) ?? [];

  const products = allProducts
    .filter((item: any) => item.images && item.images.length > 0)
    .filter(
      (item: any, index: number, self: any[]) =>
        index === self.findIndex((p) => p.id === item.id),
    );

  return (
    <View style={{ flex: 1 }}>
      <Header products={products} />

      <FlatList
        data={products}
        keyExtractor={(item: any, i) => item.id?.toString() ?? i.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 16, paddingHorizontal: 20 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ListHeader categories={categories} router={router} />
        }
        renderItem={({ item }) => (
          <ProductCard item={item} openSheet={openSheet} />
        )}
        // ✅ avtomatik onEndReached/onContentSizeChange olib tashlandi
        ListFooterComponent={
          hasNextPage ? (
            <TouchableOpacity
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              style={loadMoreBtn.button}
              activeOpacity={0.8}
            >
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#0040B1" />
              ) : (
                <Text style={loadMoreBtn.text}>Yana ko'rsatish</Text>
              )}
            </TouchableOpacity>
          ) : null
        }
      />

      {/* ── Bottom Sheet ── */}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["80%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onDismiss={closeSheet}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        handleIndicatorStyle={sheet.indicator}
      >
        <BottomSheetView style={sheet.content}>
          {selectedProduct && <ProductSheet product={selectedProduct} />}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────

const section = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 24,
    lineHeight: 26,
  },
});

const styles = StyleSheet.create({
  content: { paddingBottom: 40, gap: 16 },
});

const sheet = StyleSheet.create({
  indicator: { backgroundColor: "#C4C4C4", width: 40 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },
  imageWrap: {
    width: "100%",
    height: "auto",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    aspectRatio: 4 / 3,
  },
  info: { gap: 4 },
  productName: { fontSize: 18, fontWeight: "700", color: "#111" },
  productCategory: { fontSize: 14, color: "#6B7280" },
  price: { fontSize: 20, fontWeight: "700", color: "#0040B1", marginTop: 4 },
  addBtn: {
    backgroundColor: "#0040B1",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    flex: 1,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});

const loadMoreBtn = StyleSheet.create({
  button: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#0040B1",
  },
  text: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});
