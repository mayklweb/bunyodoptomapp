import { LocationIcon, MarketIcon } from "@/components/icons";
import { useAddress } from "@/hooks/useAddress";
import {
  useCreateStore,
  useDeleteStore,
  useStore,
  useUpdateStore,
} from "@/hooks/useStore";
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
import { sc } from "../SheetStyles";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Address {
  id: number;
  region: string;
  district: string;
  address: string;
}

// Replace with your real useAddresses() hook

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

  const canSave = name.trim().length > 0 && selectedAddress !== null;

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 32,
      }}
    >
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
            onChangeText={setName}
            placeholder="masalan, Texno Dunyo"
            placeholderTextColor="#9CA3AF"
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 10,
              paddingHorizontal: 14,
              height: 44,
              fontSize: 15,
              color: "#111827",
              backgroundColor: "#F9FAFB",
            }}
          />
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
            onSelect={setSelectedAddress}
          />
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151" }}>
              Bekor qilish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => canSave && onSave(name.trim(), selectedAddress!)}
            disabled={!canSave || saving}
            style={{
              flex: 1,
              height: 44,
              borderRadius: 10,
              backgroundColor: canSave ? "#0040B1" : "#93C5FD",
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
    </BottomSheetScrollView>
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
          style={{
            flex: 1,
            height: 40,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FECACA",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
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

export default function StoreSheet() {
  const [viewMode, setViewMode] = useState<ViewMode>("view");

  const { data: stores } = useStore();
  const { data: addresses } = useAddress();
  const safeAddresses: Address[] = addresses ?? [];

  const { mutate: createStore, isPending: creating } = useCreateStore();
  const { mutate: updateStore, isPending: updating } = useUpdateStore();
  const { mutate: deleteStore, isPending: deleting } = useDeleteStore();

  const store = stores?.[0];

  const handleCreate = (name: string, address: Address) => {
    createStore(
      {
        name,
        region: address.region,
        district: address.district,
        address: address.address,
      } as any,
      {
        onSuccess: () => setViewMode("view"),
        onError: () =>
          Alert.alert("Xato", "Do'kon qo'shishda xatolik yuz berdi."),
      },
    );
  };

  const handleUpdate = (name: string, address: Address) => {
    if (!store) return;
    updateStore(
      {
        data: {
          id: store.id,
          name,
          region: address.region,
          district: address.district,
          address: address.address,
        },
      } as any,
      {
        onSuccess: () => setViewMode("view"),
        onError: () => Alert.alert("Xato", "Yangilashda xatolik yuz berdi."),
      },
    );
  };

  const handleDelete = () => {
    if (!store) return;
    deleteStore(store.id, {
      onSuccess: () => setViewMode("view"),
      onError: () => Alert.alert("Xato", "O'chirishda xatolik yuz berdi."),
    });
  };

  const initialEditAddress =
    safeAddresses.find((a: Address) => a.id === store?.address_id) ?? null;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ gap: 12, paddingBottom: 24 }}>
        {/* ── Empty state ── */}
        {!store && viewMode !== "create" && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              padding: 20,
              gap: 16,
            }}
          >
            <View style={{ alignItems: "center", gap: 8, paddingVertical: 8 }}>
              <MarketIcon size={48} color="#0040B1" />
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}
              >
                Do'kon mavjud emas
              </Text>
              <Text style={{ fontSize: 13, color: "#9CA3AF" }}>
                Yangi do'kon qo'shing
              </Text>
            </View>
            <TouchableOpacity
              style={sc.primaryBtn}
              onPress={() => setViewMode("create")}
            >
              <Text style={sc.primaryBtnText}>Do'kon qo'shish</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Store card ── */}
        {store && viewMode === "view" && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
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
                  borderRadius: 28,
                  backgroundColor: "#EEF2FF",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MarketIcon size={28} color="#0040B1" />
              </View>

              <View style={{ alignItems: "center", gap: 4 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}
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
                  style={{ fontSize: 14, fontWeight: "500", color: "#2563EB" }}
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
                  style={{ fontSize: 14, fontWeight: "500", color: "#DC2626" }}
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
  );
}
