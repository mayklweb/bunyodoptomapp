import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatPhone } from "@/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMarket } from "@/hooks/markets/useMarkets";
import { useCheckout } from "@/hooks/orders/useCheckout";
import { useProfile } from "@/hooks/user/useProfile";

const PRIMARY = "#0040B1";
const PRIMARY_LIGHT = "#EFF6FF";
const API_URL = "https://api.bunyodoptom.uz";

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ============================================
  // AUTH
  // ============================================

  const user = useAuthStore((state) => state.user);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);

  // ============================================
  // CART
  // ============================================

  const cart = useCartStore((state) => state.cart);
  const selectedIds = useCartStore((state) => state.selectedIds);
  const remove = useCartStore((state) => state.remove);

  // ============================================
  // CART DERIVED DATA
  // ============================================

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const products = useMemo(() => {
    return cart
      .filter((item) => selectedIdSet.has(item.id))
      .map((item) => ({
        ...item,
        qty: item.count ?? 1,
      }));
  }, [cart, selectedIdSet]);

  const totalAmount = useMemo(() => {
    return products.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.count || 1),
      0,
    );
  }, [products]);

  // ============================================
  // API DATA
  // ============================================

  const { data: store, isLoading: isStoreLoading } = useMarket();


  const { data: profile, isLoading: isProfileLoading } = useProfile();

  const { mutate: checkout, isPending } = useCheckout();

  // ============================================
  // LOCAL STATE
  // ============================================

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"cash">("cash");

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // ============================================
  // AUTH GUARD
  // ============================================

