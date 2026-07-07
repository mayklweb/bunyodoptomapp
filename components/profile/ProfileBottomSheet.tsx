import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import ProfileSheet from "./sheets/ProfileSheet";
import AddressesSheet from "./sheets/AddressesSheet";
import OrdersSheet from "./sheets/OrdersSheet";
import FavoritesSheet from "./sheets/FavoritesSheet";
import StoreSheet from "./sheets/StoreSheet";
import AboutSheet from "./sheets/AboutSheet";
import ContactSheet from "./sheets/ContactSheet";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SheetKey =
  | "profile"
  | "addresses"
  | "orders"
  | "favorites"
  | "store"
  | "about"
  | "contact"
  | null;

export default function ProfileBottomSheet({
  user,
  activeSheet,
  closeSheet,
}: {
  user: any; // Replace 'any' with the actual type for the user object
  activeSheet: SheetKey;
  closeSheet: () => void;
}) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        opacity={0.5}
      />
    ),
    [],
  );

  // 🔥 OPEN / CLOSE CONTROL
  useEffect(() => {
    if (activeSheet) {
      sheetRef.current?.present();
    }
  }, [activeSheet]);

  const renderContent = () => {
    switch (activeSheet) {
      case "profile":
        return <ProfileSheet user={user} />;
      case "addresses":
        return <AddressesSheet />;
      case "orders":
        return <OrdersSheet />;
      case "favorites":
        return <FavoritesSheet />;
      case "store":
        return <StoreSheet />;
      case "about":
        return <AboutSheet />;
      case "contact":
        return <ContactSheet />;
      default:
        return null;
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["80%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={(index) => {
        if (index === -1) closeSheet();
      }}
      onDismiss={closeSheet}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      handleIndicatorStyle={sheet.indicator}
    >
      {renderContent()}
    </BottomSheetModal>
  );
}

const sheet = StyleSheet.create({
  indicator: { backgroundColor: "#C4C4C4", width: 40 },
  content: {
    // flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    // paddingBottom: 32,
    gap: 16,
  },
  imageWrap: {
    width: "100%",
    height: "auto",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    aspectRatio: "4/3",
  },
  info: { gap: 4 },
  productName: { fontSize: 18, fontWeight: "700", color: "#111" },
  productCategory: { fontSize: 14, color: "#6B7280" },
  price: { fontSize: 20, fontWeight: "700", color: "#0040B1", marginTop: 4 },
  addBtn: {
    backgroundColor: "#0040B1",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
