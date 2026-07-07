import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function AuthLayout() {
  const { token, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return null;
  }

  if (token) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
