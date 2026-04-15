import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function Switch({ value = false, onValueChange, className }: any) {
  const [isOn, setIsOn] = useState(value);
  const translateX = useSharedValue(value ? 20 : 0);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    onValueChange?.(next);
  };

  useEffect(() => {
    translateX.value = withTiming(isOn ? 20 : 0, { duration: 150 });
  }, [isOn, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable
      onPress={toggle}
      className={cn(
        "w-10 h-5 rounded-full flex-row items-center p-0.5",
        isOn ? "bg-primary" : "bg-switch-background",
        className
      )}
    >
      <Animated.View className="w-4 h-4 bg-white rounded-full" style={thumbStyle} />
    </Pressable>
  );
}