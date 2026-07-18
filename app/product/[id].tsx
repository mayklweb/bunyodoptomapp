import {
  HeartIcon,
  LeftArrowIcon,
  LeftIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/icons";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useState, useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useProduct, useAllProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart.store";

const { width } = Dimensions.get("window");

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError, error } = useProduct(id);

  const { addToCart, inc, dec, getQuantity } = useCartStore();

  // Barcha mahsulotlarni olib, shu kategoriyadagilarini ajratib olamiz
  const { data: allProductsData } = useAllProducts();

  const similarProducts = useMemo(() => {
    if (!product) return [];
    const flat =
      allProductsData?.pages?.flatMap(
        (page: any) => page.items ?? page.data ?? page,
      ) ?? [];
    return flat.filter((p: any) => p.id !== product.id).slice(0, 20);
  }, [allProductsData, product]);

  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [addedCartIds, setAddedCartIds] = useState<Set<number>>(new Set());

  const toggleSimilarFavorite = (productId: number) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleSimilarAddToCart = (item: any) => {
    addToCart(item);
    setAddedCartIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedCartIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 1500);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F7F4",
        }}
      >
        <ActivityIndicator size="large" color="#0040B1" />
        <Text style={{ marginTop: 12, fontSize: 14, color: "#9ca3af" }}>
          Yuklanmoqda...
        </Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F7F4",
          padding: 32,
        }}
      >
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📦</Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#111",
            marginBottom: 8,
          }}
        >
          Mahsulot topilmadi
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6b7280",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {error?.message ?? "Nimadir xato ketdi"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            paddingHorizontal: 28,
            paddingVertical: 14,
            backgroundColor: "#0040B1",
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            Ortga qaytish
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images =
    product.images && product.images.length > 0 ? product.images : [];

  const price = product.piece_price ?? product.kg_price ?? product.price;
  const inStock = product.stock_qty > 0;
  const cartQuantity = getQuantity(product.id);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4" />
      <View style={{ flex: 1, backgroundColor: "#F8F7F4" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* HERO IMAGE */}
          <View
            style={{
              width: "100%",
              aspectRatio: 4 / 3,
              backgroundColor: "#E8EDF5",
            }}
          >
            {images.length > 0 ? (
              <Image
                source={{
                  uri:
                    "https://api.bunyodoptom.uz" +
                    (images[activeImage]?.url ?? images[0]?.url),
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 64 }}>📦</Text>
                <Text style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
                  Rasm mavjud emas
                </Text>
              </View>
            )}

            {/* Top buttons */}
            <View
              style={{
                position: "absolute",
                top: 44,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <LeftArrowIcon size={24} color="#111" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsFavorited(!isFavorited)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <HeartIcon size={20} color={isFavorited ? "#ef4444" : "#111"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <View
              style={{
                backgroundColor: "#fff",
                paddingVertical: 12,
                paddingHorizontal: 20,
              }}
            >
              <FlatList
                data={images}
                keyExtractor={(_, i) => String(i)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setActiveImage(index)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      overflow: "hidden",
                      borderWidth: 2,
                      borderColor:
                        activeImage === index ? "#0040B1" : "transparent",
                      backgroundColor: "#E8EDF5",
                    }}
                  >
                    <Image
                      source={{ uri: "https://api.bunyodoptom.uz" + item?.url }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* CONTENT */}
          <View style={{ padding: 20, gap: 20 }}>
            {/* NAME + PRICE */}
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#111",
                  letterSpacing: -0.3,
                }}
              >
                {product.name}
              </Text>
              <Text
                style={{ fontSize: 24, fontWeight: "800", color: "#0040B1" }}
              >
                {price.toLocaleString()} so'm
              </Text>
            </View>

            {/* SPECS */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#111",
                  marginBottom: 12,
                }}
              >
                Xususiyatlar
              </Text>
              {[
                { label: "Brend", value: product.brand?.name },
                { label: "Kategoriya", value: product.category?.name },
                {
                  label: "Og'irligi",
                  value: product.kg ? `${product.kg} kg` : null,
                },
                {
                  label: "Dona narxi",
                  value: product.piece_price
                    ? `${product.piece_price.toLocaleString()} so'm`
                    : null,
                },
                {
                  label: "Kg narxi",
                  value: product.kg_price
                    ? `${product.kg_price.toLocaleString()} so'm`
                    : null,
                },
                {
                  label: "Holati",
                  value: product.status === "active" ? "Faol" : "Nofaol",
                },
              ]
                .filter((item) => item.value != null)
                .map((item, i, arr) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 11,
                      borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                      borderBottomColor: "#f3f4f6",
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: "#9ca3af",
                        fontWeight: "500",
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{ fontSize: 14, fontWeight: "700", color: "#111" }}
                    >
                      {item.value}
                    </Text>
                  </View>
                ))}
            </View>

            {/* DESCRIPTION */}
            {product.description && (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#111",
                    marginBottom: 8,
                  }}
                >
                  Tavsif
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#6b7280", lineHeight: 22 }}
                >
                  {product.description}
                </Text>
              </View>
            )}

            {/* O'XSHASH MAHSULOTLAR */}
            {similarProducts.length > 0 && (
              <View style={{ gap: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111",
                  }}
                >
                  O'xshash mahsulotlar
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  {similarProducts.map((item: any) => {
                    const isFav = favoritedIds.has(item.id);
                    const justAdded = addedCartIds.has(item.id);
                    const itemPrice =
                      item.piece_price ?? item.kg_price ?? item.price;

                    return (
                      <View
                        key={item.id}
                        style={{
                          width: "48%",
                          backgroundColor: "#fff",
                          borderRadius: 16,
                          overflow: "hidden",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 5,
                          elevation: 2,
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => router.push(`/product/${item.id}`)}
                        >
                          <View
                            style={{
                              width: "100%",
                              height: 120,
                              backgroundColor: "#E8EDF5",
                            }}
                          >
                            {item.images?.[0]?.url ? (
                              <Image
                                source={{
                                  uri:
                                    "https://api.bunyodoptom.uz" +
                                    item.images[0].url,
                                }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text style={{ fontSize: 28 }}>📦</Text>
                              </View>
                            )}
                          </View>

                          <View
                            style={{ padding: 10, paddingBottom: 0, gap: 6 }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color: "#111",
                              }}
                            >
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: "700",
                                color: "#0040B1",
                              }}
                            >
                              {itemPrice?.toLocaleString()} so'm
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* Favorite tugmasi - endi mustaqil, kartadan tashqarida */}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => toggleSimilarFavorite(item.id)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: "rgba(255,255,255,0.95)",
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.15,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          <HeartIcon
                            size={16}
                            color={isFav ? "#ef4444" : "#111"}
                          />
                        </TouchableOpacity>

                        {/* Savatga qo'shish tugmasi - endi mustaqil */}
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => handleSimilarAddToCart(item)}
                          style={{
                            height: 34,
                            borderRadius: 10,
                            backgroundColor: justAdded ? "#22c55e" : "#0040B1",
                            justifyContent: "center",
                            alignItems: "center",
                            marginHorizontal: 10,
                            marginTop: 6,
                            marginBottom: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: "700",
                            }}
                          >
                            {justAdded ? "✓ Qo'shildi" : "Savatga qo'shish"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* STICKY CTA */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFF",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
          }}
        >
          {!inStock ? (
            <View
              style={{
                height: 56,
                borderRadius: 18,
                backgroundColor: "#d1d5db",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Mavjud emas
              </Text>
            </View>
          ) : cartQuantity > 0 ? (
            // Savatga qo'shilgan bo'lsa - miqdorni boshqarish (+/-)
            <View
              style={{
                height: 56,
                borderRadius: 18,
                backgroundColor: "#F5F5F5",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 8,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => dec(product.id)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "#fff",

                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MinusIcon />
              </TouchableOpacity>

              <Text style={{ color: "#000", fontSize: 18, fontWeight: "700" }}>
                {cartQuantity} dona
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => inc(product.id)}
                disabled={cartQuantity >= product.stock_qty}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PlusIcon />
              </TouchableOpacity>
            </View>
          ) : (
            // Hali savatga qo'shilmagan bo'lsa - oddiy tugma
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddToCart}
              style={{
                height: 56,
                borderRadius: 18,
                backgroundColor: "#0040B1",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#0040B1",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                Savatga qo'shish
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}
