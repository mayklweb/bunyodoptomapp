import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { StateStorage } from "zustand/middleware";

export const appStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

const isWeb = Platform.OS === "web";
const isServer = isWeb && typeof window === "undefined";

// Zustand persist uchun SecureStore adapter (web'da SecureStore yo'q, shuning uchun AsyncStorage)
export const secureStorage: StateStorage = {
  getItem: async (key) => {
    if (isServer) return null;
    if (isWeb) return AsyncStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },

  setItem: async (key, value) => {
    if (isServer) return;
    if (isWeb) return AsyncStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },

  removeItem: async (key) => {
    if (isServer) return;
    if (isWeb) return AsyncStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
};