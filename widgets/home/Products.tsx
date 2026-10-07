import HeartIcon from "@/components/icons/HeartIcon";
import MinusIcon from "@/components/icons/MinusIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/products/useProducts";
import { useCartStore } from "@/stores/cart.store";
import { useFavoriteStore } from "@/stores/favourite.store";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width < 720 ? width : 720;
const CARD_SIZE = (CONTENT_WIDTH - 20 * 2 - 16) / 2;

type ProductsProps = {
  categoryId?: string | number;
};

export default function Products({ categoryId }: ProductsProps) {
  const { data: allProducts = [], isLoading } = useProducts();

  const [randomProducts, setRandomProducts] = useState<any[]>([]);

  const generateRandomProducts = useCallback(() => {
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);

    setRandomProducts(shuffled);
  }, [allProducts]);

  useEffect(() => {
    if (allProducts.length) {
      generateRandomProducts();
    }
  }, [allProducts, generateRandomProducts]);

  const { cart, changeQty, addToCart } = useCartStore();

  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  const [product, setProduct] = useState<any>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const cartItem = cart?.find((c: any) => c.id === product?.id);
  const qty = cartItem?.count ?? 0;
  const favorited = product ? isFavorite(Number(product.id)) : false;

  const openSheet = useCallback((item: any) => {
    setProduct(item);
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={section.title}>Sizga yoqadiganlar</Text>
      </View>

      {isLoading ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0040B1" />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
              paddingVertical: 16,
            }}
          >
            {randomProducts.map((item: any) => (
              <ProductCard
                key={item.id}
                item={item}
                width={CARD_SIZE}
                onPress={() => openSheet(item)}
              />
            ))}
          </View>
        </>
      )}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["80%"]}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        handleIndicatorStyle={sheet.indicator}
      >
        <BottomSheetView style={sheet.content}>
          {product && (
            <View style={{ flex: 1, gap: 16 }}>
              <View style={sheet.imageWrap}>
                <Image
                  source={{
                    uri:
                      "https://api.bunyodoptom.uz" + product?.images?.[0]?.url,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>

              <View style={sheet.info}>
                <Text style={sheet.productName}>{product.name}</Text>
                <Text style={sheet.price}>
                  {product.price.toLocaleString("uz-Latn-uz")} so'm
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[sheet.favBtn, favorited && sheet.favBtnActive]}
                  onPress={() => toggleFavorite(product)}
                >
                  <HeartIcon
                    color={favorited ? "#E53935" : undefined}
                    filled={favorited}
                  />
                </TouchableOpacity>

                {qty ? (
                  <View style={sheet.counter}>
                    <TouchableOpacity
                      onPress={() => changeQty(product.id, -1)}
                      activeOpacity={0.8}
                      style={sheet.counterBtn}
                    >
                      <MinusIcon color="#000" />
                    </TouchableOpacity>

                    <View style={sheet.counterQtyWrap}>
                      <Text style={sheet.counterQty}>{qty}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => changeQty(product.id, 1)}
                      activeOpacity={0.8}
                      style={sheet.counterBtn}
                    >
                      <PlusIcon color="#000" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      addToCart(product);
                    }}
                    style={sheet.addBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={sheet.addBtnText}>Savatga qo'shish</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const section = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 24,
    lineHeight: 26,
  },
});

const loadMoreBtn = StyleSheet.create({
  button: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#2e3192",
  },
  text: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});

const sheet = StyleSheet.create({
  imageWrap: {
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  info: {
    gap: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#18181b",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0040B1",
  },
  favBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  favBtnActive: {
    backgroundColor: "#FDE8E8",
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#0040B1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  counter: {
    flex: 1,
    gap: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    justifyContent: "space-between",
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  counterQtyWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  counterQty: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  indicator: { backgroundColor: "#C4C4C4", width: 40 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },
});
