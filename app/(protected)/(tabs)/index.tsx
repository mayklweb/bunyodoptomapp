import { ScrollView, View } from "react-native";
import DismissKeyboard from "@/components/DismissKeyboard";
import Container from "@/components/Container";
import { Banner, Categories, Products } from "@/widgets/home";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Container>
          <View style={{ flex: 1, paddingVertical: 24 }}>
            <Banner />
            <Categories />
            <Products />
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}
