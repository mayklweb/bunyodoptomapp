// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// export const storage = {
//   getItem: async (name: string) => {
//     return await AsyncStorage.getItem(name);
//   },

//   setItem: async (name: string, value: string) => {
//     await AsyncStorage.setItem(name, value);
//   },

//   removeItem: async (name: string) => {
//     await AsyncStorage.removeItem(name);
//   },
// };

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isServer = Platform.OS === "web" && typeof window === "undefined";

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isServer) return null;

    if (Platform.OS === "web") {
      return window.localStorage.getItem(key);
    }

    return SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (isServer) return;

    if (Platform.OS === "web") {
      window.localStorage.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    if (isServer) return;

    if (Platform.OS === "web") {
      window.localStorage.removeItem(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};
