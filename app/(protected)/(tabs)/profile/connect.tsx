import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// TODO: agar backendga yuborish uchun mutation hook mavjud bo'lsa, shu yerga import qiling
// import { useCreateConnectRequest } from "@/hooks/useConnect";

export default function ConnectScreen() {
  // const createConnectRequest = useCreateConnectRequest();

  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; problem?: string }>(
    {},
  );

  const formatPhone = (text: string) => {
    // faqat raqamlarni qoldiramiz
    const digits = text.replace(/\D/g, "").slice(0, 9);
    let formatted = digits;
    if (digits.length > 2) formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length > 5)
      formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    if (digits.length > 7)
      formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
        5,
        7,
      )} ${digits.slice(7)}`;
    return formatted;
  };

  const validate = () => {
    const newErrors: { phone?: string; problem?: string } = {};
    const digitsOnly = phone.replace(/\D/g, "");

    if (!digitsOnly || digitsOnly.length < 9) {
      newErrors.phone = "Telefon raqamini to'liq kiriting";
    }
    if (!problem.trim()) {
      newErrors.problem = "Muammoni yozing";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      phone: `+998${phone.replace(/\D/g, "")}`,
      problem: problem.trim(),
    };

    // Hozircha backend hook ulanmagan, shuning uchun simulyatsiya qilamiz.
    // Ulanganda quyidagini ishlating:
    // createConnectRequest.mutate(payload, {
    //   onSuccess: () => {
    //     setIsSubmitting(false);
    //     setPhone("");
    //     setProblem("");
    //     Alert.alert("Yuborildi", "Murojaatingiz qabul qilindi");
    //   },
    //   onError: () => {
    //     setIsSubmitting(false);
    //     Alert.alert("Xatolik", "Yuborishda muammo yuz berdi");
    //   },
    // });

    setTimeout(() => {
      setIsSubmitting(false);
      setPhone("");
      setProblem("");
      Alert.alert("Yuborildi", "Murojaatingiz qabul qilindi");
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Biz bilan bog'laning</Text>

          <Text style={styles.label}>Telefon raqami</Text>
          <View style={styles.phoneWrapper}>
            <Text style={styles.phonePrefix}>+998</Text>
            <TextInput
              style={[
                styles.phoneInput,
                errors.phone && styles.inputError,
              ]}
              value={phone}
              onChangeText={(t) => {
                setPhone(formatPhone(t));
                if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
              }}
              placeholder="90 123 45 67"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={12}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <Text style={styles.label}>Muammo</Text>
          <TextInput
            style={[
              styles.textarea,
              errors.problem && styles.inputError,
            ]}
            value={problem}
            onChangeText={(t) => {
              setProblem(t);
              if (errors.problem)
                setErrors((p) => ({ ...p, problem: undefined }));
            }}
            placeholder="Muammoingizni batafsil yozing"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          {errors.problem && (
            <Text style={styles.errorText}>{errors.problem}</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Yuborish</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 6,
  },

  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
  },

  phonePrefix: {
    fontSize: 15,
    color: "#111827",
    marginRight: 6,
  },

  phoneInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
  },

  inputError: {
    borderColor: "#DC2626",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
  },

  submitButton: {
    marginTop: 18,
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});