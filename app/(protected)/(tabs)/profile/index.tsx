import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import MenuItem from "@/widgets/profile/MenuItem";
import OrderIcon from "@/components/icons/OrderIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import EditIcon from "@/components/icons/EditIcon";
import LocationIcon from "@/components/icons/Location";
import StoreIcon from "@/components/icons/StoreIcon";
import HeartIcon from "@/components/icons/HeartIcon";
// import { useProfile } from "@/hooks/useProfile";
import { formatPhone } from "@/utils";
// import { useLogout } from "@/hooks/useLogout";
import { useProfile } from "@/hooks/user/useProfile";
import { useLogout } from "@/hooks/auth/useLogout";

type ProfileMenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
};

const menuItems: ProfileMenuItem[] = [
  {
    id: "account",
    label: "Shaxsiy ma'lumotlar",
    icon: <ProfileIcon size={20} color="#404040" />,
    route: "/profile/account",
  },
  {
    id: "address",
    label: "Manzil",
    icon: <LocationIcon size={20} color="#404040" />,
    route: "/profile/address",
  },
  {
    id: "orders",
    label: "Buyurtmalar",
    icon: <OrderIcon size={20} color="#404040" />,
    route: "/profile/orders",
  },
  {
    id: "favourites",
    label: "Sevimlilar",
    icon: <HeartIcon size={20} color="#404040" />,
    route: "/profile/favourites",
  },
  {
    id: "store",
    label: "Do'konim",
    icon: <StoreIcon size={20} color="#404040" />,
    route: "/profile/store",
  },
];
const infoItems: ProfileMenuItem[] = [
  {
    id: "about",
    label: "Biz haqimizda",
    icon: <ProfileIcon size={20} color="#404040" />,
    route: "/profile/about",
  },
  {
    id: "connect",
    label: "Bog'lanish",
    icon: <LocationIcon size={20} color="#404040" />,
    route: "/profile/connect",
  },
];

export default function ProfileScreen() {
  const { data: user } = useProfile();

  const { logout } = useLogout();

  return (
    <View style={styles.container}>
      <ScrollView
        // style={styles.root}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Foydalanuvchi qisqacha ma'lumoti */}
        <View style={styles.userCard}>
          <View style={styles.userLeft}>
            <View style={styles.avatarFallback}>
              <ProfileIcon size={32} color="#6b7280" />
            </View>
            <View>
              <Text style={styles.userName}>
                {user?.name || "Foydalanuvchi"}
              </Text>
              <Text style={styles.userPhone}>
                {user?.phone ? formatPhone(user.phone) : ""}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/profile/account")}
            activeOpacity={0.7}
          >
            <EditIcon size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <MenuItem
              key={i}
              icon={item.icon}
              label={item.label}
              onPress={() => router.push(item.route as any)}
            />
          ))}
        </View>
        <View style={styles.menuCard}>
          {infoItems.map((item, i) => (
            <MenuItem
              key={i}
              icon={item.icon}
              label={item.label}
              onPress={() => router.push(item.route as any)}
            />
          ))}
        </View>

        {/* Chiqish tugmasi */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },

  container: {
    flex: 1,
  },
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
    paddingVertical: 12,
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
    ...StyleSheet.absoluteFill,
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
