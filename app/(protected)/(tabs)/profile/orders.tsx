import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCancelOrder, useOrders } from "@/hooks/useOrder";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import CloseIcon from "@/components/icons/CloseIcon";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ACTIVE_STATUSES = ["pending", "processing", "shipping", "preparing"];

const ORDER_TIMELINE: { key: string; label: string }[] = [
  { key: "pending", label: "Buyurtma qabul qilindi" },
  { key: "preparing", label: "Tayyorlanmoqda" },
  { key: "shipping", label: "Yo'lda" },
  { key: "delivered", label: "Yetkazildi" },
];

const getStatus = (status: string) => {
  switch (status) {
    case "pending":
      return { text: "Kutilmoqda", bg: "#FEF3C7", color: "#D97706" };
    case "preparing":
    case "processing":
      return { text: "Tayyorlanmoqda", bg: "#DBEAFE", color: "#2563EB" };
    case "shipping":
      return { text: "Yo'lda", bg: "#E0E7FF", color: "#4F46E5" };
    case "delivered":
      return { text: "Yetkazildi", bg: "#DCFCE7", color: "#16A34A" };
    case "cancelled":
      return { text: "Bekor qilindi", bg: "#FEE2E2", color: "#DC2626" };
    default:
      return { text: status, bg: "#F4F4F5", color: "#71717A" };
  }
};

const normalizeStatus = (s: string) => (s === "processing" ? "preparing" : s);

const timelineStepIndex = (status: string) =>
  ORDER_TIMELINE.findIndex((s) => s.key === normalizeStatus(status));

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
};

const isActive = (status: string) => ACTIVE_STATUSES.includes(status);

