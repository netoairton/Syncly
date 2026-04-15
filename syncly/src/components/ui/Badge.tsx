import { cn } from "@/utils/cn";
import { Pressable, Text, View } from "react-native";

type Variant = "default" | "secondary" | "destructive" | "outline";

const variantStyles: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-white",
  outline: "border border-border text-foreground",
};

export function Badge({ variant = "default", className, children, onPress, ...props }: any) {
  const content = (
    <View
      className={cn(
        "px-2 py-0.5 rounded-md w-fit flex-row items-center justify-center",
        variantStyles[variant],
        className
      )}
    >
      {typeof children === "string" ? (
        <Text className="text-xs font-medium">{children}</Text>
      ) : (
        children
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} {...props}>
        {content}
      </Pressable>
    );
  }

  return content;
}