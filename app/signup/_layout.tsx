import { Stack } from "expo-router";

export default function SignupLayout() {
  return (
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
  );
}