useEffect(() => {
  if (!isAuthHydrated) return;

  if (!user) {
    router.replace("/login");
  }
}, [isAuthHydrated, user, router]);

  // DEFAULT ADDRESS
  // ============================================
  // ============================================
  // DEFAULT MARKET
  // ============================================

  useEffect(() => {
    if (store?.length && selectedMarketId === null) {
      setSelectedMarketId(store[0].id);
    }
  }, [store, selectedMarketId]);

  // ============================================
  // PROFILE ID
  // ============================================

  const profileId = useMemo(() => {
    if (!profile) {
      return null;
    }

    const id = Number((profile as { id?: string | number }).id);

    return Number.isFinite(id) ? id : null;
  }, [profile]);

  // ============================================
  // SELECTED MARKET
  // ============================================

  const selectedMarket = useMemo(() => {
    return store?.find((market: any) => market.id === selectedMarketId);
  }, [store, selectedMarketId]);

  // ============================================
  // IMAGE URL
  // ============================================

  const getImageUrl = useCallback((item: any) => {
    const image = item?.images?.[0]?.url;

    if (!image) {
      return undefined;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image}`;
  }, []);

  // ============================================
  // LOADING
  // ============================================

  const isLoading =
    !isAuthHydrated || isStoreLoading || isProfileLoading;

  // ============================================
  // CAN CHECKOUT
  // ============================================

  const canCheckout =
    isAuthHydrated &&
    products.length > 0 &&
    !!selectedMarketId &&
    !!profileId &&
    !!selectedMarket &&
    !isPending;

  // ============================================
  // CHECKOUT
  // ============================================

  const onCheckout = useCallback(() => {
    if (!canCheckout) {
      return;
    }

    setCheckoutError(null);

    checkout(
      {
        user_id: profileId,
        total_amount: totalAmount,
        address_id: selectedAddressId,
        market: selectedMarket,
        market_id: selectedMarketId,
        payment_method: paymentMethod,
        payed: false,
        status: "preparing",
        products,
      } as any,
      {
        onSuccess: () => {
          products.forEach((product) => {
            remove(product.id);
          });

          router.replace("/profile/orders");
        },

        onError: (error: any) => {
          setCheckoutError(
            "Buyurtmani rasmiylashtirib bo'lmadi. Qaytadan urinib ko'ring.",
          );
        },
      },
    );
  }, [
    isAuthHydrated,
    user,
    canCheckout,
    router,
    checkout,
    profileId,
    totalAmount,
    selectedAddressId,
    selectedMarket,
    selectedMarketId,
    paymentMethod,
    products,
    remove,
  ]);

  // ============================================
  // AUTH / LOADING
  // ============================================

  if (!isAuthHydrated) {
    return (
      <View style={styles.loadingWrap}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={PRIMARY} />

          <Text style={styles.loadingTitle}>Tekshirilmoqda</Text>

          <Text style={styles.loadingSubtitle}>Bir oz kuting...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={PRIMARY} />

          <Text style={styles.loadingTitle}>Ma'lumotlar yuklanmoqda</Text>

          <Text style={styles.loadingSubtitle}>Bir oz kuting...</Text>
        </View>
      </View>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* User */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Foydalanuvchi</Text>

              <Text style={styles.cardSubtitle}>Buyurtma kim uchun</Text>
            </View>
          </View>

          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(profile?.name?.[0] || "F").toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {profile?.name || "Foydalanuvchi"}
              </Text>

              <Text style={styles.userPhone}>
                {formatPhone(profile?.phone)}
              </Text>
            </View>
          </View>
        </View>


        {/* Store */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.cardTitle}>Do'kon</Text>

              <Text style={styles.cardSubtitle}>
                Mahsulotlar qaysi do'kondan olinadi?
              </Text>
            </View>
          </View>

          {!store?.length ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Do'konlar topilmadi</Text>

              <Text style={styles.emptyDescription}>
                Hozircha mavjud do'konlar yo'q.
              </Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {store.map((market: any) => {
                const selected = selectedMarketId === market.id;

                return (
                  <TouchableOpacity
                    key={market.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedMarketId(market.id)}
                    style={[
                      styles.optionCard,
                      selected && styles.optionCardSelected,
                    ]}
                  >
                    <View
                      style={[styles.radio, selected && styles.radioSelected]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>

                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{market.name}</Text>

                      <Text style={styles.optionDescription}>
                        {market.region}, {market.district}
                      </Text>

                      {market.address ? (
                        <Text style={styles.optionDescription}>
                          {market.address}
                        </Text>
                      ) : null}
                    </View>

                    {selected && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>Tanlangan</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Products */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.cardTitle}>Mahsulotlar</Text>

              <Text style={styles.cardSubtitle}>
                Buyurtmangizdagi mahsulotlar
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{products.length} ta</Text>
            </View>
          </View>

          <View style={styles.productsContainer}>
            {products.map((item: any, index: number) => {
              const imageUrl = getImageUrl(item);

              const itemTotal =
                Number(item.price || 0) * Number(item.count || 1);

              return (
                <View
                  key={`${item.id}-${index}`}
                  style={[
                    styles.productItem,
                    index !== products.length - 1 && styles.productItemBorder,
                  ]}
                >
                  <View style={styles.productImageWrapper}>
                    {imageUrl ? (
                      <Image
                        source={{
                          uri: imageUrl,
                        }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>IMG</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.productInfo}>
                    <Text numberOfLines={2} style={styles.productName}>
                      {item.name}
                    </Text>

                    <Text style={styles.productQuantity}>
                      {item.count || 1} dona ×{" "}
                      {Number(item.price || 0).toLocaleString()} so'm
                    </Text>

                    <Text style={styles.productTotal}>
                      {itemTotal.toLocaleString()} so'm
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Payment */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.cardTitle}>To'lov usuli</Text>

              <Text style={styles.cardSubtitle}>Qanday to'lashni tanlang</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentMethod("cash")}
              style={[
                styles.paymentCard,
                paymentMethod === "cash" && styles.optionCardSelected,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  paymentMethod === "cash" && styles.radioSelected,
                ]}
              >
                {paymentMethod === "cash" && <View style={styles.radioDot} />}
              </View>

              <View style={styles.paymentContent}>
                <Text style={styles.paymentTitle}>Naqd pul</Text>

                <Text style={styles.paymentDescription}>
                  Yetkazib berishda naqd to'lash
                </Text>
              </View>

              <View style={styles.availableBadge}>
                <Text style={styles.availableBadgeText}>Mavjud</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.paymentCard, styles.paymentDisabled]}>
              <View style={[styles.radio, styles.radioDisabled]} />

              <View style={styles.paymentContent}>
                <Text style={[styles.paymentTitle, styles.textDisabled]}>
                  Click
                </Text>

                <Text style={[styles.paymentDescription, styles.textDisabled]}>
                  Online to'lov
                </Text>
              </View>

              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Tez kunda</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Error */}

        {checkoutError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Buyurtma yuborilmadi</Text>

            <Text style={styles.errorText}>{checkoutError}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setCheckoutError(null)}
            >
              <Text style={styles.errorDismiss}>Yopish</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Summary */}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Buyurtma xulosasi</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mahsulotlar</Text>

            <Text style={styles.summaryValue}>{products.length} ta</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Jami summa</Text>

            <Text style={styles.totalPrice}>
              {totalAmount.toLocaleString()} so'm
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Sticky bottom */}

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Jami</Text>

          <Text style={styles.bottomTotalPrice}>
            {totalAmount.toLocaleString()} so'm
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onCheckout}
          disabled={!canCheckout}
          style={[
            styles.checkoutButton,
            !canCheckout && styles.checkoutButtonDisabled,
          ]}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>Buyurtmani tasdiqlash</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  container: {
    marginTop: 12,
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F3",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    fontSize: 34,
    lineHeight: 36,
    color: "#18181B",
    fontWeight: "300",
    marginTop: -3,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#18181B",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#71717A",
  },

  /* Cards */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },

  cardHeader: {
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181B",
  },

  cardSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#8A8F98",
  },

  /* User */

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: PRIMARY,
    fontSize: 19,
    fontWeight: "700",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18181B",
  },

  userPhone: {
    marginTop: 4,
    fontSize: 13,
    color: "#71717A",
  },

  /* Options */

  optionsContainer: {
    gap: 10,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    backgroundColor: "#FFFFFF",
  },

  optionCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_LIGHT,
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#A1A1AA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    marginTop: 1,
  },

  radioSelected: {
    borderColor: PRIMARY,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  optionContent: {
    flex: 1,
    paddingRight: 4,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181B",
    lineHeight: 20,
  },

  optionDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#71717A",
  },

  selectedBadge: {
    marginLeft: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#DBEAFE",
  },

  selectedBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: PRIMARY,
  },

  /* Add address */

  addAddressButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: PRIMARY,
    backgroundColor: "#F8FBFF",
    alignItems: "center",
    justifyContent: "center",
  },

  addAddressText: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
  },

  /* Empty */

  emptyBox: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#52525B",
  },

  emptyDescription: {
    marginTop: 4,
    fontSize: 12,
    color: "#A1A1AA",
  },

  /* Products */

  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
  },

  countBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },

  productsContainer: {
    gap: 0,
  },

  productItem: {
    flexDirection: "row",
    paddingVertical: 8,
  },

  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F3",
    paddingBottom: 12,
    marginBottom: 4,
  },

  productImageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F4F4F5",
    marginRight: 12,
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },

  imagePlaceholderText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },

  productInfo: {
    flex: 1,
    justifyContent: "center",
  },

  productName: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    color: "#18181B",
  },

  productQuantity: {
    marginTop: 5,
    fontSize: 12,
    color: "#71717A",
  },

  productTotal: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
  },

  /* Payment */

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 68,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    backgroundColor: "#FFFFFF",
  },

  paymentDisabled: {
    opacity: 0.55,
    backgroundColor: "#F7F7F8",
  },

  paymentContent: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181B",
  },

  paymentDescription: {
    marginTop: 3,
    fontSize: 11,
    color: "#71717A",
  },

  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
  },

  availableBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#15803D",
  },

  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F4F4F5",
  },

  comingSoonText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#71717A",
  },

  radioDisabled: {
    borderColor: "#D4D4D8",
  },

  textDisabled: {
    color: "#A1A1AA",
  },

  /* Error */

  errorBox: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B91C1C",
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#DC2626",
  },

  errorDismiss: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#B91C1C",
  },

  /* Summary */

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECEEF1",
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#71717A",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181B",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#F0F1F3",
    marginVertical: 14,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#52525B",
  },

  totalPrice: {
    fontSize: 21,
    fontWeight: "800",
    color: "#18181B",
  },

  bottomSpace: {
    height: 12,
  },

  /* Bottom */

  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9EBEF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  bottomTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  bottomTotalLabel: {
    fontSize: 12,
    color: "#71717A",
  },

  bottomTotalPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#18181B",
  },

  checkoutButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  checkoutButtonDisabled: {
    opacity: 0.45,
  },

  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  /* Loading */

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingCard: {
    width: "100%",
    maxWidth: 320,
    padding: 28,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEEF1",
  },

  loadingTitle: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "700",
    color: "#18181B",
  },

  loadingSubtitle: {
    marginTop: 5,
    fontSize: 12,
    color: "#71717A",
  },
});
