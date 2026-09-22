import Header from "@/components/Header";
import { useProfile } from "@/hooks/useProfile";
import { AuthContext } from "@/utils/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)", // anchor
};

export default function ProtectedLayout() {
  const { data: user } = useProfile();

  // if (!user) {
  //   return <Redirect href="/login" />;
  // }

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
