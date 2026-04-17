import { cn } from "@/utils/cn";
import { Pressable, Text, ViewStyle } from "react-native";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-white",
  outline: "border border-border bg-background text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "bg-transparent",
  link: "text-primary underline",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-4",
  sm: "h-8 px-3",
  lg: "h-12 px-6",
  icon: "h-10 w-10",
};

export function Button({
  variant = "default",
  size = "default",
  className,
  disabled,
  children,
  onPress,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={style}
      className={cn(
        "flex flex-row items-center justify-center rounded-md active:opacity-80",
        variants[variant],
        sizes[size],
        disabled && "opacity-50",
        className
      )}
    >
      {typeof children === "string" ? (
        <Text className="text-base">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}