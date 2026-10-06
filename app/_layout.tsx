import DismissKeyboard from "@/components/DismissKeyboard";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/utils/authContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <AuthProvider>
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

                    <Stack.Screen
                      name="login"
                      options={{ headerShown: false }}
                    />

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
                </SafeAreaView>
              </View>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
      </QueryProvider>
    </AuthProvider>
  );
}
