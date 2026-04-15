// Mock Google Calendar API
export const mockGoogleCalendar = {
  // Simulate fetching calendar events
  getEvents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            summary: "Team Meeting",
            start: "2026-03-18T12:00:00",
            end: "2026-03-18T13:00:00",
          },
          {
            id: "2",
            summary: "Morning Workout",
            start: "2026-03-17T07:00:00",
            end: "2026-03-17T07:45:00",
          },
        ]);
      }, 500);
    });
  },

  // Simulate syncing workout to calendar
  syncWorkout: async (workout: { name: string; startTime: string; duration: number }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          eventId: `event-${Date.now()}`,
          message: `"${workout.name}" added to calendar`,
        });
      }, 300);
    });
  },

  // Simulate checking for conflicts
  checkConflicts: async (proposedTime: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hasConflict: Math.random() > 0.7,
          conflictingEvent: "Team Meeting",
        });
      }, 200);
    });
  },
};

// Mock AI Coach API (LLM)
export const mockAICoach = {
  // Simulate processing voice message
  processVoiceMessage: async (audioData: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transcript: "I'm feeling low on energy today",
          response: "I understand. Let's adjust your workout to a lighter session focusing on mobility and gentle cardio.",
          voiceUrl: "mock-voice-response.mp3", // In real app, this would be TTS audio
        });
      }, 1000);
    });
  },

  // Simulate getting workout recommendations
  getWorkoutRecommendation: async (userState: {
    energyLevel: string;
    painAreas?: string[];
    recentWorkouts: string[];
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const recommendations = {
          "low-energy": {
            workout: "Light Cardio & Mobility",
            duration: 25,
            intensity: "Low",
            exercises: ["Walking", "Stretching", "Foam Rolling"],
          },
          "high-energy": {
            workout: "High-Intensity Circuit",
            duration: 50,
            intensity: "High",
            exercises: ["Burpees", "Jump Squats", "Mountain Climbers", "Push-ups"],
          },
          "back-pain": {
            workout: "Core Stability & Upper Body",
            duration: 30,
            intensity: "Moderate",
            exercises: ["Planks", "Bird Dogs", "Shoulder Press", "Bicep Curls"],
          },
        };

        const recommendation =
          recommendations[userState.energyLevel as keyof typeof recommendations] ||
          recommendations["low-energy"];

        resolve(recommendation);
      }, 800);
    });
  },

  // Simulate text-to-speech for coach responses
  textToSpeech: async (text: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          audioUrl: `mock-tts-${Date.now()}.mp3`,
          duration: text.length * 0.05, // Mock duration based on text length
        });
      }, 500);
    });
  },
};

// Mock workout adjustment based on calendar changes
export const adjustWorkoutSchedule = async (calendarEvents: any[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Logic to adjust workouts based on calendar conflicts
      const adjustedSchedule = {
        changes: [
          {
            original: "Morning Workout - 7:00 AM",
            adjusted: "Morning Workout - 6:30 AM",
            reason: "Conflict with Team Meeting at 7:00 AM",
          },
        ],
        message: "Your schedule has been optimized to avoid conflicts",
      };
      resolve(adjustedSchedule);
    }, 600);
  });
};
