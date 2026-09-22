import CategoryCard from "@/components/CategoryCard";
import Container from "@/components/Container";
import { useCategories } from "@/hooks/useCategories";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = ((width < 720 ? width : 720) - 19 * 2 - 18.5) / 2;

export default function ProductsScreen() {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch,
  } = useCategories();


  // --- LOADING holati ---
  if (isCategoriesLoading) {
    return (
      <View style={loadingStyles.wrap}>
        <ActivityIndicator size="large" color="#0040B1" />
      </View>
    );
  }

  // --- ERROR holati ---
  if (isCategoriesError) {
    return (
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
          activeOpacity={0.8}
          onPress={() => refetch?.()}
        >
          <Text style={errorStyles.retryText}>Qayta urinish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- EMPTY holati ---
  if (!categories || categories.length === 0) {
    return (
      <View style={loadingStyles.wrap}>
        <Text style={{ color: "#8E8E93" }}>
          Hozircha kategoriyalar mavjud emas
        </Text>
      </View>
    );
  }

  // --- ODDIY holat ---
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {[...categories].reverse().map((cat: any) => (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/catalog/[category]",
                    params: { category: cat.id },
                  })
                }
              >
                <CategoryCard
                  name={cat.name}
                  image={cat.image}
                  textSize={24}
                  cardSize={CARD_SIZE}
                  borderRadius={24}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  iconText: { fontSize: 24 },
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