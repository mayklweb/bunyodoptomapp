// profile/_layout.tsx

import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useUser } from "@/hooks/useAuth";
import Header from "@/components/Header";

export default function ProfileLayout() {
  const { token } = useUser();

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator />
  //     </View>
  //   );
  // }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {" "}
      <Stack.Screen
        name="account"
        options={{ headerShown: true, header: () => <Header title="Profil" showBack /> }}
      />{" "}
      <Stack.Screen
        name="orders"
        options={{headerShown: true, header: () => <Header title="Buyurtmalarim" showBack /> }}
      />{" "}
      <Stack.Screen
        name="addresses"
        options={{ header: () => <Header title="Manzillarim" /> }}
      />{" "}
    </Stack>
  );
}
