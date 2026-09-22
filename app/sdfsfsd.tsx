import { useSignupForm } from "@/hooks/useSignupForm";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaskInput from "react-native-mask-input";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";

export default function SignupScreen() {
  const router = useRouter();

  const {
    fullName,
    phone,
    password,
    focusedField,
    nameError,
    phoneError,
    passwordError,
    formError,
    isPending,
    setFullName,
    setPhone,
    setPassword,
    setFocusedField,
    handleSignup,
  } = useSignupForm();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableOpacity
        onPress={handleBack}
        style={signupStyle.backButton}
        activeOpacity={0.8}
      >
        <ArrowLeftIcon color="#000" />
        <Text style={signupStyle.backText}>Orqaga</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={signupStyle.content}>
          <View style={signupStyle.header}>
            <Text style={signupStyle.title}>Ro'yxatdan o'tish</Text>
            <Text style={signupStyle.subtitle}>Hisobingizni yaratish</Text>
          </View>

          <View style={signupStyle.form}>
            <View style={signupStyle.field}>
              <Text style={signupStyle.label}>Ism familiya</Text>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Aziz Karimov"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                style={[
                  signupStyle.input,
                  focusedField === "fullName" && signupStyle.inputFocused,
                  nameError && signupStyle.inputError,
                ]}
              />
              {nameError ? (
                <Text style={signupStyle.fieldErrorText}>{nameError}</Text>
              ) : null}
            </View>

            <View style={signupStyle.field}>
              <Text style={signupStyle.label}>Telefon raqam</Text>

              <MaskInput
                value={phone}
                onChangeText={(masked) => setPhone(masked)}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
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
                placeholderTextColor="#9CA3AF"
                style={[
                  signupStyle.input,
                  focusedField === "phone" && signupStyle.inputFocused,
                  phoneError && signupStyle.inputError,
                ]}
              />
              {phoneError ? (
                <Text style={signupStyle.fieldErrorText}>{phoneError}</Text>
              ) : null}
            </View>

            <View style={signupStyle.field}>
              <Text style={signupStyle.label}>Parol</Text>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                style={[
                  signupStyle.input,
                  focusedField === "password" && signupStyle.inputFocused,
                  passwordError && signupStyle.inputError,
                ]}
              />
              {passwordError ? (
                <Text style={signupStyle.fieldErrorText}>{passwordError}</Text>
              ) : null}
            </View>

            {formError ? (
              <Text style={signupStyle.errorText}>{formError}</Text>
            ) : null}

            <TouchableOpacity
              style={[signupStyle.loginButton, isPending && { opacity: 0.6 }]}
              activeOpacity={0.9}
              onPress={handleSignup}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={signupStyle.loginButtonText}>
                  Ro'yxatdan o'tish
                </Text>
              )}
            </TouchableOpacity>

            <View style={signupStyle.footer}>
              <Text style={signupStyle.footerText}>Hisobingiz bormi?</Text>

              <Link href="/login" style={signupStyle.registerText}>
                <Text style={signupStyle.registerText}> Kirish</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const PRIMARY = "#0040B1";

const signupStyle = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    gap: 4,
    flexDirection: "row",
    zIndex: 1,
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18181B",
  },
  content: {
    flex: 1,
    maxWidth: 440,
    marginTop: 80,
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
  },
  inputFocused: {
    borderColor: "#0040B1",
    borderWidth: 1,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  fieldErrorText: {
    color: "#DC2626",
    fontSize: 12,
    marginLeft: 4,
    marginTop: 2,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginLeft: 4,
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
