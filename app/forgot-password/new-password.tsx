import { useLocalSearchParams, useRouter } from "expo-router";

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

import { useResetPassword } from "@/hooks/usePasswordReset";
import { usePasswordResetStore } from "@/stores/password-reset.store";

const PRIMARY = "#0040B1";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const phone = usePasswordResetStore((state) => state.phone);

  const resetToken = usePasswordResetStore((state) => state.resetToken);

  const resetMutation = useResetPassword();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [focusedField, setFocusedField] = useState<
    "password" | "confirmPassword" | null
  >(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [confirmError, setConfirmError] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleReset = () => {
    Keyboard.dismiss();

    setPasswordError(null);
    setConfirmError(null);
    setFormError(null);

    if (!phone || !resetToken) {
      setFormError("Parolni tiklash sessiyasi topilmadi");
      return;
    }

    if (!password) {
      setPasswordError("Yangi parolni kiriting");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (!confirmPassword) {
      setConfirmError("Parolni qayta kiriting");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Parollar mos kelmaydi");
      return;
    }

    resetMutation.mutate(
      {
        phone,
        resetToken,
        newPassword: password,
      },
      {
        onSuccess: () => {
          usePasswordResetStore.getState().clear();

          router.replace("/login");
        },

        onError: (error: any) => {
          setFormError(
            error?.response?.data?.message ||
              "Parolni yangilashda xatolik yuz berdi",
          );
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color="#18181B" />

          <Text style={styles.backText}>Orqaga</Text>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Yangi parol</Text>

              <Text style={styles.subtitle}>Yangi parolingizni kiriting</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Yangi parol</Text>

                <TextInput
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);

                    if (passwordError) {
                      setPasswordError(null);
                    }

                    if (formError) {
                      setFormError(null);
                    }
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  placeholderTextColor="#A1A1AA"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.input,
                    focusedField === "password" && styles.inputFocused,
                    passwordError && styles.inputError,
                  ]}
                />

                {passwordError && (
                  <Text style={styles.fieldError}>{passwordError}</Text>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Parolni tasdiqlang</Text>

                <TextInput
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);

                    if (confirmError) {
                      setConfirmError(null);
                    }

                    if (formError) {
                      setFormError(null);
                    }
                  }}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={handleReset}
                  placeholder="••••••••"
                  placeholderTextColor="#A1A1AA"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  style={[
                    styles.input,
                    focusedField === "confirmPassword" && styles.inputFocused,
                    confirmError && styles.inputError,
                  ]}
                />

                {confirmError && (
                  <Text style={styles.fieldError}>{confirmError}</Text>
                )}
              </View>

              {formError && <Text style={styles.formError}>{formError}</Text>}

              <TouchableOpacity
                onPress={handleReset}
                disabled={resetMutation.isPending}
                activeOpacity={0.85}
                style={[
                  styles.button,
                  resetMutation.isPending && styles.buttonDisabled,
                ]}
              >
                {resetMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Parolni yangilash</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingRight: 10,
  },

  backText: {
    color: "#18181B",
    fontSize: 16,
    fontWeight: "600",
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    marginTop: 120,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    color: "#18181B",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 5,
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
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    color: "#18181B",
    fontSize: 16,
  },

  inputFocused: {
    borderColor: PRIMARY,
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

  formError: {
    marginLeft: 4,
    color: "#DC2626",
    fontSize: 13,
    lineHeight: 18,
  },

  button: {
    height: 54,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: PRIMARY,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
