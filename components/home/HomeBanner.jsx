import Swiper from "react-native-swiper";
import { View, Image } from "react-native";

export default function HomeBanner() {
  return (
    <View
      style={{
        height: 180,
        paddingInline: 20,
        marginTop: 20,
        borderRadius: 24,
        // overflow: "hidden",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: {
            width: 0,
            height: 2,
          },
        }}
      >
        <Swiper
          style={{
            borderRadius: 24,

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,

            elevation: 4,
            paddingHorizontal: 10,
          }}
          autoplay
          loop={true}
          showsPagination
          clickable
          spaceBetween={20}
          paginationStyle={{
            bottom: 10,
          }}
          dotStyle={{
            backgroundColor: "#d1d5db",
          }}
          activeDotStyle={{
            backgroundColor: "#0040B1",
          }}
        >
          <Image
            source={require("@/assets/images/banner-1.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
            }}
          />

          <Image
            source={require("@/assets/images/banner-2.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
            }}
          />

          <Image
            source={require("@/assets/images/banner-3.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
            }}
          />
          <Image
            source={require("@/assets/images/banner-4.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
            }}
          />
          <Image
            source={require("@/assets/images/banner-5.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
            }}
          />
        </Swiper>
      </View>
    </View>
  );
}
