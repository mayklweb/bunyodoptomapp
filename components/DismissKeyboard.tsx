import React from "react";
import { Keyboard, Pressable, StyleProp, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function DismissKeyboard({ children, style }: Props) {
  return (
    <Pressable
      style={[{ flex: 1 }, style]}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      {children}
    </Pressable>
  );
}