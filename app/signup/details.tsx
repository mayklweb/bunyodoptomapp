import { useState } from "react";
import { colors, globalStyles } from "@/styles/globalStyles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LeftIcon from "@/components/icons/LeftIcon";

export default function DetailsScreen() {
  const params = useLocalSearchParams<{
    phone: string;
    verificationToken: string;
  }>();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  const verificationToken = Array.isArray(params.verificationToken)
    ? params.verificationToken[0]
    : params.verificationToken;

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordError =
    password && confirmPassword && password !== confirmPassword
      ? "Parollar mos kelmadi"
      : "";

  const isValid =
    name.trim().length >= 2 &&
    password.length >= 8 &&
    password === confirmPassword;

  const handleSignup = async () => {
    if (!isValid || loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.bunyodoptom.uz/api/v1/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            verificationToken,
            name: name.trim(),
            password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ro'yxatdan o'tishda xatolik");
      }

      router.replace("/(protected)" as never);
    } catch (e: any) {
      setError(e.message || "Xatolik yuz berdi, qayta urinib ko'ring");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
          backgroundColor: "#FFF"
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
            <Text style={styles.title}>Profilingizni yarating</Text>
            <Text style={styles.subtitle}>
              Deyarli tayyor, ism va parol qoldi
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Ism</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Muhammad"
                placeholderTextColor="#A1A1AA"
                autoCapitalize="words"
                returnKeyType="next"
                style={[
                  styles.input,
                  focusedField === "name" && styles.inputFocused,
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Parol</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                style={[
                  styles.input,
                  focusedField === "password" && styles.inputFocused,
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Parolni tasdiqlash</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                onSubmitEditing={handleSignup}
                placeholder="••••••••"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                style={[
                  styles.input,
                  focusedField === "confirmPassword" && styles.inputFocused,
                  Boolean(passwordError) && styles.inputError,
                ]}
              />

              {Boolean(passwordError) && (
                <Text style={styles.fieldError}>{passwordError}</Text>
              )}
            </View>
          </View>

          {Boolean(error) && <Text style={styles.formError}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Ro'yxatdan o'tish</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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

  form: { gap: 20 },
  field: { gap: 7 },

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

  formError: {
    marginTop: 16,
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
  },

  button: {
    marginTop: 32,
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { backgroundColor: "#D4D4D8" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

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