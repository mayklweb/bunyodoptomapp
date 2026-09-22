import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useAddress,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/hooks/useAddress";
import { districts } from "@/utils/constants";
import CheckIcon from "@/components/icons/CheckIcon";
import EditIcon from "@/components/icons/EditIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import PlusIcon from "@/components/icons/PlusIcon";

export default function AddressScreen() {
  const {
    data: addresses,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
    refetch,
  } = useAddress();

  // Foydalanuvchida faqat BITTA manzil bo'lishi kerak
  const address = addresses?.[0] ?? null;

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  // string | number qilib qo'yildi — backend id'si UUID (string) bo'lsa ham
  // solishtirish ("===") ishlab ketishi uchun
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  // Qattiq "===" o'rniga stringga o'tkazib solishtiramiz — shu orqali
  // activeId(number) va address.id(string yoki number) mos kelmasligi bilan
  // bog'liq bug oldini olamiz
  const isCurrent =
    activeId != null &&
    address?.id != null &&
    String(activeId) === String(address.id);

  const [form, setForm] = useState({
    region: "Xorazm",
    district: "",
    address: "",
  });

  const isEditing = mode === "edit";
  const isCreating = mode === "create";
  const isActive = isEditing || isCreating;

  const startCreate = () => {
    // Xavfsizlik uchun: agar allaqachon address mavjud bo'lsa, create rejimiga o'tilmaydi
    if (address) return;

    setMode("create");
    setActiveId(null);
    setForm({ region: "Xorazm", district: "", address: "" });
  };

  const startEdit = (a: any) => {
    setMode("edit");
    setActiveId(a.id);
    setForm({
      region: "Xorazm",
      district: a.district,
      address: a.address,
    });
  };

  const cancel = () => {
    setMode(null);
    setActiveId(null);
    setIsDistrictOpen(false);
  };

  const save = () => {
    const payload = {
      region: "Xorazm",
      district: form.district,
      address: form.address,
    };

    if (isCreating) {
      createAddress.mutate(payload as any, {
        onSuccess: cancel,
        onError: (err: any) => {
          Alert.alert(
            "Xatolik",
            "Manzilni saqlab bo'lmadi. Qayta urinib ko'ring.",
          );
        },
      });
    }

    // activeId != null (0 ham to'g'ri id bo'lishi mumkin, shuning uchun
    // faqat "&& activeId" emas, "!= null" tekshiruvi ishlatiladi)
    if (isEditing && activeId != null) {
      updateAddress.mutate(
        { id: activeId, data: payload },
        {
          onSuccess: cancel,
          onError: (err: any) => {
            Alert.alert(
              "Xatolik",
              "Manzilni yangilab bo'lmadi. Qayta urinib ko'ring.",
            );
          },
        },
      );
    }
  };

  const remove = (id: number) => {
    Alert.alert("O'chirish", "Rostdan ham o'chirasizmi?", [
      { text: "Yo'q", style: "cancel" },
      {
        text: "Ha",
        style: "destructive",
        onPress: () =>
          deleteAddress.mutate(id, {
            onSuccess: () => {
              if (String(activeId) === String(id)) {
                cancel();
              }
            },
            onError: (err: any) => {
              Alert.alert(
                "Xatolik",
                "Manzilni o'chirib bo'lmadi. Qayta urinib ko'ring.",
              );
            },
          }),
      },
    ]);
  };

  // --- LOADING holati ---
  if (isAddressesLoading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color="#0040B1" />
      </View>
    );
  }

  // --- ERROR holati ---
  if (isAddressesError) {
    return (
      <View style={styles.centerWrap}>
        <View style={errorStyles.container}>
          <View style={errorStyles.iconWrap}>
            <Text style={errorStyles.iconText}>⚠️</Text>
          </View>
          <Text style={errorStyles.title}>Manzillarni yuklab bo'lmadi</Text>
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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: 16, padding: 20 }}>
        {address ? (
          // --- Mavjud (yagona) manzil kartasi ---
          <View key={address.id} style={styles.card}>
            <Text style={styles.label}>Viloyat</Text>

            <TextInput
              style={styles.inputDisabled}
              value="Xorazm"
              editable={false}
            />

            <Text style={styles.label}>Tuman</Text>

            {isEditing && isCurrent ? (
              <View style={styles.selectWrapper}>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => setIsDistrictOpen((p) => !p)}
                >
                  <Text>{form.district || "Tumanni tanlang"}</Text>
                </TouchableOpacity>

                {isDistrictOpen && (
                  <View style={styles.dropdown}>
                    <ScrollView>
                      {districts.map((d) => (
                        <TouchableOpacity
                          key={d}
                          style={styles.option}
                          onPress={() => {
                            setForm((p) => ({
                              ...p,
                              district: d,
                            }));
                            setIsDistrictOpen(false);
                          }}
                        >
                          <Text>{d}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ) : (
              <TextInput
                style={styles.inputDisabled}
                value={address.district}
                editable={false}
              />
            )}

            <Text style={styles.label}>Manzil</Text>

            {isEditing && isCurrent ? (
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) =>
                  setForm((p) => ({
                    ...p,
                    address: text,
                  }))
                }
              />
            ) : (
              <TextInput
                style={styles.inputDisabled}
                value={address.address}
                editable={false}
              />
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  isEditing && isCurrent && styles.saveButton,
                ]}
                onPress={() =>
                  isEditing && isCurrent ? save() : startEdit(address)
                }
              >
                {isEditing && isCurrent ? (
                  <>
                    <CheckIcon size={18} color="#fff" stroke={2} />
                    <Text style={styles.saveText}>Saqlash</Text>
                  </>
                ) : (
                  <>
                    <EditIcon size={18} color="#2563EB" stroke={2} />
                    <Text style={styles.editText}>Tahrirlash</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => remove(address.id)}
              >
                <DeleteIcon size={18} color="#DC2626" stroke={2} />
                <Text style={styles.deleteText}>O'chirish</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isCreating ? (
          // --- Yaratish formasi (address yo'q va create rejimida) ---
          <View style={styles.card}>
            <Text style={styles.label}>Viloyat</Text>
            <TextInput
              style={styles.inputDisabled}
              value="Xorazm"
              editable={false}
            />

            <Text style={styles.label}>Tuman</Text>
            <View style={styles.selectWrapper}>
              <TouchableOpacity
                style={styles.select}
                onPress={() => setIsDistrictOpen((p) => !p)}
              >
                <Text>{form.district || "Tumanni tanlang"}</Text>
              </TouchableOpacity>
              {isDistrictOpen && (
                <View style={styles.dropdown}>
                  <ScrollView>
                    {districts.map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.option}
                        onPress={() => {
                          setForm((p) => ({ ...p, district: d }));
                          setIsDistrictOpen(false);
                        }}
                      >
                        <Text>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={styles.label}>Manzil</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              placeholderTextColor="#9CA3AF"
              onChangeText={(t) => setForm((p) => ({ ...p, address: t }))}
              placeholder="Manzilni kiriting"
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.editButton, styles.saveButton]}
                onPress={save}
              >
                <CheckIcon size={18} color="#fff" />
                <Text style={styles.saveText}>Saqlash</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={cancel}>
                <Text style={styles.deleteText}>Bekor qilish</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // --- Manzil yo'q va create rejimida emas: "Qo'shish" tugmasi ---
          // Foydalanuvchida faqat bitta manzil bo'lishi kerakligi sababli,
          // bu tugma FAQAT address mavjud bo'lmaganda ko'rinadi.
          <TouchableOpacity style={styles.addCard} onPress={startCreate}>
            <PlusIcon size={24} color="#0040B1" />
            <Text style={styles.addText}>Yangi manzil qo'shish</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
  },

  inputDisabled: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },

  selectWrapper: {
    position: "relative",
  },

  select: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
  },

  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    maxHeight: 180,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    zIndex: 1000,
  },

  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },

  saveButton: {
    backgroundColor: "#0040B1",
  },

  editText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    padding: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "600",
  },

  addCard: {
    padding: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#0040B1",
    borderRadius: 16,
    alignItems: "center",
  },

  addText: {
    color: "#0040B1",
    fontWeight: "600",
    marginTop: 6,
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