// ── Main ──────────────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const [tab, setTab] = useState<"active" | "all">("active");

  // FIX: store only the id, never a frozen copy of the order object.
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // FIX: refetch whenever this screen regains focus, so a status changed
  // by the delivery man / backend is picked up as soon as the user returns.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const activeCount = useMemo(
    () => orders?.filter((o: any) => isActive(o.status)).length ?? 0,
    [orders],
  );

  const filteredOrders = useMemo<any[]>(() => {
    if (!orders) return [];
    return tab === "active"
      ? orders.filter((o: any) => isActive(o.status))
      : orders;
  }, [orders, tab]);

  // FIX: derive the selected order live from the current `orders` array
  // instead of holding a stale snapshot captured at tap-time.
  const selectedOrder = useMemo(
    () => orders?.find((o: any) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  const handleConfirmCancel = () => {
    if (cancelTarget == null) return;
    setCancelError(null);

    cancelOrder(cancelTarget, {
      onSuccess: () => {
        setCancelTarget(null);
        setSelectedOrderId(null);
        refetch();
      },
      onError: (error: any) => {
        setCancelError(
          "Buyurtmani bekor qilib bo'lmadi. Qaytadan urinib ko'ring.",
        );
      },
    });
  };

  const handleCloseCancelModal = () => {
    if (isCancelling) return;
    setCancelTarget(null);
    setCancelError(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setTab("active")}
          style={[styles.tab, tab === "active" && styles.tabActive]}
        >
          <Text style={styles.tabText}>Aktiv ({activeCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab("all")}
          style={[styles.tab, tab === "all" && styles.tabActive]}
        >
          <Text style={styles.tabText}>Barchasi ({orders?.length ?? 0})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item: any) => String(item.id)}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }: { item: any }) => (
          <OrderCard
            order={item}
            onCancel={(id) => setCancelTarget(id)}
            isCancelling={isCancelling && cancelTarget === item.id}
          />
        )}
        ListHeaderComponent={
          <>
            {isLoading && !orders && (
              <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            )}

            {isError && (
              <View style={styles.centeredBox}>
                <View style={styles.iconWrapper}>
                  <CloseIcon size={40} color="#FCA5A5" />
                </View>
                <Text style={styles.errorTitle}>Xatolik yuz berdi</Text>
                <Text style={styles.errorDesc}>
                  Buyurtmalarni yuklab bo'lmadi. Qaytadan urinib ko'ring.
                </Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => refetch()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.retryBtnText}>Qayta yuklash</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isLoading && !isError && filteredOrders.length === 0 && (
              <View style={styles.centeredBox}>
                <Text style={styles.emptyText}>
                  {tab === "active"
                    ? "Aktiv buyurtmalar mavjud emas"
                    : "Buyurtmalar mavjud emas"}
                </Text>
              </View>
            )}
          </>
        }
      />

      {/* Detail sheet
      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedOrderId(null)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setSelectedOrderId(null)}
        />
        <View style={styles.sheet}>
          {selectedOrder && (
            <OrderDetail
              order={selectedOrder}
              onClose={() => setSelectedOrderId(null)}
              onCancel={(id) => setCancelTarget(id)}
              isCancelling={isCancelling && cancelTarget === selectedOrder.id}
            />
          )}
        </View>
      </Modal> */}

      {/* Cancel confirm */}
      <Modal
        visible={cancelTarget !== null}
        animationType="fade"
        transparent
        onRequestClose={handleCloseCancelModal}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <View style={styles.confirmIconWrap}>
              <Text style={{ fontSize: 28 }}>⚠️</Text>
            </View>
            <Text style={styles.confirmTitle}>Buyurtmani bekor qilish</Text>
            <Text style={styles.confirmDesc}>
              Buyurtma #{cancelTarget} ni haqiqatan bekor qilmoqchimisiz?{"\n"}
              Bu amalni ortga qaytarib bo'lmaydi.
            </Text>

            {cancelError ? (
              <Text style={styles.confirmErrorText}>{cancelError}</Text>
            ) : null}

            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmNo}
                onPress={handleCloseCancelModal}
                disabled={isCancelling}
              >
                <Text style={styles.confirmNoText}>Yo'q</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmYes, isCancelling && styles.disabled]}
                onPress={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmYesText}>Ha, bekor qilish</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onCancel,
  isCancelling,
}: {
  order: any;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}) {
  const status = getStatus(order.status);
  const canCancel = isActive(order.status);

  return (
    <View
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.orderId}>Buyurtma #{order.id}</Text>
          <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.text}
          </Text>
        </View>
      </View>

      {/* Products: image + name for each */}
      <View style={styles.productList}>
        {order.products?.map((item: any) => {
          const imageUrl = item.product?.images?.[0]?.url;
          return (
            <View key={item.id} style={styles.productListRow}>
              {imageUrl ? (
                <Image
                  source={{ uri: "https://api.bunyodoptom.uz" + imageUrl }}
                  style={styles.productThumb}
                />
              ) : (
                <View
                  style={[styles.productThumb, styles.productThumbPlaceholder]}
                />
              )}
              <Text style={styles.productThumbName} numberOfLines={2}>
                {item.product?.name}
              </Text>
              <Text style={styles.productThumbQty}>{item.qty} ta</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Jami summa</Text>
          <Text style={styles.totalAmount}>
            {Number(order.total_amount).toLocaleString()} so'm
          </Text>
        </View>
      </View>

      {/* Cancel button */}
      {canCancel && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onCancel(order.id);
          }}
          disabled={isCancelling}
          style={[styles.cancelButton, isCancelling && styles.disabled]}
        >
          <Text style={styles.cancelButtonText}>Bekor qilish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Order Detail ──────────────────────────────────────────────────────────────

function OrderDetail({
  order,
  onClose,
  onCancel,
  isCancelling,
}: {
  order: any;
  onClose: () => void;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}) {
  const status = getStatus(order.status);
  const isCancelled = order.status === "cancelled";
  const currentStep = timelineStepIndex(order.status);
  const canCancel = isActive(order.status);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.sheetHandle} />

      {/* Sheet header */}
      <View style={styles.sheetHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sheetOrderId}>Buyurtma #{order.id}</Text>
          <Text style={styles.sheetOrderDate}>
            {formatDate(order.created_at)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.bg, marginTop: 6 },
            ]}
          >
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <CloseIcon size={20} color="#71717A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Timeline */}
        {!isCancelled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Buyurtma holati</Text>
            {ORDER_TIMELINE.map((step, idx) => {
              const done = currentStep >= idx;
              const active = currentStep === idx;
              const isLast = idx === ORDER_TIMELINE.length - 1;
              return (
                <View key={step.key} style={styles.timelineRow}>
                  <View style={styles.timelineDotCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        done ? styles.dotDone : styles.dotPending,
                      ]}
                    >
                      {done && !active && (
                        <Text style={styles.timelineCheck}>✓</Text>
                      )}
                      {active && <View style={styles.dotInner} />}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          done && idx < currentStep && styles.lineDone,
                        ]}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.timelineLabel,
                      done && !active && styles.labelDone,
                      active && styles.labelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {isCancelled && (
          <View style={[styles.section, { backgroundColor: "#FEF2F2" }]}>
            <Text style={{ color: "#B91C1C", fontWeight: "600", fontSize: 14 }}>
              ❌ Bu buyurtma bekor qilingan
            </Text>
          </View>
        )}

        {/* Market */}
        {order.market && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Do'kon</Text>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}
            >
              <Text style={{ fontSize: 16 }}>🏪</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#18181B" }}
                >
                  {order.market.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#71717A", marginTop: 2 }}>
                  {[
                    order.market.address,
                    order.market.district,
                    order.market.region,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>To'lov</Text>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Usul</Text>
            <Text style={styles.payValue}>
              {order.payment_method === "cash"
                ? "💵 Naqd"
                : order.payment_method}
            </Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>To'langan</Text>
            <Text
              style={[
                styles.payValue,
                { color: order.payed > 0 ? "#16A34A" : "#DC2626" },
              ]}
            >
              {Number(order.payed).toLocaleString()} so'm
            </Text>
          </View>
        </View>

        {/* Products — full image + name + qty + price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mahsulotlar ({order.products?.length ?? 0} ta)
          </Text>
          {order.products?.map((item: any) => {
            const imageUrl = item.product?.images?.[0]?.url;
            return (
              <View key={item.id} style={styles.detailProductRow}>
                {imageUrl ? (
                  <Image
                    source={{ uri: "https://api.bunyodoptom.uz" + imageUrl }}
                    style={styles.detailProductImg}
                  />
                ) : (
                  <View
                    style={[
                      styles.detailProductImg,
                      styles.productThumbPlaceholder,
                    ]}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailProductName}>
                    {item.product?.name}
                  </Text>
                  <Text style={styles.detailProductQty}>{item.qty} ta</Text>
                </View>
                <Text style={styles.detailProductPrice}>
                  {Number(
                    item.subtotal ?? item.price * item.qty,
                  ).toLocaleString()}{" "}
                  so'm
                </Text>
              </View>
            );
          })}
        </View>

        {/* Total */}
        <View
          style={[
            styles.section,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 0,
            },
          ]}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#71717A" }}>
            Jami summa
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#18181B" }}>
            {Number(order.total_amount).toLocaleString()} so'm
          </Text>
        </View>
      </ScrollView>

      {/* Cancel button */}
      {canCancel && (
        <View style={styles.sheetFooter}>
          <TouchableOpacity
            onPress={() => onCancel(order.id)}
            disabled={isCancelling}
            style={[styles.sheetCancelBtn, isCancelling && styles.disabled]}
          >
            <Text style={styles.sheetCancelBtnText}>
              Buyurtmani bekor qilish
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },

  // Tabs
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 12 },
  tabActive: { backgroundColor: "#FFFFFF" },
  tabText: { textAlign: "center", fontWeight: "700", color: "#18181B" },

  // States
  centeredBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#18181B",
  },
  errorDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  retryBtn: {
    marginTop: 12,
    backgroundColor: "#0040B1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#71717A" },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  orderId: { fontSize: 16, fontWeight: "700", color: "#18181B" },
  orderDate: { marginTop: 3, fontSize: 12, color: "#A1A1AA" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusText: { fontSize: 12, fontWeight: "600" },

  // Product list on card
  productList: { gap: 10 },
  productListRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  productThumb: { width: 54, height: 44, borderRadius: 8 },
  productThumbPlaceholder: { backgroundColor: "#F4F4F5" },
  productThumbName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#18181B",
    lineHeight: 18,
  },
  productThumbQty: {
    fontSize: 12,
    color: "#71717A",
    minWidth: 30,
    textAlign: "right",
  },

  divider: { height: 1, backgroundColor: "#F4F4F5", marginVertical: 14 },
  cardFooter: { marginBottom: 14 },
  totalLabel: { fontSize: 12, color: "#71717A" },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18181B",
    marginTop: 2,
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cancelButtonText: { color: "#EF4444", fontWeight: "600", fontSize: 14 },

  // Bottom sheet (detail modal uchun)
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.9,
    paddingHorizontal: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E4E4E7",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    marginBottom: 4,
  },
  sheetOrderId: { fontSize: 18, fontWeight: "700", color: "#18181B" },
  sheetOrderDate: { marginTop: 3, fontSize: 12, color: "#A1A1AA" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A1A1AA",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  // Timeline
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 48,
  },
  timelineDotCol: { alignItems: "center", width: 28, marginRight: 12 },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  dotDone: { backgroundColor: "#0040B1" },
  dotPending: {
    backgroundColor: "#F4F4F5",
    borderWidth: 2,
    borderColor: "#E4E4E7",
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  timelineCheck: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: "#E4E4E7",
    marginVertical: 2,
  },
  lineDone: { backgroundColor: "#0040B1" },
  timelineLabel: { fontSize: 14, color: "#A1A1AA", paddingTop: 4, flex: 1 },
  labelDone: { color: "#71717A" },
  labelActive: { color: "#18181B", fontWeight: "700" },

  // Payment
  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  payLabel: { fontSize: 14, color: "#71717A" },
  payValue: { fontSize: 14, fontWeight: "600", color: "#18181B" },

  // Detail products
  detailProductRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  detailProductImg: { width: 56, height: 56, borderRadius: 10 },
  detailProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#18181B",
    lineHeight: 20,
  },
  detailProductQty: { marginTop: 4, fontSize: 12, color: "#71717A" },
  detailProductPrice: { fontSize: 14, fontWeight: "700", color: "#18181B" },

  // Sheet footer
  sheetFooter: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F5",
  },
  sheetCancelBtn: {
    borderWidth: 1.5,
    borderColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  sheetCancelBtnText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },

  // Confirm modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  confirmBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 8,
    textAlign: "center",
  },
  confirmDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmErrorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 16,
    textAlign: "center",
  },
  confirmActions: { flexDirection: "row", gap: 12, width: "100%" },
  confirmYes: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },

  confirmNo: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },

  confirmNoText: {
    color: "#111827",
    fontWeight: "500",
  },

  confirmYesText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.6,
  },
});
