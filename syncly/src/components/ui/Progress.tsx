import { cn } from "@/utils/cn";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function Progress({ value = 0, className }: any) {
  const pct = Math.min(100, Math.max(0, value));
  const animatedValue = useSharedValue(pct);

  useEffect(() => {
    animatedValue.value = withTiming(pct, { duration: 300 });
  }, [value, pct, animatedValue]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${animatedValue.value}%`,
  }));

  return (
    <View className={cn("h-2 w-full bg-primary/20 rounded-full overflow-hidden", className)}>
      <Animated.View className="h-full bg-primary" style={animStyle} />
    </View>
  );
}
