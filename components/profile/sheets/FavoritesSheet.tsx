import React from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { useFavoritesStore } from "@/store/favourite.store";
import { ProductCard } from "@/components/ProductCard";

export default function FavoritesSheet() {
  const { favorites } = useFavoritesStore();

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 32,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {favorites.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </View>
    </BottomSheetScrollView>
  );
}
