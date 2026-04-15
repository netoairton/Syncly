import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

import { Battery, Frown, Heart, Smile } from "lucide-react-native";

export default function Home() {
  const router = useRouter();

  const feelings = [
    { label: "Low Energy", icon: Battery, value: "low-energy" },
    { label: "High Energy", icon: Heart, value: "high-energy" },
    { label: "Pain", icon: Frown, value: "pain" },
    { label: "Great", icon: Smile, value: "great" },
  ];

  function goToCoach(feeling: string) {
    router.push(`/coach?initialFeeling=${feeling}`);
  }

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold text-foreground mb-4">
        Syncly
      </Text>

      <Text className="text-lg font-medium mb-3">
        How are you feeling today?
      </Text>

      <View className="flex-row flex-wrap gap-3 mb-8">
        {feelings.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.value}
              className="items-center p-4 rounded-xl bg-card border border-border w-[47%]"
              onPress={() => goToCoach(item.value)}
            >
              <Icon size={28} color="#129fa5" />
              <Text className="text-sm mt-2 text-foreground">{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <Text className="text-lg font-semibold mb-2">Today's Workout</Text>
        <Text className="text-sm text-muted-foreground mb-2">
          45 min • Upper Body Strength
        </Text>

        <Progress value={50} className="mb-3" />

        <Button onPress={() => router.push("/coach")}>
          Continue workout
        </Button>
      </Card>
    </ScrollView>
  );
}