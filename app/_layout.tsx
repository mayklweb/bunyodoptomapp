import QueryProvider from "@/providers/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Linking, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import * as Application from "expo-application";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

// OTA yangilanish (JS kodi)
async function checkOtaUpdate() {
  if (__DEV__) return;
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert("Yangilanish", "Yangi versiya tayyor", [
        { text: "Keyinroq", style: "cancel" },
        { text: "Yangilash", onPress: () => Updates.reloadAsync() },
      ]);
    }
  } catch (e) {
    console.log("OTA tekshirishda xato:", e);
  }
}

// Do'kon versiyasi (native yangilanish)
async function checkStoreVersion() {
  if (__DEV__) return;
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/mayklweb/bunyod-config/refs/heads/main/version.json",
    );
    const { latest } = await res.json();
    if (latest !== Application.nativeApplicationVersion) {
      Alert.alert("Yangi versiya", "Iltimos, ilovani yangilang", [
        {
          text: "Yangilash",
          onPress: () =>
            Linking.openURL(
              Platform.OS === "android"
                ? "market://details?id=uz.bunyodoptom.app"
                : "https://apps.apple.com/uz/app/bunyod-optom/id6784552770",
            ),
        },
      ]);
    }
  } catch (e) {
    console.log("Versiyani tekshirishda xato:", e);
  }
}

export default function RootLayout() {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  useEffect(() => {
    checkOtaUpdate();
    checkStoreVersion();
  }, []);

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