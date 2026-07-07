import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { C } from "@/lib/theme";
import { HeartIcon } from "./icons";
import { useFavoritesStore } from "@/store/favourite.store";
import { ProductsType } from "@/types/types";

type Props = {
  item: ProductsType;
  onAddToCart?: (item: ProductsType) => void;
  onPress?: (item: ProductsType) => void;
  openSheet?: (item: ProductsType) => void;
};

const { width } = Dimensions.get("window");

// const CARD_SIZE = (width - 20 * 2 - 16) / 2;

const CARD_SIZE = ((width < 720 ? width : 720) - 20 * 2 - 20) / 2;

export function ProductCard({ item, onPress, openSheet }: Props) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const liked = isFavorite(item.id);

  return (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      onPress={() => openSheet?.(item)}
      style={{ width: CARD_SIZE }}
    >
      <View
        style={{
          width: CARD_SIZE,
          aspectRatio: 4 / 3,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#fff",
          position: "relative",
          shadowColor: "#000",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 6,
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: "#fff",
            borderRadius: 100,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
          activeOpacity={0.7}
          onPress={() => toggleFavorite(item)}
        >
          <HeartIcon
            size={20}
            color={liked ? "#FF4D4D" : "#404040"}
            style={{ fill: "#000", background: "#000" }}
            className="fill-red-600"
          />
        </TouchableOpacity>

        <Image
          source={{
            uri: "https://api.bunyodoptom.uz" + item?.images?.[0]?.url,
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View style={{ marginTop: 8, gap: 2 }}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ fontSize: 16, fontWeight: "600", color: "#404040" }}
        >
          {item.name}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#0040B1" }}>
          {item.price.toLocaleString("uz-Latn-uz")} so'm
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    flex: 1,
  },
  imgBox: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  emoji: { fontSize: 34 },
  wishBtn: {
    position: "absolute",
    top: 7,
    right: 7,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  info: { padding: 8, paddingBottom: 28 },

  priceRow: { flexDirection: "row", alignItems: "baseline" },
  name: { fontSize: 16, fontWeight: "600", color: "#404040" },
  price: { fontSize: 16, fontWeight: "700", color: "#0040B1" },
  cur: { fontSize: 10, color: C.muted },
  addBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
