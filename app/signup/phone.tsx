import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, router } from "expo-router";

import LeftIcon from "@/components/icons/LeftIcon";
import { colors } from "@/styles/globalStyles";

const API_URL = "https://api.bunyodoptom.uz/api/v1";

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);

  if (!digits) return "";

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 5) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(
    5,
    7,
  )}-${digits.slice(7, 9)}`;
};

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = phone.length === 9;

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    setPhone(digits);

    if (error) {
      setError("");
    }
  };

  const handleContinue = async () => {
    if (!isValid || loading) return;

    setError("");
    setLoading(true);

    try {
      // 1. Telefon raqam mavjudligini tekshirish
      const checkResponse = await fetch(`${API_URL}/users/check-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
        }),
      });

      const checkData = await checkResponse.json().catch(() => null);

      if (!checkResponse.ok) {
        throw new Error(
          checkData?.message ||
            "Telefon raqamini tekshirishda xatolik yuz berdi",
        );
      }

      // 2. Telefon allaqachon mavjud
      if (checkData?.data?.exists) {
        setError("Bu telefon raqami allaqachon ro'yxatdan o'tgan");
        return;
      }

      // 3. Telefon mavjud emas → OTP yuborish
      const otpResponse = await fetch(`${API_URL}/users/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
        }),
      });

      const otpData = await otpResponse.json().catch(() => null);

      if (!otpResponse.ok) {
        throw new Error(otpData?.message || "SMS yuborishda xatolik yuz berdi");
      }

      // 4. OTP verification
      router.push({
        pathname: "/signup/verify",
        params: {
          phone,
        },
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        <View>
          <Text style={styles.title}>Telefon raqamingiz</Text>

          <Text style={styles.subtitle}>
            Ro'yxatdan o'tish uchun telefon raqamingizni kiriting
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Telefon raqam</Text>

            <View
              style={[
                styles.input,
                focused && styles.inputFocused,
                error && styles.inputError,
              ]}
            >
              <Text style={styles.prefix}>+998</Text>

              <TextInput
                value={formatPhone(phone)}
                onChangeText={handlePhoneChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="(90) 123-45-67"
                placeholderTextColor="#A1A1AA"
                keyboardType="phone-pad"
                maxLength={14}
                autoFocus
                style={styles.phoneInput}
              />
            </View>

            {error ? <Text style={styles.fieldError}>{error}</Text> : null}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Davom etish</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hisobingiz bormi?</Text>

          <Link href="/login" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.registerText}>Kirish</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
    backgroundColor: "#FFF",
  },

  content: {
    gap: 28,
    marginTop: 64,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },

  backText: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    color: "#18181B",
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    color: "#71717A",
    fontSize: 14,
    lineHeight: 20,
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

  input: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
  },

  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "#FFFFFF",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  prefix: {
    marginRight: 8,
    color: "#18181B",
    fontSize: 16,
    fontWeight: "600",
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    color: "#18181B",
    fontSize: 16,
    fontWeight: "500",
  },

  fieldError: {
    marginLeft: 4,
    color: "#DC2626",
    fontSize: 12,
    lineHeight: 16,
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },

  buttonDisabled: {
    backgroundColor: "#D4D4D8",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  footerText: {
    color: "#71717A",
    fontSize: 14,
  },

  registerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
