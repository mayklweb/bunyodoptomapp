import { View } from "react-native";

export default function Container({ children }: any) {
  return (
    <View
      style={{
        maxWidth: 720,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: 20,
        flexGrow: 1,
      }}
    >
      {children}
    </View>
  );
}
