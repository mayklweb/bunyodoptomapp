import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useLogin } from "@/hooks/useLogin";
import { LeftArrowIcon } from "@/components/icons";
import MaskInput from "react-native-mask-input";

const getRawPhone = (value: string) =>
  value.replace(/\D/g, "").replace(/^998/, "");

const isValidUzPhone = (phone: string) => {
  const prefixes = ["70", "71", "77", "88", "90", "91", "95", "99"];

  const prefix = phone.slice(0, 2);

  return prefixes.includes(prefix) && phone.length === 9;
};

export default function LoginScreen() {
  const router = useRouter();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleLogin = () => {
    const raw = getRawPhone(phone);

    if (!isValidUzPhone(raw)) {
      alert("Telefon raqam noto‘g‘ri formatda");
      return;
    }

    loginMutation.mutate({
      phone: raw,
      password,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableOpacity
        onPress={handleBack}
        style={loginStyle.backButton}
        activeOpacity={0.8}
      >
        <LeftArrowIcon />
        <Text style={loginStyle.backText}>Orqaga</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, paddingInline: 24 }}>
        <View style={loginStyle.content}>
          <View style={loginStyle.header}>
            <Text style={loginStyle.title}>Kirish</Text>
            <Text style={loginStyle.subtitle}>Hisobingizga kiring</Text>
          </View>

          <View style={loginStyle.form}>
            <View style={loginStyle.field}>
              <Text style={loginStyle.label}>Telefon raqam</Text>

              <MaskInput
                value={phone}
                onChangeText={(masked, unmasked) => {
                  setPhone(masked);
                  // setRawPhone(unmasked);
                }}
                keyboardType="phone-pad"
                mask={[
                  "+",
                  "9",
                  "9",
                  "8",
                  " ",
                  /\d/,
                  /\d/,
                  " ",
                  /\d/,
                  /\d/,
                  /\d/,
                  " ",
                  /\d/,
                  /\d/,
                  " ",
                  /\d/,
                  /\d/,
                ]}
                placeholder="+998 99 123 99 99"
                placeholderTextColor="#9CA3AF" // ← add this
                style={[
                  loginStyle.input,
                  focusedField === "phone" && loginStyle.inputFocused,
                ]}
              />
            </View>

            <View style={loginStyle.field}>
              <Text style={loginStyle.label}>Parol</Text>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF" // ← add this
                secureTextEntry
                onBlur={() => setFocusedField(null)}
                onFocus={() => setFocusedField("password")}
                style={[
                  loginStyle.input,
                  focusedField === "password" && loginStyle.inputFocused,
                ]}
              />
            </View>

            <TouchableOpacity
              style={loginStyle.loginButton}
              activeOpacity={0.9}
              onPress={handleLogin}
            >
              <Text style={loginStyle.loginButtonText}>Kirish</Text>
            </TouchableOpacity>

            <View style={loginStyle.footer}>
              <Text style={loginStyle.footerText}>Hisobingiz yo'qmi?</Text>

              <Link href="/(auth)/signup" style={loginStyle.registerText}>
                <Text style={loginStyle.registerText}> Ro'yxatdan o'tish</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const PRIMARY = "#0040B1";

const loginStyle = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    gap: 4,
    flexDirection: "row",
    cursor: "pointer",
    zIndex: 1,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18181B",
  },

  content: {
    flex: 1,
    maxWidth: 440,
    marginTop: 120,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#71717A",
  },

  form: {
    gap: 20,
  },

  field: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3F3F46",
    marginLeft: 4,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderColor: "#D4D4D8",
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    outlineColor: "#555",
    outlineWidth: 0,
    outlineStyle: "solid",
  },

  inputFocused: {
    borderColor: "#0040B1",
    borderWidth: 1,
  },

  loginButton: {
    backgroundColor: PRIMARY,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
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
