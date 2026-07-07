import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { useSignup } from "@/hooks/useSignup";
import { LeftArrowIcon } from "@/components/icons";
import Section from "@/components/layout/Section";
import MaskInput from "react-native-mask-input";

const getRawPhone = (value: string) =>
  value.replace(/\D/g, "").replace(/^998/, "");

const isValidUzPhone = (phone: string) => {
  const prefixes = ["70", "71", "77", "88", "90", "91", "95", "99"];

  const prefix = phone.slice(0, 2);

  return prefixes.includes(prefix) && phone.length === 9;
};

type SignUpFormValues = {
  name: string;
  phone: string;
  password: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignup();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: { name: "", phone: "", password: "" },
    mode: "onBlur",
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const onSubmit = (values: SignUpFormValues) => {
    const raw = getRawPhone(values.phone);

    signup(
      { name: values.name.trim(), phone: raw, password: values.password },
      {
        onError: (err) => {
          console.log("Xato:", err);
          Toast.show({
            type: "error",
            text1: "Ro'yxatdan o'tib bo'lmadi",
            text2: "Ma'lumotlarni tekshirib, qaytadan urinib ko'ring",
          });
        },
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
          });
        },
      },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <LeftArrowIcon />
        <Text style={styles.backText}>Orqaga</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Ro'yxatdan o'tish</Text>
            <Text style={styles.subtitle}>Yangi hisob yarating</Text>
          </View>

          <View style={styles.form}>
            {/* Ism */}
            <View style={styles.field}>
              <Text style={styles.label}>Ism</Text>

              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Ismni kiriting",
                  minLength: {
                    value: 2,
                    message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
                  },
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Ismingizni kiriting"
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, errors.name && styles.inputError]}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Telefon raqam */}
            <View style={styles.field}>
              <Text style={styles.label}>Telefon raqam</Text>

              <Controller
                control={control}
                name="phone"
                rules={{
                  required: "Telefon raqamni kiriting",
                  validate: (value) =>
                    isValidUzPhone(getRawPhone(value)) ||
                    "Telefon raqam noto'g'ri formatda",
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <MaskInput
                    value={value}
                    onChangeText={(masked) => onChange(masked)}
                    onBlur={onBlur}
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
                    style={[styles.input, errors.phone && styles.inputError]}
                  />
                )}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message}</Text>
              )}
            </View>

            {/* Parol */}
            <View style={styles.field}>
              <Text style={styles.label}>Parol</Text>

              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Parolni kiriting",
                  minLength: {
                    value: 6,
                    message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                  },
                }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="••••••••"
                    secureTextEntry
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, errors.password && styles.inputError]}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                isPending && styles.registerButtonDisabled,
              ]}
              activeOpacity={0.9}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              <Text style={styles.registerButtonText}>
                {isPending ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Hisobingiz bormi?</Text>

              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginText}> Kirish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const PRIMARY = "#0040B1";

const styles = StyleSheet.create({
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
  },

  inputError: {
    borderColor: "#DC2626",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginLeft: 4,
  },

  registerButton: {
    backgroundColor: PRIMARY,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
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

  loginText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
});
