import { useState, useRef, useEffect, useCallback } from "react";
import { colors, globalStyles } from "@/styles/globalStyles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LeftIcon from "@/components/icons/LeftIcon";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyScreen() {
  const params = useLocalSearchParams<{ phone: string }>();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const hiddenInput = useRef<TextInput | null>(null);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  useEffect(() => {
    const t = setTimeout(() => hiddenInput.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  const handleVerify = useCallback(
    async (fullCode: string) => {
      if (loading || fullCode.length !== CODE_LENGTH) return;
      setError("");
      setLoading(true);

      try {
        const res = await fetch(
          "https://api.bunyodoptom.uz/api/v1/users/verify-otp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, code: fullCode }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Kod noto'g'ri");
        }

        router.push({
          pathname: "/signup/details",
          params: { phone, verificationToken: data.verificationToken },
        });
      } catch (e: any) {
        setError(e.message || "Kod noto'g'ri, qayta urinib ko'ring");
        setCode("");
        hiddenInput.current?.focus();
      } finally {
        setLoading(false);
      }
    },
    [loading, phone],
  );

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      handleVerify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleChange = (text: string) => {
    setCode(text.replace(/\D/g, "").slice(0, CODE_LENGTH));
    if (error) setError("");
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    try {
      await fetch("https://api.bunyodoptom.uz/api/v1/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setCode("");
      hiddenInput.current?.focus();
      setTimer(RESEND_SECONDS);
    } catch {
      setError("Kodni qayta yuborishda xatolik");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        gap: 80,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 720,
        paddingHorizontal: 20,
        marginHorizontal: "auto",
        backgroundColor: "#FFF",
      }}
    >
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

      <View>
        <View>
          <Text style={styles.title}>Kodni tasdiqlang</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.phone}>+998{phone}</Text> raqamiga yuborilgan 6
            xonali kodni kiriting
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Tasdiqlash kodi</Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => hiddenInput.current?.focus()}
              style={styles.codeRow}
            >
              {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                const digit = code[i] || "";
                const isCurrent = i === code.length;
                return (
                  <View
                    key={i}
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

        {loading ? (
          <View style={styles.button}>
            <ActivityIndicator color="#fff" />
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

        <TouchableOpacity
          onPress={handleResend}
          disabled={timer > 0}
          style={styles.resendWrap}
        >
          <Text style={styles.resend}>
            {timer > 0 ? `Qayta yuborish (${timer}s)` : "Kodni qayta yuborish"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: "#18181B" },
  subtitle: {
    fontSize: 14,
    color: "#71717A",
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },
  phone: { color: "#18181B", fontWeight: "600" },

  form: { gap: 20 },
  field: { gap: 7 },

  label: {
    marginLeft: 4,
    color: "#3F3F46",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
  },

  codeRow: { flexDirection: "row", justifyContent: "space-between" },

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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  resendWrap: { marginTop: 24, alignItems: "center" },
  resend: { color: "#71717A", fontSize: 14, fontWeight: "500" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  backText: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "600",
  },
});
