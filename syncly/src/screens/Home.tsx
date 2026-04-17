import { useRouter } from "expo-router";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

import { Battery, Calendar, CheckCircle2, Circle, Clock, Frown, Heart, RotateCcw, Smile, Zap } from "lucide-react-native";

export default function Home() {
  const router = useRouter();

  const feelings = [
    { label: "Low Energy", icon: Battery, value: "low-energy" },
    { label: "High Energy", icon: Heart, value: "high-energy" },
    { label: "Pain", icon: Frown, value: "pain" },
    { label: "Great", icon: Smile, value: "great" },
  ];

  const exercises = [
    { name: "Push-ups", sets: 3, reps: 12, completed: true },
    { name: "Dumbbell Rows", sets: 3, reps: 10, completed: true },
    { name: "Shoulder Press", sets: 3, reps: 12, completed: false },
    { name: "Bicep Curls", sets: 3, reps: 15, completed: false },
  ];

  function goToCoach(feeling: string) {
    router.push(`/coach?initialFeeling=${feeling}`);
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}>
      <View className="px-4 py-6">
        {/* Header */}
        <Text className="text-4xl font-bold text-gray-900 mb-8">
          Syncly
        </Text>

        {/* Feelings Section */}
        <Card className="mb-8 bg-blue-50 border-blue-100 rounded-[32px] p-5">
          <Text className="text-lg font-semibold text-gray-900 mb-6 text-center">
            How are you feeling today?
          </Text>

          <FlatList
            data={feelings}
            keyExtractor={(item) => item.value}
            numColumns={4}
            scrollEnabled={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 12,
            }}
            renderItem={({ item }) => {
              const Icon = item.icon;

              return (
                <Pressable
                  onPress={() => goToCoach(item.value)}
                  style={{
                    flex: 1,
                    maxWidth: "23%",
                    borderWidth: 1,
                    borderColor: "rgba(14, 165, 171, 0.16)",
                  }}
                  className="items-center justify-center rounded-3xl bg-white py-4"
                >
                  <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
                    <Icon size={24} color="#0ea5ab" strokeWidth={1.5} />
                  </View>

                  <Text className="text-xs font-medium mt-3 text-gray-700 text-center">
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />

          <Text className="text-center text-sm text-gray-500 mt-4">
            Tap a feeling to talk to your AI coach
          </Text>
        </Card>


        {/* Google Calendar Synced */}
        <Card className="mb-4 bg-blue-50">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Calendar size={28} color="#0ea5ab" />
              <View className="ml-4 flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  Google Calendar Synced
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Last sync: 2 minutes ago
                </Text>
              </View>
            </View>
            <RotateCcw size={20} color="#0ea5ab" />
          </View>
        </Card>

        {/* Today's Workout */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-xl font-bold text-gray-900">
                  Today's Workout
                </Text>
                <Clock size={18} color="#0ea5ab" className="ml-2" />
              </View>
              <Text className="text-sm text-gray-600">
                45 min • Upper Body Strength
              </Text>
            </View>
            <View className="ml-2 bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-gray-700">
                2/4
              </Text>
            </View>
          </View>

          <Progress value={50} className="mb-4" />

          {/* Exercises List */}
          <View className="mb-4 -mx-4">
            {exercises.map((exercise, index) => (
              <View 
                key={index} 
                className="flex-row items-center px-4 py-3 bg-blue-50"
                style={{ borderBottomWidth: index < exercises.length - 1 ? 1 : 0, borderBottomColor: "#e0f2fe" }}
              >
                <View className="flex-row items-center flex-1">
                  {exercise.completed ? (
                    <CheckCircle2 size={24} color="#0ea5ab" />
                  ) : (
                    <Circle size={24} color="#d1d5db" />
                  )}
                  <View className="ml-3 flex-1">
                    <Text className={`text-base font-medium ${exercise.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {exercise.name}
                    </Text>
                    <Text className="text-xs text-gray-600 mt-1">
                      {exercise.sets} sets × {exercise.reps} reps
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button 
            className="w-full"
            style={{ backgroundColor: "#0d9488", borderRadius: 8, paddingVertical: 12 }}
            onPress={() => router.push("/coach")}
          >
            <Text className="text-white font-semibold text-base">Continue Workout</Text>
          </Button>
        </Card>

        {/* This Week's Progress */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">
              This Week's Progress
            </Text>
            <Zap size={24} color="#0ea5ab" />
          </View>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-gray-700">
              Workouts completed
            </Text>
            <Text className="text-base font-bold text-teal-600">
              3/5
            </Text>
          </View>

          <Progress value={60} className="mb-3" />

          <Text className="text-sm font-medium text-teal-600">
            Great job! You're on track to meet your weekly goal.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}