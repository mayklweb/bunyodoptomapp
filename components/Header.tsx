import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import SearchIcon from "@/components/icons/SearchIcon";
import Container from "./Container";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showLogo?: boolean;
  showBack?: boolean;
  center?: boolean;
  rightElement?: React.ReactNode;
};

export default function Header({
  title,
  subtitle,
  showSearch,
  showLogo,
  showBack,
  center,
  rightElement,
}: HeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();

  const canGoBack = showBack && navigation.canGoBack();

  return (
    <View style={styles.header}>
      <Container>
        <View style={styles.row}>
          {/* CHAP QISM */}
          <View style={[styles.side, styles.sideLeft]}>
            {canGoBack && (
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={12}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <ArrowLeftIcon size={28} color="#111" />
              </TouchableOpacity>
            )}

            {showLogo && (
              <View style={styles.logo}>
                <Image
                  style={{ width: 44, height: 44 }}
                  source={require("@/assets/images/logo.png")}
                  resizeMode="contain"
                />
              </View>
            )}

            {!center && (title || subtitle) && (
              <View style={styles.textWrapper}>
                {title && <Text style={styles.title}>{title}</Text>}
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            )}
          </View>

          {/* MARKAZIY QISM */}
          {center && (title || subtitle) ? (
            <View style={styles.centerBlock}>
              {title && (
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          ) : showSearch ? (
            <TouchableOpacity
              style={styles.searchBar}
              onPress={() => router.push("/search")}
              activeOpacity={0.7}
            >
              <SearchIcon size={22} color="#8C8C8C" />
              <Text style={{ fontSize: 16, color: "#8C8C8C", marginLeft: 8 }}>
                Qidirish...
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.centerBlock} />
          )}

          {/* O'NG QISM */}
          <View style={[styles.side, styles.sideRight]}>{rightElement}</View>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    // paddingLeft: -0,
    // flex: 1, // <-- FIX: equal width on both sides regardless of content
    flexDirection: "row",
    alignItems: "center",
  },
  sideLeft: {
    justifyContent: "flex-start",
  },
  sideRight: {
    justifyContent: "flex-end",
  },
  centerBlock: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    marginRight: 8,
    // padding: 2,
  },
  textWrapper: {
    flexShrink: 1,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
  searchBar: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
});
