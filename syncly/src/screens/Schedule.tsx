import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { mockGoogleCalendar } from "@/services/mockApis";
import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

export default function Schedule() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    mockGoogleCalendar.getEvents().then((res) => setEvents(res as any[]));
  }, []);

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold mb-4">Training Schedule</Text>

      {events.map((event) => (
        <Card key={event.id} className="mb-4">
          <Text className="text-lg font-semibold">{event.summary}</Text>
          <Text className="text-sm text-muted-foreground">
            {event.start} → {event.end}
          </Text>
          <Badge variant="secondary" className="mt-2">
            Synced
          </Badge>
        </Card>
      ))}
    </ScrollView>
  );
}