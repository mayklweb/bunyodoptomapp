import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useFavoriteStore } from "@/stores/favourite.store";
import HeartIcon from "@/components/icons/HeartIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import ProductCard from "@/components/ProductCard";

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width < 720 ? width : 720;
const CARD_SIZE = (CONTENT_WIDTH - 20 * 2 - 16) / 2;

export default function FavoritesScreen() {
  // NOTE: agar store'da funksiya nomi boshqacha bo'lsa
  // (masalan `toggleFavorite` yoki `remove`), shu yerda almashtiring.
  const { favorites, removeFavorite } = useFavoriteStore();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 32,
          flexGrow: 1,
        }}
      >
        {favorites.length === 0 ? (
          <View style={emptyStyles.wrap}>
            <View style={emptyStyles.iconCircle}>
              <HeartIcon size={32} color="#0040B1" />
            </View>
            <Text style={emptyStyles.title}>Sevimlilar ro'yxati bo'sh</Text>
            <Text style={emptyStyles.subtitle}>
              Yoqtirgan mahsulotlaringizni {"\u2764\ufe0f"} tugmasi orqali shu
              yerga qo'shing
            </Text>
            <TouchableOpacity
              style={emptyStyles.ctaButton}
              activeOpacity={0.85}
              onPress={() => router.push("/catalog")}
            >
              <Text style={emptyStyles.ctaText}>Katalogga o'tish</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {favorites.map((item) => (
              <View key={item.id} style={{ width: CARD_SIZE }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  // FIX: mahsulot ustiga bosilganda product sahifasiga o'tish.
                  // Route nomini loyihangizga mos ravishda tekshiring
                  // (masalan "/product/[id]" yoki "/catalog/[id]").
                  onPress={() =>
                    router.push({
                      pathname: "/product/[id]",
                      params: { id: String(item.id) },
                    })
                  }
                >
                  <ProductCard item={item} width={CARD_SIZE} />
                </TouchableOpacity>

                {/* FIX: sevimlilardan o'chirish tugmasi */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  activeOpacity={0.8}
                  hitSlop={8}
                  onPress={() => removeFavorite(item.id)}
                >
                  <HeartIcon size={18} color="#EF4444" filled />
                  {/* <CloseIcon size={14} color="#000" /> */}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

const emptyStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  ctaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
