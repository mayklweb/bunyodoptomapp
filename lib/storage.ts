import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

export const appStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) =>
    AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

// Zustand persist uchun SecureStore adapter
export const secureStorage: StateStorage = {
  getItem: (key) => SecureStore.getItemAsync(key),

  setItem: (key, value) => SecureStore.setItemAsync(key, value),

  removeItem: (key) => SecureStore.deleteItemAsync(key),
};