import { Stack } from "expo-router";
import Header from "@/components/Header";

// "catalog" tab ichida 2 ta screen bor: index va [category].
// Shu sababli bu yerda alohida Stack kerak — har biriga o'z header'ini
// (tabs)/_layout.tsx dagi umumiy `header` o'rniga shu yerda belgilaymiz.
export default function CatalogLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header showSearch />,
        }}
      />
      <Stack.Screen
        name="[category]"
        options={{
          header: () => <Header title="Kategoriya" showBack />,
        }}
      />
    </Stack>
  );
}
