import { cn } from "@/utils/cn";
import { useState } from "react";
import { Image, Text, View } from "react-native";

const FALLBACK = {
  uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhla... (base64 abreviado)"
};

export function ImageWithFallback({ src, alt, className, style }: any) {
  const [error, setError] = useState(false);

  if (!src || error)
    return (
      <View className={cn("bg-gray-200 items-center justify-center", className)} style={style}>
        <Text className="text-gray-500 text-xs">{alt ?? "Imagem indisponível"}</Text>
      </View>
    );

  return (
    <Image
      source={{ uri: src }}
      onError={() => setError(true)}
      className={className}
      style={style}
    />
  );
}
``