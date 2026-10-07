import LocationIcon from "@/components/icons/Location";
import StoreIcon from "@/components/icons/StoreIcon";
import { useAddress } from "@/hooks/addresses/useAddresses";
import { useCreateMarket } from "@/hooks/markets/useCreateMarket";
import { useDeleteMarket } from "@/hooks/markets/useDeleteMarket";
import { useMarket } from "@/hooks/markets/useMarkets";
import { useUpdateMarket } from "@/hooks/markets/useUpdateMarket";
// import { useCreateStore, useDeleteStore, useMarket, useUpdateMarket } from "@/hooks/useMarket";

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Address {
  id: number;
  region: string;
  district: string;
  address: string;
}

// ─── Address picker (inline, no modal) ───────────────────────────────────────

function AddressList({
  addresses,
  selected,
  onSelect,
}: {
  addresses: Address[];
  selected: Address | null;
  onSelect: (a: Address) => void;
}) {
  // FIX: bo'sh holat uchun tushunarli xabar (avval hech narsa ko'rsatilmasdi)
  if (addresses.length === 0) {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 13, color: "#6B7280", textAlign: "center" }}>
          Saqlangan manzil topilmadi.{"\n"}Avval manzil qo'shing.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 6 }}>
      {addresses.map((a: Address) => {
        const isSelected = selected?.id === a.id;
        return (
          <TouchableOpacity
            key={a.id}
            onPress={() => onSelect(a)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isSelected ? "#0040B1" : "#E5E7EB",
              backgroundColor: isSelected ? "#EEF2FF" : "#fff",
              gap: 10,
            }}
          >
            {/* Icon */}
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isSelected ? "#C7D7F8" : "#F3F4F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LocationIcon color={isSelected ? "#0040B1" : "#9CA3AF"} />
            </View>

            {/* Text */}
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontWeight: isSelected ? "600" : "400",
                  color: isSelected ? "#0040B1" : "#111827",
                }}
              >
                {a.address}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: isSelected ? "#3060C8" : "#9CA3AF",
                  marginTop: 2,
                }}
              >
                {a.region} · {a.district}
              </Text>
            </View>

            {/* Check */}
            {isSelected ? (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#0040B1",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}
                >
                  ✓
                </Text>
              </View>
            ) : (
              <View style={{ width: 20 }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Inline form (create & edit) ─────────────────────────────────────────────

function StoreForm({
  title,
  addresses,
  initialName = "",
  initialAddress = null,
  onSave,
  onCancel,
  saving,
}: {
  title: string;
  addresses: Address[];
  initialName?: string;
  initialAddress?: Address | null;
  onSave: (name: string, address: Address) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    initialAddress,
  );

  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);

    if (value.trim()) {
      setNameError("");
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setAddressError("");
  };

  const handleSubmit = () => {
    let isValid = true;

    // Do'kon nomi
    if (!name.trim()) {
      setNameError("Do'kon nomini kiriting");
      isValid = false;
    } else {
      setNameError("");
    }

    // Manzil
    if (!selectedAddress) {
      setAddressError("Do'kon manzilini tanlang");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!isValid) {
      return;
    }

    if (!selectedAddress) {
      return;
    }

    onSave(name.trim(), selectedAddress);
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#111827",
        }}
      >
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
          <Text
            style={{
              fontSize: 12,
              color: "#EF4444",
              marginLeft: 2,
            }}
          >
            {nameError}
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

        <AddressList
          addresses={addresses}
          selected={selectedAddress}
          onSelect={handleAddressSelect}
        />

        {addressError ? (
          <Text
            style={{
              fontSize: 12,
              color: "#EF4444",
              marginLeft: 2,
            }}
          >
            {addressError}
          </Text>
        ) : null}
      </View>

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: 4,
        }}
      >
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
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#374151",
            }}
          >
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
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#fff",
              }}
            >
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
          disabled={deleting} // FIX: o'chirish ketayotganda bekor qilishni bloklash
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
    isLoading: isStoreLoading,
    isError: isStoreError,
    refetch: refetchStore,
  } = useMarket();
  const {
    data: addresses,
    isLoading: isAddressesLoading,
    isError: isAddressesError,
    refetch: refetchAddresses,
  } = useAddress();
  const safeAddresses: Address[] = addresses ?? [];

  const { mutate: createStore, isPending: creating } = useCreateMarket();
  const { mutate: updateStore, isPending: updating } = useUpdateMarket();
  const { mutate: deleteStore, isPending: deleting } = useDeleteMarket();

  const store = stores?.[0];

  const handleCreate = (name: string, address: Address) => {
    createStore(
      {
        name,
        region: address.region,
        district: address.district,
        address: address.address,
        address_id: address.id, // FIX: update bilan bir xil shakl — backend buni kutayotgan bo'lishi mumkin
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

  const handleUpdate = (name: string, address: Address) => {
    if (!store?.id) return;

    updateStore(
      {
        id: store.id,
        data: {
          name: name.trim(),
          region: address.region,
          district: address.district,
          address: address.address,
        },
      },
      {
        onSuccess: () => {
          setViewMode("view");
        },
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
      onError: (error: any) => {
        Alert.alert("Xato", "O'chirishda xatolik yuz berdi.");
      },
    });
  };

  const initialEditAddress =
    safeAddresses.find((a: Address) => a.id === store?.address_id) ?? null;

  const isLoading = isStoreLoading || isAddressesLoading;
  const isError = isStoreError || isAddressesError;

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
            backgroundColor: "#0040B1", // FIX: bu yo'q edi — tugma butunlay ko'rinmas edi
          }}
          onPress={() => {
            refetchStore?.();
            refetchAddresses?.();
          }}
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
                    borderColor: "#E5E7EB",
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
                    borderColor: "#FECACA",
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
                addresses={safeAddresses}
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
                addresses={safeAddresses}
                initialName={store.name}
                initialAddress={initialEditAddress}
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
