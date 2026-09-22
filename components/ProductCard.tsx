import { Image, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { globalStyles } from "../styles/globalStyles";

type ProductCardProps = {
  item?: any;
  width: number;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function ProductCard({
  item,
  width,
  onPress,
  style,
}: ProductCardProps) {
  const source =
    typeof item?.image !== "string"
      ? { uri: `https://api.bunyodoptom.uz${item?.images?.[0]?.url ?? ""}` }
      : item?.image;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[globalStyles.card, { width }, style]}
    >
      <View style={globalStyles.cardImageWrapper}>
        <Image
          style={globalStyles.cardImage}
          source={source}
          resizeMode="cover"
        />
      </View>

      <View style={globalStyles.cardInfo}>
        <Text style={globalStyles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={globalStyles.cardPrice}>
          {item.price?.toLocaleString()} so'm
        </Text>
      </View>
    </TouchableOpacity>
  );
}