import { View, Text } from "react-native";

export default function ProfileHeader() {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#FFF",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        // iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        // Android
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
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
        PROFIL
      </Text>
    </View>
  );
}
