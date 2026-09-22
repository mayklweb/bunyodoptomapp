import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import HeartIcon from "@/components/icons/Hearticon";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { useProduct, useAllProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart.store";
import { colors } from "@/styles/globalStyles";
import { useFavoriteStore } from "@/store/favourite.store";

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width < 720 ? width : 720;
const CARD_SIZE = (CONTENT_WIDTH - 20 * 2 - 16) / 2;

interface ProductImage {
  url?: string;
}

interface ProductCategory {
  name?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  images?: ProductImage[];
  categoryId?: number;
  category?: ProductCategory;
}

interface CartItem {
  id: number;
  count: number;
}

interface ProductPage {
  data?: Product[];
}

interface RelatedProductsData {
  pages: ProductPage[];
}

function formatPrice(price: number): string {
  return price.toLocaleString("uz-UZ") + " so\u02bbm";
}

export default function ProductDetailScreen() {
  // route: /product/[id]
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: product, isLoading, isError } = useProduct(id);
  const [activeIndex, setActiveIndex] = useState(0);

  const { cart, addToCart, changeQty } = useCartStore();
  const { favorites, toggleFavorite, isFavorite } = useFavoriteStore();

  // Shu kategoriyadagi boshqa mahsulotlar
  const { data: relatedData } = useAllProducts(product?.categoryId);

  const relatedProducts = useMemo(() => {
    if (!relatedData || !product) return [];

    return (
      relatedData.pages
        .flatMap((page: any) => page.data ?? [])
        .filter(
          (item: any) =>
            item.id !== product.id && item.images && item.images.length > 0,
        )
        .slice(0, 10) ?? []
    );
  }, [relatedData, product]);

  const images = useMemo<string[]>(() => {
    if (!product) return [];

    if (typeof product.image === "string") {
      return [product.image];
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(
        (img: ProductImage): string =>
          `https://api.bunyodoptom.uz${img?.url ?? ""}`,
      );
    }

    return [];
  }, [product]);

  const cartItem = cart?.find((c: any) => c.id === product?.id);
  const qty = cartItem?.count ?? 0;
  // ProductDetailScreen.tsx va Products.tsx da:
  const favorited = product ? isFavorite(product.id) : false;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ header: () => <Header title="Mahsulot" /> }} />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ header: () => <Header title="Mahsulot" /> }} />
        <Text style={styles.notFound}>Mahsulot topilmadi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title={product.name} showBack />,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: images[activeIndex] }} style={styles.image} />

        {images.length > 1 && (
          <View style={styles.thumbRow}>
            {images.map((uri, index) => (
              <Pressable
                key={index}
                onPress={() => setActiveIndex(index)}
                style={[
                  styles.thumbWrap,
                  index === activeIndex && styles.thumbWrapActive,
                ]}
              >
                <Image source={{ uri }} style={styles.thumb} />
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.content}>
          {product.category?.name && (
            <Text style={styles.category}>{product.category.name}</Text>
          )}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.favBtn, favorited && styles.favBtnActive]}
              onPress={() => toggleFavorite(product)}
            >
              <HeartIcon
                color={favorited ? "#E53935" : undefined}
                filled={favorited}
              />
            </Pressable>

            {qty ? (
              <View style={styles.counter}>
                <Pressable
                  onPress={() => changeQty(product.id, -1)}
                  style={styles.counterBtn}
                >
                  <MinusIcon color="#000" />
                </Pressable>

                <View style={styles.counterQtyWrap}>
                  <Text style={styles.counterQty}>{qty}</Text>
                </View>

                <Pressable
                  onPress={() => changeQty(product.id, 1)}
                  style={styles.counterBtn}
                >
                  <PlusIcon color="#000" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.addButton}
                onPress={() => addToCart(product)}
              >
                <Text style={styles.addButtonText}>Savatga qo'shish</Text>
              </Pressable>
            )}
          </View>
        </View>

        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>O'xshash mahsulotlar</Text>

            <View style={styles.relatedRow}>
              {relatedProducts.map((item: any) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  width={CARD_SIZE}
                  onPress={() => router.push(`/product/${item.id}`)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  scroll: {
    paddingBottom: 32,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: colors.background,
  },
  thumbRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbWrapActive: {
    borderColor: colors.primary,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
  },
  favBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  favBtnActive: {
    backgroundColor: "#FDE8E8",
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.colorWhite,
    fontSize: 16,
    fontWeight: "600",
  },
  counter: {
    flex: 1,
    gap: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundWhite,
  },
  counterQtyWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  counterQty: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
  },
  relatedSection: {
    marginTop: 24,
    paddingLeft: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 12,
  },
  relatedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingRight: 16,
  },
  notFound: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textLight,
  },
});
