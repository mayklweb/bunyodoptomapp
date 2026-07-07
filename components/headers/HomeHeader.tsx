import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function HomeHeader() {
  return (
    <View className="bg-white ">
      <View className="w-full flex">
        {/* LOGO */}
        <View
          className="w-10 h-10 bg-slate-950"
          // style={styles.logoBox}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            // style={styles.logo}
            resizeMode="cover"
          />
        </View>

        {/* SEARCH */}
        <View
        // style={styles.searchBox}
        >
          <TextInput
            className="text-2xl font-normal"
            placeholder="Shirinliklar..."
            placeholderTextColor="#9ca3af"
            // style={styles.input}
          />

          <TouchableOpacity
            className="w-16"
            // style={styles.button}
          >
            <Image
              className="h-6 w-6 rounded-l-lg bg-black p-1"
              source={require("@/assets/icons/search.svg")}
              // style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     gap: 12,
//   },

//   logoBox: {
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//   },

//   logo: {
//     width: 40,
//     height: 40,
//   },

//   searchBox: {
//     flex: 1,
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 12,
//     overflow: "hidden",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },

//   input: {
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     color: "#000",
//     fontSize: 16,`
//   },

//   button: {
//     // paddingHorizontal: 10,
//     width: 60,
//     borderTopLeftRadius: 10,
//     borderBottomLeftRadius: 10,
//     height: 42,
//     backgroundColor: "#f3f4f6",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
