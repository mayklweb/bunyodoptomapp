import { Tabs } from "expo-router";
import React from "react";

import HomeIcon from "../../../components/icons/HomeIcon";
import ProfileIcon from "../../../components/icons/ProfileIcon";
import CartIcon from "../../../components/icons/CartIcon";
import ProductsIcon from "../../../components/icons/ProductsIcon";

import Header from "@/components/Header";
import { colors } from "@/styles/globalStyles";

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="order"
      screenOptions={{
        headerShown: true,

        sceneStyle: {
          backgroundColor: colors.background,
        },

        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          backgroundColor: colors.backgroundWhite,
        },

        tabBarActiveTintColor: colors.primary,

        tabBarInactiveTintColor: colors.textSecondary,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Asosiy",

          header: () => <Header title="" showSearch showLogo />,

          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} filled={focused} />
          ),
        }}
      />

      {/* CATALOG */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Katalog",

          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <ProductsIcon color={color} filled={focused} />
          ),
        }}
      />

      {/* CART */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Savat",

          header: () => <Header title="Savat" center />,

          tabBarIcon: ({ color, focused }) => (
            <CartIcon color={color} filled={focused} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",

          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={color} filled={focused} />
          ),
        }}
      />

      {/* PRODUCT DETAIL */}
      <Tabs.Screen
        name="product"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
