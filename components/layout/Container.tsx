import { View } from "react-native";

export default function Container({ children }: { children: React.ReactNode }) {
  return <View style={{maxWidth: 720, width: "100%", marginInline: "auto", paddingHorizontal: 20 }}>{children}</View>;
}
