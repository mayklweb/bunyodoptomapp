import Header from "@/components/Header";
import {  Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function ProtectedLayout() {

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="search"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen
        name="checkout"
        options={{
          title: "Buyurtmalar",
          headerShown: true,
          header: () => <Header title="Buyurtmalar" showBack center />,
        }}
      />
    </Stack>
  );
}
