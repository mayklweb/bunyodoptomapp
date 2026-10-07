import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import LeftIcon from "@/components/icons/LeftIcon";
import DismissKeyboard from "@/components/DismissKeyboard";
import { useLogin } from "@/hooks/auth/useLogin";

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

type FocusedField = "phone" | "password" | null;

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

const getRawPhone = (value: string) => {
  return value.replace(/\D/g, "").replace(/^998/, "");
};

const isValidUzPhone = (phone: string) => {
  return phone.length === 9 && PHONE_PREFIXES.has(phone.slice(0, 2));
};

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<FocusedField>(null);

  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const handleBack = () => {
    router.replace("/(protected)/(tabs)");
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    setPhone(digits);
    setPhoneError("");
    setFormError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError("");
    setFormError("");
  };

  const validateForm = () => {
    const rawPhone = getRawPhone(phone);

    let valid = true;

    if (!rawPhone) {
      setPhoneError("Telefon raqamni kiriting");
      valid = false;
    } else if (!isValidUzPhone(rawPhone)) {
      setPhoneError("Telefon raqam noto'g'ri formatda");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Parolni kiriting");
      valid = false;
    }

    return valid ? rawPhone : null;
  };

  const handleLogin = () => {
    if (loginMutation.isPending) return;

    Keyboard.dismiss();
    setFormError("");

    const rawPhone = validateForm();

    if (!rawPhone) return;

    loginMutation.mutate(
      {
        phone: rawPhone,
        password,
      },
      {
        onSuccess: async () => {
          /*
           * Login hook token/user ni storage'ga saqlaydi.
           * Query cache'ni yangilaymiz.
           */
          await queryClient.invalidateQueries({
            queryKey: ["user"],
          });

          /*
           * Profile'ga emas, protected tabs'ga o'tamiz.
           */
          router.replace("/(protected)/(tabs)");
        },

        onError: (error: any) => {
          setFormError(
            error?.response?.data?.message ||
              "Telefon raqam yoki parol noto'g'ri",
          );
        },
      },
    );
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        {/* Back */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
          <LeftIcon />

          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Header */}
          <View>
            <Text style={styles.title}>Kirish</Text>

            <Text style={styles.subtitle}>Hisobingizga kiring</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Phone */}
            <View style={styles.field}>
              <Text style={styles.label}>Telefon raqam</Text>

              <View
                style={[
                  styles.input,
                  focusedField === "phone" && styles.inputFocused,
                  phoneError && styles.inputError,
                ]}
              >
                <Text style={styles.prefix}>+998</Text>

                <TextInput
                  value={formatPhone(phone)}
                  onChangeText={handlePhoneChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
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

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Parol</Text>

              <View
                style={[
                  styles.input,
                  focusedField === "password" && styles.inputFocused,
                  passwordError && styles.inputError,
                ]}
              >
                <TextInput
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={handleLogin}
                  placeholder="••••••••"
                  placeholderTextColor="#A1A1AA"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  style={styles.passwordInput}
                />
              </View>

              {passwordError ? (
                <Text style={styles.fieldError}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Forgot password */}
            <View style={styles.forgotPasswordWrapper}>
              <TouchableOpacity
                onPress={() => router.push("/forgot-password/" as never)}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  Parolni unutdingizmi?
                </Text>
              </TouchableOpacity>
            </View>

            {/* API error */}
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}

            {/* Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loginMutation.isPending}
              activeOpacity={0.8}
              style={[
                styles.button,
                loginMutation.isPending && styles.buttonDisabled,
              ]}
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Kirish</Text>
              )}
            </TouchableOpacity>

            {/* Register */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Hisobingiz yo'qmi?</Text>

              <Link href="/signup/phone" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.registerText}>Ro'yxatdan o'tish</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </DismissKeyboard>
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

  passwordInput: {
    flex: 1,
    height: "100%",
    color: "#18181B",
    fontSize: 16,
    fontWeight: "500",
  },

  passwordToggle: {
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  fieldError: {
    marginLeft: 4,
    color: "#DC2626",
    fontSize: 12,
    lineHeight: 16,
  },

  forgotPasswordWrapper: {
    alignItems: "flex-end",
    marginTop: -4,
  },

  forgotPasswordText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "500",
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
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
});
