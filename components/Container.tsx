import React from "react";
import { View } from "react-native";

export default function Container({ children }: any) {
  return (
    <View
      style={{
        maxWidth: 720,
        width: "100%",
        marginHorizontal: "auto",
        paddingHorizontal: 20,
      }}
    >
      {children}
    </View>
  );
}
