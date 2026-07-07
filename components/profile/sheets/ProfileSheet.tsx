import { useDeleteAccount, useUpdateProfile } from "@/hooks/useProfile";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { sc } from "../SheetStyles";

export default function ProfileSheet({ user }: { user: any }) {
  const [name, setName] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const original = useRef({ name: "", rawPhone: "" });

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  useEffect(() => {
    if (user) {
      const phone = (user.phone ?? "")
        .replace(/\D/g, "")
        .replace(/^998/, "")
        .slice(0, 9);

      const uname = user.name ?? "";

      setName(uname);
      setRawPhone(phone);

      original.current = {
        name: uname,
        rawPhone: phone,
      };
    }
  }, [user]);

  const hasChanges =
    name.trim() !== original.current.name ||
    rawPhone !== original.current.rawPhone;

  function handlePhoneChange(text: string) {
    const digits = text.replace(/\D/g, "");
    const local = digits.startsWith("998") ? digits.slice(3) : digits;
    setRawPhone(local.slice(0, 9));
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
    if (!hasChanges || isPending) return;

    updateProfile(
      { name: name.trim(), phone: rawPhone },
      {
        onSuccess: () => {
          original.current = { name: name.trim(), rawPhone };
        },
      },
    );
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
    if (!password) {
      setDeleteError("Parolni kiriting");
      return;
    }

    setDeleteError(null);

    deleteAccount(
      { password },
      {
        onSuccess: () => {
          setDeleteModalVisible(false);
          setDeleteStep(1);
          setPassword("");
        },
        onError: (error: any) => {
          console.log("Delete account error:", error?.response?.data);
          const msg =
            error?.response?.data?.message === "Password mismatch"
              ? "Parol noto'g'ri"
              : "Xatolik yuz berdi. Qaytadan urinib ko'ring.";
          setDeleteError(msg);
        },
      },
    );
  }

  return (
    // <BottomSheetScrollView
    //   contentContainerStyle={{
    //     paddingHorizontal: 20,
    //     paddingTop: 8,
    //     paddingBottom: 32,
    //   }}
    // >
      <View style={{ flex: 1, gap: 16, paddingHorizontal: 20 }}>
        <View style={sc.field}>
          <Text style={sc.fieldLabel}>Ism</Text>
          <TextInput
            style={sc.input}
            value={name}
            onChangeText={setName}
            placeholder="Ismingizni kiriting"
            autoCapitalize="words"
          />
        </View>

        <View style={sc.field}>
          <Text style={sc.fieldLabel}>Telefon</Text>
          <TextInput
            style={sc.input}
            editable={false}
            value={displayPhone(rawPhone)}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            placeholder="+998 90 123 45 67"
          />
        </View>

        <TouchableOpacity
          style={[
            sc.primaryBtn,
            (!hasChanges || isPending) && { opacity: 0.5 },
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={sc.primaryBtnText}>Saqlash</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={openDeleteModal}>
          <Text style={styles.deleteBtnText}>Akkauntni o'chirish</Text>
        </TouchableOpacity>

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
                    Rostdan ham akkauntingizni o'chirmoqchimisiz? Bu amalni
                    ortga qaytarib bo'lmaydi.
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
                      sc.input,
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
                      style={styles.cancelBtn}
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
    // </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#e84749",
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
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
