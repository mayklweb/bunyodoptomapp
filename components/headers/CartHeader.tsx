import { View, Text } from "react-native";

export default function CartHeader() {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#FFF",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      }}
    >
      <Text
        style={{
          color: "#111111",
          fontSize: 22,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        SAVAT
      </Text>
    </View>
  );
}
