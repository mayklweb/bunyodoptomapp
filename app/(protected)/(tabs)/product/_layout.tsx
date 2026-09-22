import { Stack } from "expo-router";

// "product" papkasi ichida [id].tsx bor - shuning uchun bu yerda ham
// alohida Stack kerak. Header'ni [id].tsx ning o'zi ichida
// (Stack.Screen options orqali) dinamik belgilaymiz.
export default function ProductLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
