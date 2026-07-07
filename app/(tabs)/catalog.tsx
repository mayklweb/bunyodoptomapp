import { router } from "expo-router";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import Section from "@/components/layout/Section";
import { Dimensions, StyleSheet } from "react-native";
import { Header } from "@/components/Header";
import { useCategories } from "@/hooks/useCategories";

const { width } = Dimensions.get("window");
const CARD_SIZE = ((width < 720 ? width : 720) - 20 * 2 - 20) / 2;


export default function CatalogScreen() {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();
  return (
    <View style={{ flex: 1, backgroundColor: "#F8F7F4" }}>
      {/* Header */}
      <Header />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Section>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {[...categories].reverse().map((cat: any) => (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/products",
                    params: { categoryId: cat.id, categoryName: cat.name },
                  })
                }
                style={{ width: CARD_SIZE }}
              >
                <View style={categoryStyles.imageWrap}>
                  <Image
                    source={{ uri: `https://api.bunyodoptom.uz${cat.image}` }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>
                <Text style={categoryStyles.label}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const categoryStyles = StyleSheet.create({
  imageWrap: {
    width: CARD_SIZE,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    marginTop: 8,
    color: "#0040B1",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
});
