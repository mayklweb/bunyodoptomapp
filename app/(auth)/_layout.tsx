// app/(auth)/_layout.tsx
import { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function AuthLayout() {
  const { token, isHydrated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Fabric'ga joriy mount tsiklini yakunlash uchun bitta freym beramiz
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [token]);

  if (!isHydrated || !ready) {
    return null;
  }

  if (token) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}