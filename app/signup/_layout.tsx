import DismissKeyboard from "@/components/DismissKeyboard";
import { Stack } from "expo-router";

export default function SignupLayout() {
  return (
    <DismissKeyboard>
      <Stack
        screenOptions={{
          headerShown: false,
          title: "",
        }}
      >
        <Stack.Screen name="phone" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="details" />
      </Stack>
    </DismissKeyboard>
  );
}
