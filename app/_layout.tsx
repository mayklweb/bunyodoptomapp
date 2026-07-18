import { enableScreens } from "react-native-screens";
enableScreens(false);

import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QueryProvider from "@/providers/QueryProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryProvider>
          <ScreenWrapper>
            <Stack screenOptions={{ headerShown: false }}></Stack>
          </ScreenWrapper>
          <Toast />
        </QueryProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
