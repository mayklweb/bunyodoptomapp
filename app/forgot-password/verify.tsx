import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { colors } from "@/styles/globalStyles";
import LeftIcon from "@/components/icons/LeftIcon";

import {
  useSendPasswordResetOtp,
  useVerifyPasswordResetOtp,
} from "@/hooks/usePasswordReset";
import { usePasswordResetStore } from "@/stores/password-reset.store";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyScreen() {
  const params = useLocalSearchParams<{ phone?: string }>();
  const setPhone = usePasswordResetStore((state) => state.setPhone);
  const setResetToken = usePasswordResetStore((state) => state.setResetToken);

  const phone = Array.isArray(params.phone)
    ? params.phone[0]
    : params.phone || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);

  const hiddenInput = useRef<TextInput | null>(null);

  const verifyMutation = useVerifyPasswordResetOtp();
  const resendMutation = useSendPasswordResetOtp();

  // Timer
  useEffect(() => {
    if (timer <= 0) return;

    const timeout = setTimeout(() => {
      setTimer((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

  // Auto focus
  useEffect(() => {
    const timeout = setTimeout(() => {
      hiddenInput.current?.focus();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const handleVerify = useCallback(
    async (fullCode: string) => {
      if (
        loading ||
        verifyMutation.isPending ||
        fullCode.length !== CODE_LENGTH
      ) {
        return;
      }

      setError("");
      setLoading(true);

      verifyMutation.mutate(
        {
          phone,
          code: fullCode,
        },
        {
          onSuccess: (res) => {
            const resetToken = res?.data?.resetToken || res?.resetToken;

            if (!resetToken) {
              setError("Tasdiqlash tokeni olinmadi");
              setLoading(false);
              return;
            }

            // Reset flow uchun ma'lumotlarni saqlaymiz
            setPhone(phone);
            setResetToken(resetToken);

            router.replace("/forgot-password/new-password");
          },

          onError: (err: any) => {
            setError(
              err?.response?.data?.message ||
                "Kod noto'g'ri, qayta urinib ko'ring",
            );

            setCode("");
            setLoading(false);

            setTimeout(() => {
              hiddenInput.current?.focus();
            }, 100);
          },
        },
      );
    },
    [loading, phone, verifyMutation],
  );

  // Auto verify after 6 digits
  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      handleVerify(code);
    }
  }, [code, handleVerify]);

  const handleChange = (text: string) => {
    const numericCode = text.replace(/\D/g, "").slice(0, CODE_LENGTH);

    setCode(numericCode);

    if (error) {
      setError("");
    }
  };

  const handleResend = () => {
    if (timer > 0 || resendMutation.isPending) {
      return;
    }

    setError("");

    resendMutation.mutate(phone, {
      onSuccess: () => {
        setCode("");
        setTimer(RESEND_SECONDS);

        setTimeout(() => {
          hiddenInput.current?.focus();
        }, 100);
      },

      onError: (err: any) => {
        setError(
          err?.response?.data?.message || "Kodni qayta yuborishda xatolik",
        );
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Orqaga"
      >
        <LeftIcon />
        <Text style={styles.backText}>Orqaga</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Header */}
        <View>
          <Text style={styles.title}>Kodni tasdiqlang</Text>

          <Text style={styles.subtitle}>
            <Text style={styles.phone}>+998{phone}</Text> raqamiga yuborilgan 6
            xonali kodni kiriting
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Tasdiqlash kodi</Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => hiddenInput.current?.focus()}
              style={styles.codeRow}
            >
              {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                const digit = code[index] || "";
                const isCurrent = index === code.length;

                return (
                  <View
                    key={index}
                    style={[
                      styles.codeBox,
                      isCurrent && styles.inputFocused,
                      Boolean(error) && styles.inputError,
                    ]}
                  >
                    <Text style={styles.codeDigit}>{digit}</Text>
                  </View>
                );
              })}

              <TextInput
                ref={hiddenInput}
                value={code}
                onChangeText={handleChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                editable={!loading}
                style={styles.hiddenInput}
                autoFocus
              />
            </TouchableOpacity>

            {Boolean(error) && <Text style={styles.fieldError}>{error}</Text>}
          </View>
        </View>

        {/* Verify button */}
        {loading ? (
          <View style={styles.button}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : (
          code.length === CODE_LENGTH && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleVerify(code)}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Tasdiqlash</Text>
            </TouchableOpacity>
          )
        )}

        {/* Resend */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={timer > 0 || resendMutation.isPending}
          style={styles.resendWrap}
          activeOpacity={0.7}
        >
          <Text style={styles.resend}>
            {resendMutation.isPending
              ? "Yuborilmoqda..."
              : timer > 0
                ? `Qayta yuborish (${timer}s)`
                : "Kodni qayta yuborish"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 720,
    paddingHorizontal: 20,
    marginHorizontal: "auto",
    backgroundColor: "#FFFFFF",
  },

  content: {
    gap: 0,
    marginTop: 92,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },

  backText: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#18181B",
  },

  subtitle: {
    fontSize: 14,
    color: "#71717A",
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },

  phone: {
    color: "#18181B",
    fontWeight: "600",
  },

  form: {
    gap: 20,
  },

  field: {
    gap: 7,
  },

  label: {
    marginLeft: 4,
    color: "#3F3F46",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
  },

  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  codeBox: {
    width: 48,
    height: 54,
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
  },

  codeDigit: {
    fontSize: 20,
    fontWeight: "600",
    color: "#18181B",
  },

  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },

  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  fieldError: {
    marginLeft: 4,
    color: "#DC2626",
    fontSize: 12,
    lineHeight: 16,
  },

  button: {
    marginTop: 32,
    backgroundColor: colors.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  resendWrap: {
    marginTop: 24,
    alignItems: "center",
  },

  resend: {
    color: "#71717A",
    fontSize: 14,
    fontWeight: "500",
  },
});
