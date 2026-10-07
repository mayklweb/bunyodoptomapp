import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function VerifyOtpScreen() {
  const router = useRouter();

  const { phone, type } = useLocalSearchParams<{
    phone: string;
    type?: "signup" | "login" | "reset-password";
  }>();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(60);

  const inputRef = useRef<TextInput>(null);

  const verifyOtp = useMutation({
    mutationFn: () =>
      authService.verifyOtp({
        phone,
        code,
      }),
  });

  const resendOtp = useMutation({
    mutationFn: () => authService.sendOtp(phone),
  });

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleVerify = () => {
    setError("");

    if (code.length !== 6) {
      setError("6 xonali kodni kiriting");
      return;
    }

    verifyOtp.mutate(undefined, {
      onSuccess: () => {
        if (type === "reset-password") {
          router.replace({
            pathname: "/forgot-password",
            params: {
              phone,
            },
          });

          return;
        }

        if (type === "signup") {
          // Keyin signup'ni yakunlash logicini qo'shamiz
          router.replace("/login");
          return;
        }

        if (type === "login") {
          // Keyin login OTP logicini qo'shamiz
          router.replace("/profile");
        }
      },

      onError: (error: any) => {
        setError(error?.response?.data?.message || "Tasdiqlash kodi noto'g'ri");
      },
    });
  };

  const handleResend = () => {
    if (seconds > 0 || resendOtp.isPending) return;

    setError("");

    resendOtp.mutate(undefined, {
      onSuccess: () => {
        setCode("");
        setSeconds(60);
        inputRef.current?.focus();
      },

      onError: (error: any) => {
        setError(
          error?.response?.data?.message || "SMS yuborishda xatolik yuz berdi",
        );
      },
    });
  };

  const formattedPhone = phone
    ? `+998 ${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(
        5,
        7,
      )} ${phone.slice(7, 9)}`
    : "";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <View className="flex-1 px-6 pt-20">
        <Text className="text-3xl font-bold text-black">Tasdiqlash kodi</Text>

        <Text className="mt-3 text-base leading-6 text-gray-500">
          {formattedPhone} raqamiga yuborilgan 6 xonali kodni kiriting.
        </Text>

        <View className="mt-10">
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(value) => {
              setError("");
              setCode(value.replace(/\D/g, "").slice(0, 6));
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            placeholder="000000"
            className="h-16 rounded-2xl border border-gray-200 px-4 text-center text-2xl font-semibold tracking-[8px]"
          />

          {error ? (
            <Text className="mt-3 text-center text-sm text-red-500">
              {error}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleVerify}
          disabled={code.length !== 6 || verifyOtp.isPending}
          className="mt-6 h-14 items-center justify-center rounded-2xl bg-[#0040B1]"
        >
          {verifyOtp.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              Tasdiqlash
            </Text>
          )}
        </Pressable>

        <View className="mt-6 items-center">
          {seconds > 0 ? (
            <Text className="text-sm text-gray-500">
              Kodni qayta yuborish:{" "}
              <Text className="font-semibold text-black">{seconds}s</Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text className="text-sm font-semibold text-[#0040B1]">
                {resendOtp.isPending
                  ? "Yuborilmoqda..."
                  : "Kodni qayta yuborish"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
