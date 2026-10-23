import StoreIcon from "@/components/icons/StoreIcon";
import { useCreateMarket } from "@/hooks/markets/useCreateMarket";
import { useDeleteMarket } from "@/hooks/markets/useDeleteMarket";
import { useMarket } from "@/hooks/markets/useMarkets";
import { useUpdateMarket } from "@/hooks/markets/useUpdateMarket";
import { Picker } from "@react-native-picker/picker";
import { DISTRICTS, REGION } from "@/utils/constants";

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DownIcon from "@/components/icons/DownIcon";

// ─── District picker (inline) ────────────────────────────────────────────────

function DistrictSelect({
  districts,
  selected,
  onSelect,
  disabled,
  hasError,
}: {
  districts: string[];
  selected: string | null;
  onSelect: (d: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      {/* Select maydoni */}
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        disabled={disabled}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: hasError ? "#EF4444" : open ? "#0040B1" : "#E5E7EB",
          backgroundColor: open ? "#F5F8FF" : "#F9FAFB",
          opacity: disabled ? 0.5 : 1,
          gap: 10,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: selected ? "500" : "400",
            color: selected ? "#111827" : "#9CA3AF",
          }}
          numberOfLines={1}
        >
          {selected ?? "Tumanni tanlang"}
        </Text>

        <View
          style={{
            transform: [{ rotate: open ? "180deg" : "0deg" }],
          }}
        >
          <DownIcon size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>

      {/* Ochiladigan ro'yxat */}
      {open && (
        <View
          style={{
            borderRadius: 14,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            padding: 6,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <ScrollView
            style={{ maxHeight: 240 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {districts.map((d) => {
              const isSelected = selected === d;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => {
                    onSelect(d);
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 10,
                    backgroundColor: isSelected ? "#EEF2FF" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: isSelected ? "600" : "400",
                      color: isSelected ? "#0040B1" : "#111827",
                    }}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─── Inline form (create & edit) ─────────────────────────────────────────────

function StoreForm({
  title,
  districts,
  initialName = "",
  initialDistrict = null,
  initialAddress = "",
  onSave,
  onCancel,
  saving,
}: {
  title: string;
  districts: string[];
  initialName?: string;
  initialDistrict?: string | null;
  initialAddress?: string;
  onSave: (name: string, district: string, address: string) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    initialDistrict,
  );
  const [nameError, setNameError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [address, setAddress] = useState(initialAddress);
  const [addressError, setAddressError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim()) setNameError("");
  };

  const handleDistrictSelect = (d: string) => {
    setSelectedDistrict(d);
    setDistrictError("");
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.trim()) setAddressError("");
  };

  const handleSubmit = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Do'kon nomini kiriting");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!selectedDistrict) {
      setDistrictError("Tumanni tanlang");
      isValid = false;
    } else {
      setDistrictError("");
    }

    if (!address.trim()) {
      setAddressError("Manzilni kiriting (mahalla, ko'cha, uy)");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!isValid || !selectedDistrict) return;

    onSave(name.trim(), selectedDistrict, address.trim());
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
        {title}
      </Text>

      {/* Name */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Do'kon nomi
        </Text>

        <TextInput
          value={name}
          onChangeText={handleNameChange}
          placeholder="masalan, Texno Dunyo"
          placeholderTextColor="#9CA3AF"
          editable={!saving}
          style={{
            borderWidth: 1,
            borderColor: nameError ? "#EF4444" : "#E5E7EB",
            borderRadius: 10,
            paddingHorizontal: 14,
            height: 44,
            fontSize: 15,
            color: "#111827",
            backgroundColor: "#F9FAFB",
          }}
        />

        {nameError ? (
          <Text style={{ fontSize: 12, color: "#EF4444", marginLeft: 2 }}>
            {nameError}
          </Text>
        ) : null}
      </View>

      {/* Region (default, disabled) */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Viloyat
        </Text>

        <TextInput
          value={REGION[0]}
          editable={false}
          style={{
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 10,
            paddingHorizontal: 14,
            height: 44,
            fontSize: 15,
            color: "#6B7280",
            backgroundColor: "#F3F4F6",
          }}
        />
      </View>

      {/* District */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Tuman
        </Text>

        <DistrictSelect
          districts={districts}
          selected={selectedDistrict}
          onSelect={handleDistrictSelect}
          disabled={saving}
          hasError={!!districtError}
        />

        {districtError ? (
          <Text style={{ fontSize: 12, color: "#EF4444", marginLeft: 2 }}>
            {districtError}
          </Text>
        ) : null}
      </View>

      {/* Address */}
      <View style={{ gap: 6 }}>
        <Text
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Manzil
        </Text>

        <TextInput
          value={address}
          onChangeText={handleAddressChange}
          placeholder="Mahalla, ko'cha, uy raqami"
          placeholderTextColor="#9CA3AF"
          editable={!saving}
          multiline
          style={{
            borderWidth: 1,
            borderColor: addressError ? "#EF4444" : "#E5E7EB",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 12,
            minHeight: 44,
            maxHeight: 100,
            fontSize: 15,
            color: "#111827",
            backgroundColor: "#F9FAFB",
            textAlignVertical: "top",
          }}
        />

        {addressError ? (
          <Text style={{ fontSize: 12, color: "#EF4444", marginLeft: 2 }}>
            {addressError}
          </Text>
        ) : null}
      </View>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
        <TouchableOpacity
          onPress={onCancel}
          disabled={saving}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            justifyContent: "center",
            alignItems: "center",
            opacity: saving ? 0.5 : 1,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Bekor qilish
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={saving}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            backgroundColor: "#0040B1",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
              Saqlash
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Delete confirm (inline) ──────────────────────────────────────────────────

function DeleteConfirm({
  storeName,
  onConfirm,
  onCancel,
  deleting,
}: {
  storeName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 12,
        padding: 16,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#DC2626" }}>
        ⚠️ Do'konni o'chirish
      </Text>
      <Text style={{ fontSize: 14, color: "#B91C1C", lineHeight: 20 }}>
        <Text style={{ fontWeight: "600" }}>"{storeName}"</Text> do'koni va
        uning barcha ma'lumotlari butunlay o'chib ketadi.
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={onCancel}
          disabled={deleting}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FECACA",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            opacity: deleting ? 0.5 : 1,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
            Bekor qilish
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          disabled={deleting}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            backgroundColor: "#DC2626",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
              O'chirish
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type ViewMode = "view" | "create" | "edit" | "confirm-delete";

export default function StoreScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("view");

  const {
    data: stores,
    isLoading,
    isError,
    refetch: refetchStore,
  } = useMarket();

  const safeDistricts: string[] = DISTRICTS;

  const { mutate: createStore, isPending: creating } = useCreateMarket();
  const { mutate: updateStore, isPending: updating } = useUpdateMarket();
  const { mutate: deleteStore, isPending: deleting } = useDeleteMarket();

  const store = stores?.[0];

  const handleCreate = (name: string, district: string, address: string) => {
    createStore(
      {
        name,
        region: REGION,
        district,
        address,
      } as any,
      {
        onSuccess: () => setViewMode("view"),
        onError: (error: any) => {
          Alert.alert(
            "Xato",
            error?.response?.data?.message ||
              "Do'kon qo'shishda xatolik yuz berdi.",
          );
        },
      },
    );
  };

  const handleUpdate = (name: string, district: string, address: string) => {
    if (!store?.id) return;

    updateStore(
      {
        id: store.id,
        data: {
          name: name.trim(),
          region: REGION[0],
          district,
          address,
        },
      },
      {
        onSuccess: () => setViewMode("view"),
        onError: (error: any) => {
          Alert.alert(
            "Xato",
            error?.response?.data?.message ||
              "Do'konni yangilashda xatolik yuz berdi.",
          );
        },
      },
    );
  };

  const handleDelete = () => {
    if (!store) return;
    deleteStore(store.id, {
      onSuccess: () => setViewMode("view"),
      onError: () => {
        Alert.alert("Xato", "O'chirishda xatolik yuz berdi.");
      },
    });
  };

  const initialEditDistrict =
    safeDistricts.find((d) => d === store?.district) ?? null;

  // --- LOADING holati ---
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0040B1" />
      </View>
    );
  }

  // --- ERROR holati ---
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 28 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
          Ma'lumotlarni yuklab bo'lmadi
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          Internet aloqasini tekshirib, qayta urinib ko'ring
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 8,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: "#0040B1",
          }}
          onPress={() => refetchStore?.()}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
            Qayta urinish
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View style={{ gap: 12, paddingBottom: 24 }}>
          {/* ── Empty state ── */}
          {!store && viewMode !== "create" && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 16,
                gap: 16,
              }}
            >
              <View
                style={{ alignItems: "center", gap: 8, paddingVertical: 8 }}
              >
                <StoreIcon size={48} color="#0040B1" />
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}
                >
                  Do'kon mavjud emas
                </Text>
                <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Yangi do'kon qo'shing
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#0040B1",
                  borderRadius: 16,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
                onPress={() => setViewMode("create")}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                >
                  Do'kon qo'shish
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Store card ── */}
          {store && viewMode === "view" && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 16,
                gap: 12,
              }}
            >
              {/* Info row */}
              <View style={{ alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 100,
                    backgroundColor: "#EEF2FF",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <StoreIcon size={32} color="#0040B1" />
                </View>

                <View style={{ alignItems: "center", gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {store.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {store.district} · {store.address}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: "#F3F4F6" }} />

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setViewMode("edit")}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: "#EFF6FF",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#2563EB",
                    }}
                  >
                    Tahrirlash
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setViewMode("confirm-delete")}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: "#FEF2F2",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#DC2626",
                    }}
                  >
                    O'chirish
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Delete confirm (inline) ── */}
          {store && viewMode === "confirm-delete" && (
            <DeleteConfirm
              storeName={store.name}
              onConfirm={handleDelete}
              onCancel={() => setViewMode("view")}
              deleting={deleting}
            />
          )}

          {/* ── Create form ── */}
          {viewMode === "create" && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                padding: 16,
              }}
            >
              <StoreForm
                title="Do'kon qo'shish"
                districts={safeDistricts}
                onSave={handleCreate}
                onCancel={() => setViewMode("view")}
                saving={creating}
              />
            </View>
          )}

          {/* ── Edit form ── */}
          {store && viewMode === "edit" && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                padding: 16,
              }}
            >
              <StoreForm
                title="Do'konni tahrirlash"
                districts={safeDistricts}
                initialName={store.name}
                initialDistrict={initialEditDistrict}
                initialAddress={store.address ?? ""}
                onSave={handleUpdate}
                onCancel={() => setViewMode("view")}
                saving={updating}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
