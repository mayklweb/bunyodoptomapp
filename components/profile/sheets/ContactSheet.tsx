import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { PhoneIcon, MailIcon, LocationIcon } from "@/components/icons";
import { sc } from "../SheetStyles";

const contacts = [
  {
    icon: <PhoneIcon size={20} color="#0040B1" />,
    label: "Telefon",
    value: "+998 99 966 70 70",
  },
  {
    icon: <MailIcon size={20} color="#0040B1" />,
    label: "Email",
    value: "info@bunyodoptom.uz",
  },
  {
    icon: <LocationIcon size={20} color="#0040B1" />,
    label: "Manzil",
    value: "Urganch, Darital orqa tomoni",
  },
];

export default function ContactSheet() {
  return (
    <View>
      <View style={{ gap: 16, marginBottom: 24 }}>
        <View style={{ gap: 10, marginBottom: 24 }}>
          {contacts.map((row) => (
            <View
              key={row.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: "#EEF2FF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {row.icon}
              </View>

              {/* Divider */}
              <View
                style={{
                  width: 1,
                  height: 32,
                  backgroundColor: "#E5E7EB",
                }}
              />

              {/* Text */}
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {row.label}
                </Text>
                <Text
                  style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}
                >
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={sc.field}>
          <Text style={sc.fieldLabel}>Xabar</Text>
          <TextInput
            style={[
              sc.input,
              { height: 90, textAlignVertical: "top", paddingTop: 10 },
            ]}
            placeholder="Xabaringizni yozing..."
            multiline
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity style={sc.primaryBtn}>
          <Text style={sc.primaryBtnText}>Yuborish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
