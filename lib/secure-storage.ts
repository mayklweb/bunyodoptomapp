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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isServer = Platform.OS === "web" && typeof window === "undefined";

export const storage = {
  getItem: async (key: string) => {
    if (isServer) return null;
    return AsyncStorage.getItem(key);
  },

  setItem: async (key: string, value: string) => {
    if (isServer) return;
    return AsyncStorage.setItem(key, value);
  },

  removeItem: async (key: string) => {
    if (isServer) return;
    return AsyncStorage.removeItem(key);
  },
};
