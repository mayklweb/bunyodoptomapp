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

interface Address {
  id: string | number;
  region: string;
  district: string;
  address: string;
}

type FormErrors = {
  district: string;
  address: string;
};

export default function AddressScreen() {
  const {
    data: addresses,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
    refetch,
  } = useAddress();

  // Foydalanuvchida faqat BITTA manzil bo'lishi kerak
  const address: Address | null = addresses?.[0] ?? null;

  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [activeId, setActiveId] = useState<string | number | null>(null);

  const [mode, setMode] = useState<"create" | "edit" | null>(null);

  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  const [form, setForm] = useState({
    region: "Xorazm",
    district: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    district: "",
    address: "",
  });

  const isEditing = mode === "edit";
  const isCreating = mode === "create";

  const isCurrent =
    activeId != null &&
    address?.id != null &&
    String(activeId) === String(address.id);

  // ----------------------------------------
  // CREATE
  // ----------------------------------------

  const startCreate = () => {
    // Bitta address bo'lishi kerak
    if (address) return;

    setMode("create");
    setActiveId(null);
    setIsDistrictOpen(false);

    setForm({
      region: "Xorazm",
      district: "",
      address: "",
    });

    setErrors({
      district: "",
      address: "",
    });
  };

  // ----------------------------------------
  // EDIT
  // ----------------------------------------

  const startEdit = (a: Address) => {
    setMode("edit");
    setActiveId(a.id);
    setIsDistrictOpen(false);

    setForm({
      region: "Xorazm",
      district: a.district ?? "",
      address: a.address ?? "",
    });

    setErrors({
      district: "",
      address: "",
    });
  };

  // ----------------------------------------
  // CANCEL
  // ----------------------------------------

  const cancel = () => {
    setMode(null);
    setActiveId(null);
    setIsDistrictOpen(false);

    setForm({
      region: "Xorazm",
      district: "",
      address: "",
    });

    setErrors({
      district: "",
      address: "",
    });
  };

  // ----------------------------------------
  // VALIDATION
  // ----------------------------------------

  const validateForm = () => {
    const newErrors: FormErrors = {
      district: "",
      address: "",
    };

    if (!form.district.trim()) {
      newErrors.district = "Tumanni tanlang";
    }

    if (!form.address.trim()) {
      newErrors.address = "Manzilni kiriting";
    }

    setErrors(newErrors);

    return !newErrors.district && !newErrors.address;
  };

  // ----------------------------------------
  // SAVE
  // ----------------------------------------

  const save = () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      region: "Xorazm",
      district: form.district.trim(),
      address: form.address.trim(),
    };

    // CREATE
    if (isCreating) {
      createAddress.mutate(payload as any, {
        onSuccess: () => {
          cancel();
        },

        onError: () => {
          Alert.alert(
            "Xatolik",
            "Manzilni saqlab bo'lmadi. Qayta urinib ko'ring.",
          );
        },
      });

      return;
    }

    // UPDATE
    if (isEditing && activeId != null) {
      updateAddress.mutate(
        {
          id: Number(activeId),
          data: payload,
        },
        {
          onSuccess: () => {
            cancel();
          },

          onError: () => {
            Alert.alert(
              "Xatolik",
              "Manzilni yangilab bo'lmadi. Qayta urinib ko'ring.",
            );
          },
        },
      );
    }
  };

  // ----------------------------------------
  // DELETE
  // ----------------------------------------

  const remove = (id: string | number) => {
    Alert.alert("O'chirish", "Rostdan ham o'chirasizmi?", [
      {
        text: "Yo'q",
        style: "cancel",
      },
      {
        text: "Ha",
        style: "destructive",

        onPress: () => {
          deleteAddress.mutate(Number(id), {
            onSuccess: () => {
              if (String(activeId) === String(id)) {
                cancel();
              }
            },

            onError: () => {
              Alert.alert(
                "Xatolik",
                "Manzilni o'chirib bo'lmadi. Qayta urinib ko'ring.",
              );
            },
          });
        },
      },
    ]);
  };

  // ----------------------------------------
  // DISTRICT SELECT
  // ----------------------------------------

  const handleDistrictSelect = (district: string) => {
    setForm((prev) => ({
      ...prev,
      district,
    }));

    setErrors((prev) => ({
      ...prev,
      district: "",
    }));

    setIsDistrictOpen(false);
  };

  // ----------------------------------------
  // ADDRESS CHANGE
  // ----------------------------------------

  const handleAddressChange = (text: string) => {
    setForm((prev) => ({
      ...prev,
      address: text,
    }));

    if (errors.address && text.trim()) {
      setErrors((prev) => ({
        ...prev,
        address: "",
      }));
    }
  };

  // ----------------------------------------
  // LOADING
  // ----------------------------------------

  if (isAddressesLoading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color="#0040B1" />
      </View>
    );
  }

  // ----------------------------------------
  // ERROR
  // ----------------------------------------

  if (isAddressesError) {
    return (
      <View style={styles.centerWrap}>
        <View style={errorStyles.container}>
          <View style={errorStyles.iconWrap}>
            <Text style={errorStyles.iconText}>⚠️</Text>
          </View>

          <Text style={errorStyles.title}>
            Manzillarni yuklab bo'lmadi
          </Text>

          <Text style={errorStyles.subtitle}>
            Internet aloqasini tekshirib, qayta urinib ko'ring
          </Text>

          <TouchableOpacity
            style={errorStyles.retryBtn}
            activeOpacity={0.8}
            onPress={() => refetch?.()}
          >
            <Text style={errorStyles.retryText}>
              Qayta urinish
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ==========================================
            EXISTING ADDRESS
        ========================================== */}

        {address ? (
          <View style={styles.card} key={String(address.id)}>
            {/* REGION */}

            <Text style={styles.label}>Viloyat</Text>

            <TextInput
              style={styles.inputDisabled}
              value="Xorazm"
              editable={false}
            />

            {/* DISTRICT */}

            <Text style={styles.label}>Tuman</Text>

            {isEditing && isCurrent ? (
              <>
                <View style={styles.selectWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.select,
                      errors.district && styles.inputError,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setIsDistrictOpen((prev) => !prev);

                      if (errors.district) {
                        setErrors((prev) => ({
                          ...prev,
                          district: "",
                        }));
                      }
                    }}
                  >
                    <Text
                      style={
                        form.district
                          ? styles.selectText
                          : styles.placeholder
                      }
                    >
                      {form.district || "Tumanni tanlang"}
                    </Text>
                  </TouchableOpacity>

                  {isDistrictOpen && (
                    <View style={styles.dropdown}>
                      <ScrollView nestedScrollEnabled>
                        {districts.map((d) => (
                          <TouchableOpacity
                            key={d}
                            style={styles.option}
                            activeOpacity={0.7}
                            onPress={() => handleDistrictSelect(d)}
                          >
                            <Text style={styles.optionText}>{d}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {errors.district ? (
                  <Text style={styles.errorText}>
                    {errors.district}
                  </Text>
                ) : null}
              </>
            ) : (
              <TextInput
                style={styles.inputDisabled}
                value={address.district}
                editable={false}
              />
            )}

            {/* ADDRESS */}

            <Text style={styles.label}>Manzil</Text>

            {isEditing && isCurrent ? (
              <>
                <TextInput
                  style={[
                    styles.input,
                    errors.address && styles.inputError,
                  ]}
                  value={form.address}
                  placeholder="Manzilni kiriting"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleAddressChange}
                />

                {errors.address ? (
                  <Text style={styles.errorText}>
                    {errors.address}
                  </Text>
                ) : null}
              </>
            ) : (
              <TextInput
                style={styles.inputDisabled}
                value={address.address}
                editable={false}
              />
            )}

            {/* ACTIONS */}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  isEditing &&
                    isCurrent &&
                    styles.saveButton,
                ]}
                activeOpacity={0.8}
                disabled={
                  createAddress.isPending ||
                  updateAddress.isPending ||
                  deleteAddress.isPending
                }
                onPress={() =>
                  isEditing && isCurrent
                    ? save()
                    : startEdit(address)
                }
              >
                {isEditing && isCurrent ? (
                  <>
                    {updateAddress.isPending ? (
                      <ActivityIndicator
                        size="small"
                        color="#fff"
                      />
                    ) : (
                      <CheckIcon
                        size={18}
                        color="#fff"
                        stroke={2}
                      />
                    )}

                    <Text style={styles.saveText}>
                      {updateAddress.isPending
                        ? "Saqlanmoqda..."
                        : "Saqlash"}
                    </Text>
                  </>
                ) : (
                  <>
                    <EditIcon
                      size={18}
                      color="#2563EB"
                      stroke={2}
                    />

                    <Text style={styles.editText}>
                      Tahrirlash
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.8}
                disabled={
                  deleteAddress.isPending ||
                  updateAddress.isPending
                }
                onPress={() => remove(address.id)}
              >
                {deleteAddress.isPending ? (
                  <ActivityIndicator
                    size="small"
                    color="#DC2626"
                  />
                ) : (
                  <DeleteIcon
                    size={18}
                    color="#DC2626"
                    stroke={2}
                  />
                )}

                <Text style={styles.deleteText}>
                  {deleteAddress.isPending
                    ? "O'chirilmoqda..."
                    : "O'chirish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isCreating ? (
          /* ==========================================
             CREATE ADDRESS
          ========================================== */

          <View style={styles.card}>
            {/* REGION */}

            <Text style={styles.label}>Viloyat</Text>

            <TextInput
              style={styles.inputDisabled}
              value="Xorazm"
              editable={false}
            />

            {/* DISTRICT */}

            <Text style={styles.label}>Tuman</Text>

            <>
              <View style={styles.selectWrapper}>
                <TouchableOpacity
                  style={[
                    styles.select,
                    errors.district && styles.inputError,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsDistrictOpen((prev) => !prev);

                    if (errors.district) {
                      setErrors((prev) => ({
                        ...prev,
                        district: "",
                      }));
                    }
                  }}
                >
                  <Text
                    style={
                      form.district
                        ? styles.selectText
                        : styles.placeholder
                    }
                  >
                    {form.district || "Tumanni tanlang"}
                  </Text>
                </TouchableOpacity>

                {isDistrictOpen && (
                  <View style={styles.dropdown}>
                    <ScrollView nestedScrollEnabled>
                      {districts.map((d) => (
                        <TouchableOpacity
                          key={d}
                          style={styles.option}
                          activeOpacity={0.7}
                          onPress={() =>
                            handleDistrictSelect(d)
                          }
                        >
                          <Text style={styles.optionText}>
                            {d}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {errors.district ? (
                <Text style={styles.errorText}>
                  {errors.district}
                </Text>
              ) : null}
            </>

            {/* ADDRESS */}

            <Text style={styles.label}>Manzil</Text>

            <>
              <TextInput
                style={[
                  styles.input,
                  errors.address && styles.inputError,
                ]}
                value={form.address}
                placeholderTextColor="#9CA3AF"
                onChangeText={handleAddressChange}
                placeholder="Manzilni kiriting"
              />

              {errors.address ? (
                <Text style={styles.errorText}>
                  {errors.address}
                </Text>
              ) : null}
            </>

            {/* ACTIONS */}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  styles.saveButton,
                ]}
                activeOpacity={0.8}
                disabled={createAddress.isPending}
                onPress={save}
              >
                {createAddress.isPending ? (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                  />
                ) : (
                  <CheckIcon
                    size={18}
                    color="#fff"
                    stroke={2}
                  />
                )}

                <Text style={styles.saveText}>
                  {createAddress.isPending
                    ? "Saqlanmoqda..."
                    : "Saqlash"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.8}
                disabled={createAddress.isPending}
                onPress={cancel}
              >
                <Text style={styles.deleteText}>
                  Bekor qilish
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ==========================================
             NO ADDRESS
          ========================================== */

          <TouchableOpacity
            style={styles.addCard}
            activeOpacity={0.8}
            onPress={startCreate}
          >
            <PlusIcon size={24} color="#0040B1" />

            <Text style={styles.addText}>
              Yangi manzil qo'shish
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    gap: 16,
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  inputDisabled: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 5,
  },

  selectWrapper: {
    position: "relative",
  },

  select: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  selectText: {
    color: "#111827",
    fontSize: 14,
  },

  placeholder: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  dropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    maxHeight: 180,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    zIndex: 1000,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  optionText: {
    fontSize: 14,
    color: "#111827",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
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
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
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

// ==========================================
// ERROR SCREEN STYLES
// ==========================================

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

  iconText: {
    fontSize: 28,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

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

  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});