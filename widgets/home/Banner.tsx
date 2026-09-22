import { Dimensions, Image, ImageSourcePropType, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import Carousel from "react-native-reanimated-carousel";

interface BannerItem {
  id: string;
  image: ImageSourcePropType;
}

interface BannerSlideProps {
  item: BannerItem;
  animationValue: SharedValue<number>;
  height: number;
  slideWidth: number;
}

const { width } = Dimensions.get("window");

// Karusel eni: ekran kengligidan chekka bo'sh joylarni ayirib olamiz
const screenWidth = width < 720 ? width : 720

const CAROUSEL_WIDTH = screenWidth - 40;
// Balandlikni kenglikka nisbatan hisoblaymiz (masalan 16:9 ga yaqin, banner uchun 2:1 yoki 16:7 keng tarqalgan)
const BANNER_ASPECT_RATIO = 16 / 9;
const CAROUSEL_HEIGHT = CAROUSEL_WIDTH / BANNER_ASPECT_RATIO;

const banners: BannerItem[] = [
  { id: "1", image: require("@/assets/images/banner-1.jpg") },
  { id: "2", image: require("@/assets/images/banner-2.jpg") },
  { id: "3", image: require("@/assets/images/banner-3.jpg") },
];

function BannerSlide({ item, animationValue, height, slideWidth }: BannerSlideProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(animationValue.value, [-1, 0, 1], [0.8, 1, 0.8]) },
    ],
    opacity: interpolate(animationValue.value, [-1, 0, 1], [0.6, 1, 0.6]),
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width: slideWidth,
            height,
            borderRadius: 18,
            overflow: "hidden",
          },
          animatedStyle,
        ]}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

export default function Banner() {
  return (
    <View>
      <Carousel<BannerItem>
        style={{ width: "100%" }}
        loop
        width={CAROUSEL_WIDTH}
        height={CAROUSEL_HEIGHT}
        autoPlay
        autoPlayInterval={2000}
        data={banners}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 40,
        }}
        renderItem={({ item, animationValue }: any) => (
          <BannerSlide
            key={item.id}
            item={item}
            animationValue={animationValue}
            height={CAROUSEL_HEIGHT}
            slideWidth={CAROUSEL_WIDTH}
          />
        )}
      />
    </View>
  );
}