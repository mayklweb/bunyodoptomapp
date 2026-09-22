import React from "react";
import { Keyboard, TouchableWithoutFeedback, View, ViewStyle } from "react-native";

type DismissKeyboardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function DismissKeyboard({ children, style }: DismissKeyboardProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </TouchableWithoutFeedback>
  );
}