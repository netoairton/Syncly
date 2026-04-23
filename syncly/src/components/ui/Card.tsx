import { cn } from "@/utils/cn";
import { Text, View } from "react-native";

export function Card({ className, children, ...props }: any) {
  return (
    <View className={cn("rounded-xl border border-border p-4 bg-card", className)} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ className, children, ...props }: any) {
  return (
    <View className={cn("mb-3", className)} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ className, children, ...props }: any) {
  return (
    <Text className={cn("text-lg font-semibold text-card-foreground", className)} {...props}>
      {children}
    </Text>
  );
}

export function CardDescription({ className, children, ...props }: any) {
  return (
    <Text className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ className, children, ...props }: any) {
  return (
    <View className={cn("mt-2", className)} {...props}>
      {children}
    </View>
  );
}
