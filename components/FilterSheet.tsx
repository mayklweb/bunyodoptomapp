import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SortOption = "default" | "price_asc" | "price_desc" | "newest";

export type ProductFilters = {
  priceMin: string;
  priceMax: string;
  categoryId: string | null;
  sort: SortOption;
};

export type FilterSheetRef = {
  present: () => void;
  dismiss: () => void;
};

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "default", label: "Standart" },
  { key: "price_asc", label: "Arzon narx bo'yicha" },
  { key: "price_desc", label: "Qimmat narx bo'yicha" },
  { key: "newest", label: "Yangi qo'shilgan" },
];

type Props = {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  initialFilters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
};

const FilterSheet = forwardRef<FilterSheetRef, Props>(
  ({ brands, categories, initialFilters, onApply }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const { bottom } = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["75%"], []);

    const [priceMin, setPriceMin] = useState(initialFilters.priceMin);
    const [priceMax, setPriceMax] = useState(initialFilters.priceMax);
    const [categoryId, setCategoryId] = useState<string | null>(
      initialFilters.categoryId,
    );
    const [sort, setSort] = useState<SortOption>(initialFilters.sort);

    useImperativeHandle(ref, () => ({
      present: () => {
        // Sheet har safar ochilganda tashqi (parent) filtrlarga sinxronlanadi,
        // shunda oldingi ochilishda saqlanib qolgan eski qiymatlar chiqmaydi
        setPriceMin(initialFilters.priceMin);
        setPriceMax(initialFilters.priceMax);
        setCategoryId(initialFilters.categoryId);
        setSort(initialFilters.sort);
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    const handleReset = () => {
      setPriceMin("");
      setPriceMax("");
      setCategoryId(null);
      setSort("default");
    };

    const handleApply = () => {
      onApply({ priceMin, priceMax, categoryId, sort });
      sheetRef.current?.dismiss();
    };

    const hasActiveFilters =
      priceMin !== "" ||
      priceMax !== "" ||
      categoryId !== null ||
      sort !== "default";

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.header}>
          <Text style={styles.title}>Filter</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={handleReset} hitSlop={8}>
              <Text style={styles.clearLink}>Tozalash</Text>
            </TouchableOpacity>
          )}
        </BottomSheetView>

        <View style={styles.headerDivider} />

        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Narx oralig'i */}
          <Text style={styles.sectionTitle}>Narx oralig'i</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceInputWrap}>
              <BottomSheetTextInput
                style={styles.priceInput}
                placeholder="Dan"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={priceMin}
                onChangeText={(t) => setPriceMin(t.replace(/[^0-9]/g, ""))}
              />
              <Text style={styles.currencySuffix}>so'm</Text>
            </View>
            <View style={styles.priceDash} />
            <View style={styles.priceInputWrap}>
              <BottomSheetTextInput
                style={styles.priceInput}
                placeholder="Gacha"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={priceMax}
                onChangeText={(t) => setPriceMax(t.replace(/[^0-9]/g, ""))}
              />
              <Text style={styles.currencySuffix}>so'm</Text>
            </View>
          </View>

          {/* Kategoriya */}
          <Text style={styles.sectionTitle}>Kategoriya</Text>
          <View style={styles.chipsWrap}>
            <TouchableOpacity
              style={[styles.chip, categoryId === null && styles.chipActive]}
              onPress={() => setCategoryId(null)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  categoryId === null && styles.chipTextActive,
                ]}
              >
                Barchasi
              </Text>
            </TouchableOpacity>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, categoryId === c.id && styles.chipActive]}
                onPress={() => setCategoryId(c.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    categoryId === c.id && styles.chipTextActive,
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Saralash */}
          <Text style={styles.sectionTitle}>Saralash</Text>
          <View style={{ gap: 8 }}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.sortRow,
                  sort === opt.key && styles.sortRowActive,
                ]}
                onPress={() => setSort(opt.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sortText,
                    sort === opt.key && styles.sortTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                <View
                  style={[styles.radio, sort === opt.key && styles.radioActive]}
                >
                  {sort === opt.key && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetScrollView>

        {/* Fixed footer - safe area hisobga olingan */}
        <BottomSheetView
          style={[styles.footer, { paddingBottom: Math.max(bottom, 16) }]}
        >
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.resetBtnText}>Tozalash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyBtnText}>Qo'llash</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

FilterSheet.displayName = "FilterSheet";
export default FilterSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: "#D1D5DB",
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  clearLink: { fontSize: 14, fontWeight: "600", color: "#0040B1" },
  headerDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#404040",
    marginTop: 20,
    marginBottom: 10,
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  priceInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 4,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    padding: 0,
  },
  currencySuffix: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  priceDash: { width: 10, height: 1, backgroundColor: "#D1D5DB" },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: { backgroundColor: "#EEF2FF", borderColor: "#0040B1" },
  chipText: { fontSize: 13, fontWeight: "500", color: "#404040" },
  chipTextActive: { color: "#0040B1", fontWeight: "700" },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  sortRowActive: { backgroundColor: "#EEF2FF", borderColor: "#0040B1" },
  sortText: { fontSize: 14, color: "#404040" },
  sortTextActive: { color: "#0040B1", fontWeight: "600" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#0040B1" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0040B1",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  resetBtnText: { fontSize: 15, fontWeight: "700", color: "#404040" },
  applyBtn: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#0040B1",
  },
  applyBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
