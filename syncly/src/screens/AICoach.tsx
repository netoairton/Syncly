import { Badge } from "@/components/ui/Badge";
import { useLocalSearchParams } from "expo-router";
import { Bot } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function AICoach() {
//   const { initialFeeling } = useLocalSearchParams();
  const { initialFeeling } = useLocalSearchParams<{ initialFeeling?: string }>();
  
  const [messages, setMessages] = useState([
    { role: "coach", content: "Welcome! Tell me how you're feeling today." },
  ]);

  const sendQuick = (value: string) => {
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "coach", content: "Thanks! Let me adjust your training..." },
      ]);
    }, 500);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 p-5 border-b border-border">
        <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
          <Bot size={26} color="white" />
        </View>
        <Text className="text-xl font-semibold">AI Coach</Text>
      </View>

      <ScrollView className="flex-1 p-5">
        {messages.map((m, i) => (
          <View key={i} className={`mb-4 ${m.role === "user" ? "items-end" : "items-start"}`}>
            <View
              className={`p-3 rounded-xl max-w-[80%] ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              <Text>{m.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="p-4 border-t border-border">
        <Text className="text-sm mb-2">Quick responses:</Text>
        <View className="flex-row gap-2 flex-wrap">
          <Badge onPress={() => sendQuick("Low Energy")}>Low Energy</Badge>
          <Badge onPress={() => sendQuick("High Energy")}>High Energy</Badge>
          <Badge onPress={() => sendQuick("Pain")}>Pain</Badge>
        </View>
      </View>
    </View>
  );
}