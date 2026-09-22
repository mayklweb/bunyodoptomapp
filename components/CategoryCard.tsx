import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Text,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

type CategoryCardProps = ViewProps & {
  name: string;
  image: ImageSourcePropType | string;
  textSize?: number;
  textStyle?: TextStyle;
  imageStyle?: ViewStyle;
  borderRadius?: number;
  cardSize?: number;
};

// const { width } = Dimensions.get("window");
// const cardSize = ((width < 720 ? width : 720) - 19 * 2 - 19) / 2;

function CategoryCard({
  name,
  image,
  style,
  textSize = 12,
  textStyle,
  imageStyle,
  borderRadius = 12,
  cardSize,
}: CategoryCardProps) {
  const source =
    typeof image === "string"
      ? { uri: `https://api.bunyodoptom.uz${image}` }
      : image;

  return (
    <View
      style={[
        {
          width: cardSize,
          height: cardSize,
          borderRadius: borderRadius,
          backgroundColor: "#FFF",
          shadowColor: "#000",
          shadowOffset: { width: 0.5, height: 0.5 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        style,
      ]}
    >
      <View style={[{ aspectRatio: 4 / 3, overflow: "hidden" }, imageStyle]}>
        <Image
          style={{ width: "100%", height: "100%", borderRadius }}
          source={source}
          resizeMode="cover"
        />
      </View>

      <Text
        style={[
          {
            fontSize: textSize,
            fontWeight: "600",
            textAlign: "center",
            paddingVertical: 3,
            paddingHorizontal: 10,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
}

export default CategoryCard;
