import { HeartIcon, LeftArrowIcon, LeftIcon } from "@/components/icons";
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
import { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useProduct } from "@/hooks/useProducts";
import { data } from "@/utils/constants";
import { useCartStore } from "@/store/cart.store";

const { width } = Dimensions.get("window");

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading, isError, error } = useProduct(id);

  const {addToCart} = useCartStore()

  const product = data.find((p: any) => p.id === Number(id));


  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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
              aspectRatio: 4/3,
              backgroundColor: "#E8EDF5",
            }}
          >
            {images.length > 0 ? (
              <Image
                source={{ uri: "https://api.bunyodoptom.uz" + product?.images?.[0]?.url, }}
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

            {/* Stock badge */}
            {/* <View
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                backgroundColor: inStock ? "#0040B1" : "#9ca3af",
                borderRadius: 100,
                paddingHorizontal: 14,
                paddingVertical: 7,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              />
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                {inStock
                  ? `${product.stock_qty.toLocaleString()} dona mavjud`
                  : "Mavjud emas"}
              </Text>
            </View> */}
          </View>

          {/* THUMBNAILS */}
          {/* {images.length > 1 && (
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
                      source={{ uri: "https://api.bunyodoptom.uz" + item?.images?.[0]?.url, }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          )} */}

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
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddToCart}
            disabled={!inStock}
            style={{
              height: 56,
              borderRadius: 18,
              backgroundColor: !inStock
                ? "#d1d5db"
                : addedToCart
                  ? "#22c55e"
                  : "#0040B1",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#0040B1",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: inStock ? 0.3 : 0,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {!inStock
                ? "Mavjud emas"
                : addedToCart
                  ? "✓ Savatga qo'shildi"
                  : "Savatga qo'shish"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
