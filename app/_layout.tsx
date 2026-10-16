import QueryProvider from "@/providers/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Сохранённая сессия прочитана -> закрываем сплэш
  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  
  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <View style={{ flex: 1, backgroundColor: "#FFF" }}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
              <StatusBar style="dark" />
              <Stack>
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />

                <Stack.Screen name="login" options={{ headerShown: false }} />

                <Stack.Screen
                  name="signup"
                  options={{
                    headerShown: false,
                    title: "Ro'yxatdan o'tish",
                    headerBackVisible: true,
                    headerBackTitle: "Orqaga",
                  }}
                />

                <Stack.Screen
                  name="forgot-password"
                  options={{ headerShown: false }}
                />
              </Stack>
              <Toast />
            </SafeAreaView>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
