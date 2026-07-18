import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QueryProvider from "@/providers/QueryProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth.store";

export default function Layout() {
  const { token, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryProvider>
          <ScreenWrapper>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!!token}>
                <Stack.Screen name="(tabs)" />
              </Stack.Protected>
              <Stack.Protected guard={!token}>
                <Stack.Screen name="(auth)" />
              </Stack.Protected>
            </Stack>
          </ScreenWrapper>
          <Toast />
        </QueryProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}