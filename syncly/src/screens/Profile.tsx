import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { ScrollView, Text } from "react-native";

export default function Profile() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold mb-4">Profile</Text>

      <Card className="mb-4">
        <Text className="text-lg font-semibold">Workout Reminders</Text>
        <Switch className="mt-2" />
      </Card>

      <Card>
        <Text className="text-lg font-semibold">AI Suggestions</Text>
        <Switch className="mt-2" />
      </Card>
    </ScrollView>
  );
}
``