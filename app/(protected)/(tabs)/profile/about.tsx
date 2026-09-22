import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// TODO: quyidagi matnlar va ma'lumotlarni o'z kompaniyangizga moslang
const ABOUT_TEXT =
  "Biz — mijozlarga sifatli va tezkor xizmat ko'rsatishni maqsad qilgan jamoamiz. " +
  "Kompaniyamiz yillar davomida to'plangan tajriba asosida ishonchli yechimlar taqdim etadi.";

const MISSION_TEXT =
  "Bizning maqsadimiz — har bir mijozga qulay, tez va shaffof xizmat ko'rsatish.";

const CONTACTS = {
  phone: "+998 90 123 45 67",
  email: "info@example.com",
  address: "Xorazm viloyati, Urganch shahri",
};

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Biz haqimizda</Text>
        <Text style={styles.paragraph}>{ABOUT_TEXT}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bizning maqsadimiz</Text>
        <Text style={styles.paragraph}>{MISSION_TEXT}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Aloqa uchun</Text>

        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL(`tel:${CONTACTS.phone}`)}
        >
          <Text style={styles.contactLabel}>Telefon</Text>
          <Text style={styles.contactValue}>{CONTACTS.phone}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL(`mailto:${CONTACTS.email}`)}
        >
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>{CONTACTS.email}</Text>
        </TouchableOpacity>

        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Manzil</Text>
          <Text style={styles.contactValue}>{CONTACTS.address}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  paragraph: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  contactLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  contactValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    maxWidth: "65%",
    textAlign: "right",
  },
});