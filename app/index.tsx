import { Redirect } from "expo-router";
import { View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, paddingTop: insets.top }}></View>
      <Redirect href="/home" />
    </SafeAreaProvider>
  );
}
