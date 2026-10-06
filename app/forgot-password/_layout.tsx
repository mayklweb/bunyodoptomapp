import DismissKeyboard from "@/components/DismissKeyboard";
import { Stack } from "expo-router";

export default function ForgotPasswordLayout() {
  return (
    <DismissKeyboard>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="new-password" />
      </Stack>
    </DismissKeyboard>
  );
}
