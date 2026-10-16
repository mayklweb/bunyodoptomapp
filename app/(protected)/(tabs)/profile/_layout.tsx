// profile/_layout.tsx

import { Redirect, Stack } from "expo-router";
import Header from "@/components/Header";
import { useAuthStore } from "@/stores/auth.store";

export default function ProfileLayout() {
  const { token } = useAuthStore((state) => state);

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
      <Stack.Screen name="index" options={{ headerShown: false }} />{" "}
      <Stack.Screen
        name="account"
        options={{
          headerShown: true,
          header: () => <Header title="Ma'lumotlarim" showBack />,
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          headerShown: true,
          header: () => <Header title="Buyurtmalarim" showBack />,
        }}
      />
      <Stack.Screen
        name="favourites"
        options={{
          headerShown: true,
          header: () => <Header title="Sevimlilar" showBack />,
        }}
      />
      <Stack.Screen
        name="store"
        options={{
          headerShown: true,
          header: () => <Header title="Do'konim" showBack />,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerShown: true,
          header: () => <Header title="Biz haqimizda" showBack />,
        }}
      />
      <Stack.Screen
        name="connect"
        options={{
          headerShown: true,
          header: () => <Header title="Bog'lanish" showBack />,
        }}
      />
    </Stack>
  );
}
