import { useRouter } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ArrowLeftIcon from "../../components/icons/ArrowLeftIcon";
import { useSendPasswordResetOtp } from "@/hooks/auth/useSendPasswordResetOtp";

const PRIMARY = "#0040B1";

const PHONE_PREFIXES = new Set([
  "20",
  "33",
  "50",
  "70",
  "71",
  "77",
  "88",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "97",
  "99",
]);

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

const isValidUzPhone = (phone: string) => {
  return phone.length === 9 && PHONE_PREFIXES.has(phone.slice(0, 2));
};

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const sendOtpMutation = useSendPasswordResetOtp();

  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [formError, setFormError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    setPhone(digits);

    if (phoneError) {
      setPhoneError("");
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleSendOtp = () => {
    Keyboard.dismiss();

    setPhoneError("");
    setFormError("");

    if (!phone) {
      setPhoneError("Telefon raqamni kiriting");
      return;
    }

    if (!isValidUzPhone(phone)) {
      setPhoneError("Telefon raqam noto'g'ri formatda");
      return;
    }

    sendOtpMutation.mutate(phone, {
      onSuccess: () => {
        router.push({
          pathname: "/forgot-password/verify" as never,
          params: {
            phone,
          },
        });
      },

      onError: (error: any) => {
        const message = error?.response?.data?.message;

        setFormError(message || "SMS kodni yuborishda xatolik yuz berdi");
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Orqaga"
        >
          <ArrowLeftIcon color="#18181B" />
          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View>
            <Text style={styles.title}>Parolni tiklash</Text>

            <Text style={styles.subtitle}>Telefon raqamingizni kiriting</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Telefon raqam</Text>

              <View
                style={[
                  styles.input,
                  focused && styles.inputFocused,
                  phoneError && styles.inputError,
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

              {phoneError ? (
                <Text style={styles.fieldError}>{phoneError}</Text>
              ) : null}
            </View>

            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={sendOtpMutation.isPending}
              activeOpacity={0.8}
              style={[
                styles.button,
                sendOtpMutation.isPending && styles.buttonDisabled,
              ]}
            >
              {sendOtpMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>SMS kodni yuborish</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#FFF",
  },

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
    borderColor: PRIMARY,
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

  formError: {
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
    backgroundColor: PRIMARY,
  },

  buttonDisabled: {
    backgroundColor: "#D4D4D8",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
