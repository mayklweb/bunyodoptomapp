import {
  CartIcon,
  HomeIcon,
  ProductsIcon,
  UserIcon,
} from "../../components/icons";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import QueryProvider from "@/providers/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export default function TabsLayout() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <View style={styles.offlineContainer}>
        <Text style={styles.title}>Nimadir buzilib qoldi</Text>
        <Text style={styles.subtitle}>
        internetni tekshiring va sahifani
        </Text>
      </View>
    );
  }

  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>

          <Tabs
            screenOptions={{
              headerShown: false,

              sceneStyle: {
                // backgroundColor: "#F5F5F5",
              },

              tabBarStyle: {
                height: 60,
                // backgroundColor: "#fff",
                // borderTopColor: "#E5E5E5",
                elevation: 0,
                shadowColor: "#fff",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0,
                shadowRadius: 0,
              },

              tabBarActiveTintColor: "#0040B1",
              tabBarInactiveTintColor: "#404040",

              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: "500",
              },
            }}
          >
              <Tabs.Screen
                name="home"
                options={{
                  title: "Asosiy",
                  tabBarIcon: ({ color, size }) => (
                    <HomeIcon color={color} size={size} />
                  ),
                }}
              />

              <Tabs.Screen
                name="catalog"
                options={{
                  title: "Katalog",
                  tabBarIcon: ({ color, size }) => (
                    <ProductsIcon color={color} size={size} />
                  ),
                }}
              />

              <Tabs.Screen
                name="cart"
                options={{
                  title: "Savat",
                  tabBarIcon: ({ color, size }) => (
                    <CartIcon color={color} size={size} />
                  ),
                }}
              />

              <Tabs.Screen
                name="profile"
                options={{
                  title: "Profil",
                  tabBarIcon: ({ color, size }) => (
                    <UserIcon color={color} size={size} />
                  ),
                }}
              />
          </Tabs>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  offlineContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
});
