import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
} from "react-native";

import ProfileHeader from "@/components/headers/ProfileHeader";
import ProfileBottomSheet from "@/components/profile/ProfileBottomSheet";
import MenuItem from "@/components/profile/MenuItem";

import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useLogout";
import { Redirect } from "expo-router";

import {
  EditIcon,
  InfoIcon,
  SupportIcon,
  InstIcon,
  TeleIcon,
  YouTubeIcon,
  FileIcon,
  LocationIcon,
  OrderIcon,
  HeartIcon,
  MarketIcon,
  UserCircleIcon,
} from "@/components/icons";

import type { SheetKey } from "@/types/types";
import { useProfile } from "@/hooks/useProfile";
import { formatPhone } from "@/utils/helpres";

export default function ProfileScreen() {
  const { token, isHydrated } = useAuthStore();
  const { logout } = useLogout();
  const { data: user } = useProfile();

  const [activeSheet, setActiveSheet] = useState<SheetKey>(null);

  const socialLinks = [
    {
      href: "https://www.instagram.com/bunyodoptom",
      color: "#F00073",
      icon: <InstIcon size={20} color="#fff" />,
    },
    {
      href: "https://t.me/bunyodoptom",
      color: "#0088CC",
      icon: <TeleIcon size={20} color="#fff" />,
    },
    {
      href: "https://www.youtube.com/@bunyodoptom",
      color: "#FF0000",
      icon: <YouTubeIcon size={20} color="#fff" />,
    },
  ];

  if (!isHydrated) {
    return null;
  }
  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ProfileHeader />

      <ScrollView
        // style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* USER CARD */}
        <View style={styles.userCard}>
          <View style={styles.userLeft}>
            <View style={styles.avatarFallback}>
              <UserCircleIcon size={32} color="#6b7280" />
            </View>
            <View>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userPhone}>{formatPhone(user?.phone)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setActiveSheet("profile")}
            activeOpacity={0.7}
          >
            <EditIcon size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* MENU */}
        <View style={styles.menuCard}>
          <MenuItem
            icon={<FileIcon size={20} color="#404040" />}
            label="Shaxsiy ma'lumotlar"
            onPress={() => setActiveSheet("profile")}
          />

          <MenuItem
            icon={<LocationIcon size={20} color="#404040" />}
            label="Manzil"
            onPress={() => setActiveSheet("addresses")}
          />

          <MenuItem
            icon={<OrderIcon size={20} color="#404040" />}
            label="Buyurtmalar"
            onPress={() => setActiveSheet("orders")}
          />

          <MenuItem
            icon={<HeartIcon size={20} color="#404040" />}
            label="Sevimlilar"
            onPress={() => setActiveSheet("favorites")}
          />

          <MenuItem
            icon={<MarketIcon size={20} color="#404040" />}
            label="Do'kon"
            onPress={() => setActiveSheet("store")}
            last
          />
        </View>

        {/* INFO MENU */}
        <View style={styles.menuCard}>
          <MenuItem
            icon={<InfoIcon size={20} color="#404040" />}
            label="Biz haqimizda"
            onPress={() => setActiveSheet("about")}
          />
          <MenuItem
            icon={<SupportIcon size={20} color="#404040" />}
            label="Bog'lanish"
            onPress={() => setActiveSheet("contact")}
            last
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: "#fee2e2",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#ef4444",
              fontWeight: "600",
            }}
          >
            Chiqish
          </Text>
        </TouchableOpacity>

        {/* SOCIAL */}
        <View
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 16,
          }}
        >
          <Text style={{ marginBottom: 10, color: "#6b7280" }}>
            Ijtimoiy tarmoqlar
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {socialLinks.map((item) => (
              <TouchableOpacity
                key={item.href}
                onPress={() => Linking.openURL(item.href)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: item.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM SHEET (GORHOM) */}
      <ProfileBottomSheet
        user={user}
        activeSheet={activeSheet}
        closeSheet={() => setActiveSheet(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  content: { padding: 16, paddingBottom: 40, gap: 12 },

  userCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  userLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    textTransform: "capitalize",
  },
  userPhone: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 1,
  },
  editBtn: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 6 },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIconWrap: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 6,
    marginVertical: 4,
  },
  menuContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  menuLabel: { fontSize: 16, color: "#111111" },

  logoutBtn: {
    width: "100%",
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: "#ef4444",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 15,
  },

  socialCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  socialTitle: { fontSize: 13, color: "#6b7280" },
  socialRow: { flexDirection: "row", gap: 10 },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
    alignSelf: "center",
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  sheetClose: { backgroundColor: "#f1f5f9", borderRadius: 8, padding: 4 },
});
