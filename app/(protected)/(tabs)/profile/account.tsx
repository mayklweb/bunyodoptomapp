import Input from "@/components/Input";
import { useDeleteProfile } from "@/hooks/user/useDeleteProfile";
import { useProfile } from "@/hooks/user/useProfile";
import { useUpdateProfile } from "@/hooks/user/useUpdateProfile";
//
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PHONE_LOCAL_LENGTH = 9;
const COUNTRY_CODE = "998";

export default function AccountScreen() {

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    refetch,
  } = useProfile();

  const [name, setName] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const original = useRef({ name: "", rawPhone: "" });

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteProfile();

  useEffect(() => {
    if (user) {
      const phone = (user.phone ?? "")
        .replace(/\D/g, "")
        .replace(/^998/, "")
        .slice(0, PHONE_LOCAL_LENGTH);

      const uname = user.name ?? "";

      setName(uname);
      setRawPhone(phone);

      original.current = {
        name: uname,
        rawPhone: phone,
      };
    }
  }, [user]);

  const trimmedName = name.trim();
  const isPhoneValid = rawPhone.length === PHONE_LOCAL_LENGTH;
  const isPhoneTouchedButIncomplete =
    rawPhone.length > 0 && rawPhone.length < PHONE_LOCAL_LENGTH;

  const hasChanges =
    trimmedName !== original.current.name ||
    rawPhone !== original.current.rawPhone;

  // Only allow save when there ARE changes, nothing is in flight,
  // the name isn't blank, and the phone is either untouched-original or fully valid.
  const canSave =
    hasChanges && !isPending && trimmedName.length > 0 && isPhoneValid;

  function handlePhoneChange(text: string) {
    const digits = text.replace(/\D/g, "");
    const local = digits.startsWith(COUNTRY_CODE) ? digits.slice(3) : digits;
    setRawPhone(local.slice(0, PHONE_LOCAL_LENGTH));
    if (saveError) setSaveError(null);
  }

  function displayPhone(local: string): string {
    if (!local) return "";
    if (local.length <= 2) return `+998 ${local}`;
    if (local.length <= 5) return `+998 ${local.slice(0, 2)} ${local.slice(2)}`;
    if (local.length <= 7)
      return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
    return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }

  function handleSave() {
    if (!canSave) return;

    setSaveError(null);

    const payload = {
      name: trimmedName,
      // FIX: re-attach the country code — the API expects the full
      // international number, but rawPhone only stores the local 9 digits.
      phone: `${COUNTRY_CODE}${rawPhone}`,
    };

    updateProfile(payload, {
      onSuccess: () => {
        original.current = { name: trimmedName, rawPhone };
      },
      onError: (error: any) => {
        setSaveError("Saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      },
    });
  }

  function openDeleteModal() {
    setDeleteStep(1);
    setPassword("");
    setDeleteError(null);
    setDeleteModalVisible(true);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setDeleteModalVisible(false);
    setDeleteStep(1);
    setPassword("");
    setDeleteError(null);
  }

  function handleDeleteNext() {
    setDeleteStep(2);
  }

  function handleConfirmDelete() {
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setDeleteError("Parolni kiriting");
      return;
    }

    setDeleteError(null);

    deleteAccount(
      { password: trimmedPassword },
      {
        onSuccess: () => {
          setDeleteModalVisible(false);
          setDeleteStep(1);
          setPassword("");
        },
        onError: (error: any) => {
          const status = error?.response?.status;
          const serverMsg = error?.response?.data?.message;

          const msg =
            serverMsg === "Password mismatch"
              ? "Parol noto'g'ri"
              : status
                ? "Xatolik yuz berdi. Qaytadan urinib ko'ring."
                : "Internet aloqasi yo'q. Qaytadan urinib ko'ring.";
          setDeleteError(msg);
        },
      },
    );
  }

  // --- LOADING holati (foydalanuvchi ma'lumoti yuklanmoqda) ---
  if (isUserLoading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color="#0040B1" />
      </View>
    );
  }

  // --- ERROR holati ---
  if (isUserError) {
    return (
      <View style={styles.centerWrap}>
        <View style={errorStyles.container}>
          <View style={errorStyles.iconWrap}>
            <Text style={errorStyles.iconText}>⚠️</Text>
          </View>
          <Text style={errorStyles.title}>Ma'lumotlarni yuklab bo'lmadi</Text>
          <Text style={errorStyles.subtitle}>
            Internet aloqasini tekshirib, qayta urinib ko'ring
          </Text>
          <TouchableOpacity
            style={errorStyles.retryBtn}
            activeOpacity={0.8}
            onPress={() => refetch?.()}
          >
            <Text style={errorStyles.retryText}>Qayta urinish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, gap: 16, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Ism"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (saveError) setSaveError(null);
          }}
          placeholder="Ismingizni kiriting"
          autoCapitalize="words"
          editable={!isPending}
        />

        <Input
          label="Telefon"
          value={displayPhone(rawPhone)}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          placeholder="+998 90 123 45 67"
          editable={!isPending}
        />
        {isPhoneTouchedButIncomplete && (
          <Text style={styles.fieldError}>
            Telefon raqamini to'liq kiriting
          </Text>
        )}

        {saveError && <Text style={styles.fieldError}>{saveError}</Text>}

        <TouchableOpacity
          style={[styles.primaryBtn, !canSave && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!canSave}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Saqlash</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={openDeleteModal}>
          <Text style={styles.deleteBtnText}>Akkauntni o'chirish</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🗑️ O'chirishni tasdiqlash modali */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeDeleteModal}
          />

          <View style={styles.card}>
            {deleteStep === 1 ? (
              <>
                <Text style={styles.title}>Akkauntni o'chirish</Text>
                <Text style={styles.message}>
                  Rostdan ham akkauntingizni o'chirmoqchimisiz? Bu amalni ortga
                  qaytarib bo'lmaydi.
                </Text>

                <View style={styles.row}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={closeDeleteModal}
                  >
                    <Text style={styles.cancelText}>Bekor qilish</Text>
                  </Pressable>
                  <Pressable
                    style={styles.dangerBtn}
                    onPress={handleDeleteNext}
                  >
                    <Text style={styles.dangerText}>O'chirish</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Parolni tasdiqlang</Text>
                <Text style={styles.message}>
                  Xavfsizlik uchun akkauntni o'chirishdan oldin parolingizni
                  kiriting.
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    deleteError && styles.inputError,
                  ]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (deleteError) setDeleteError(null);
                  }}
                  placeholder="Parol"
                  secureTextEntry
                  autoFocus
                  editable={!isDeleting}
                />

                {deleteError ? (
                  <Text style={styles.errorText}>{deleteError}</Text>
                ) : null}

                <View style={styles.row}>
                  <Pressable
                    style={[styles.cancelBtn, isDeleting && { opacity: 0.6 }]}
                    onPress={closeDeleteModal}
                    disabled={isDeleting}
                  >
                    <Text style={styles.cancelText}>Bekor qilish</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.dangerBtn, isDeleting && { opacity: 0.6 }]}
                    onPress={handleConfirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.dangerText}>Ha, o'chirish</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  deleteBtn: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fee2e2",
  },
  deleteBtnText: {
    color: "#ef4444",

    fontWeight: "600",
    fontSize: 15,
  },
  fieldError: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: -8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  message: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
    borderWidth: 1,
    borderColor: "transparent",
  },
  passwordInput: {
    marginBottom: 4,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  cancelText: {
    color: "#111827",
    fontWeight: "500",
  },
  dangerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#DC2626",
  },
  dangerText: {
    color: "#fff",
    fontWeight: "600",
  },
});

const errorStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: "#0040B1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
