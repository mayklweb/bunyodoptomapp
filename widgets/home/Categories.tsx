import CategoryCard from "@/components/CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { Link, router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const GAP = 10;
const CARD_SIZE = ((width < 720 ? width : 720) - GAP * 5 - 20) / 4;

export default function Categories() {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch,
  } = useCategories();

  // --- LOADING holati ---
  if (isCategoriesLoading) {
    return (
      <View style={{ marginTop: 24 }}>
        <View style={headerRow.row}>
          <Text style={section.title}>Kategoriya</Text>
        </View>
        <View style={loadingStyles.wrap}>
          <ActivityIndicator size="small" color="#0040B1" />
        </View>
      </View>
    );
  }

  // --- ERROR holati ---
  if (isCategoriesError) {
    return (
      <View style={{ marginTop: 24 }}>
        <View style={headerRow.row}>
          <Text style={section.title}>Kategoriya</Text>
        </View>
        <View style={errorStyles.container}>
          <View style={errorStyles.iconWrap}>
            <Text style={errorStyles.iconText}>⚠️</Text>
          </View>
          <Text style={errorStyles.title}>Kategoriyalarni yuklab bo'lmadi</Text>
          <Text style={errorStyles.subtitle}>
            Internet aloqasini tekshirib, qayta urinib ko'ring
          </Text>
          <TouchableOpacity
            style={errorStyles.retryBtn}
            onPress={() => refetch?.()}
            activeOpacity={0.8}
          >
            <Text style={errorStyles.retryText}>Qayta urinish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- EMPTY holati (ma'lumot yo'q) ---
  if (!categories || categories.length === 0) {
    return (
      <View style={{ marginTop: 24 }}>
        <View style={headerRow.row}>
          <Text style={section.title}>Kategoriya</Text>
        </View>
        <Text style={{ color: "#8E8E93", marginTop: 12 }}>
          Hozircha kategoriyalar mavjud emas
        </Text>
      </View>
    );
  }

  // --- ODDIY holat (ma'lumot bor) ---
  return (
    <View style={{ marginTop: 24 }}>
      <View style={headerRow.row}>
        <Text style={section.title}>Kategoriya</Text>
        <Link href={"/catalog" as any} style={{}}>
          Barchasini ko'rish
        </Link>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: GAP,
          marginTop: 12,
        }}
      >
        {[...categories]
          .reverse()
          .slice(0, 8)
          .map((item: any) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/catalog/[category]",
                  params: { category: item.id, categoryName: item.name },
                })
              }
            >
              <CategoryCard
                cardSize={CARD_SIZE}
                name={item.name}
                image={item.image}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const headerRow = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const section = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});

const loadingStyles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

const errorStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
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