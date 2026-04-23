export type TrainingScheduleStatus = "in_progress" | "scheduled";

export type ScheduleExercise = {
  name: string;
  sets: number;
  reps: number;
  /** Se "sec", `reps` é duração em segundos por série */
  unit?: "reps" | "sec";
};

export type TrainingScheduleItem = {
  id: string;
  title: string;
  start: Date;
  durationMin: number;
  status: TrainingScheduleStatus;
  /** Texto do rodapé do cartão: “Sincronizado: …” */
  syncNote: string;
  exercises: ScheduleExercise[];
};

function buildMockTrainingSchedule(): TrainingScheduleItem[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  return [
    {
      id: "w1",
      title: "Força — membros superiores",
      start: new Date(y, m, d, 7, 0, 0, 0),
      durationMin: 45,
      status: "in_progress",
      syncNote: "Treino matinal",
      exercises: [
        { name: "Flexões", sets: 3, reps: 12 },
        { name: "Remada com halteres", sets: 3, reps: 10 },
        { name: "Desenvolvimento de ombros", sets: 3, reps: 12 },
        { name: "Rosca bíceps", sets: 3, reps: 15 },
      ],
    },
    {
      id: "w2",
      title: "Cardio e core",
      start: new Date(y, m, d + 1, 18, 0, 0, 0),
      durationMin: 30,
      status: "scheduled",
      syncNote: "Treino matinal",
      exercises: [
        { name: "Polichinelo", sets: 3, reps: 20 },
        { name: "Prancha", sets: 3, reps: 45, unit: "sec" },
        { name: "Escalador", sets: 3, reps: 16 },
        { name: "Abdominal bicicleta", sets: 3, reps: 20 },
      ],
    },
    {
      id: "w3",
      title: "HIIT express",
      start: new Date(y, m, d + 2, 12, 0, 0, 0),
      durationMin: 25,
      status: "scheduled",
      syncNote: "Treino matinal",
      exercises: [
        { name: "Burpee", sets: 4, reps: 8 },
        { name: "Agachamento com salto", sets: 4, reps: 12 },
        { name: "Corrida no lugar", sets: 4, reps: 30 },
      ],
    },
  ];
}

// Mock Google Calendar API
export const mockGoogleCalendar = {
  /** Treinos na agenda (datas relativas ao dia atual) */
  getTrainingSchedule: async (): Promise<TrainingScheduleItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(buildMockTrainingSchedule()), 450);
    });
  },

  // Simulate fetching calendar events
  getEvents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            summary: "Reunião de equipe",
            start: "2026-03-18T12:00:00",
            end: "2026-03-18T13:00:00",
          },
          {
            id: "2",
            summary: "Treino matinal",
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
          message: `"${workout.name}" adicionado à agenda`,
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
          conflictingEvent: "Reunião de equipe",
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
          transcript: "Estou com pouca energia hoje",
          response:
            "Entendi. Vamos ajustar o treino para uma sessão mais leve, com foco em mobilidade e cardio suave.",
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
            workout: "Cardio leve e mobilidade",
            duration: 25,
            intensity: "Baixa",
            exercises: ["Caminhada", "Alongamento", "Rolo de espuma"],
          },
          "high-energy": {
            workout: "Circuito de alta intensidade",
            duration: 50,
            intensity: "Alta",
            exercises: ["Burpee", "Agachamento com salto", "Escalador", "Flexões"],
          },
          "back-pain": {
            workout: "Estabilidade do core e parte superior",
            duration: 30,
            intensity: "Moderada",
            exercises: ["Prancha", "Bird dog", "Desenvolvimento de ombros", "Rosca bíceps"],
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
            original: "Treino matinal — 7:00",
            adjusted: "Treino matinal — 6:30",
            reason: "Conflito com reunião de equipe às 7:00",
          },
        ],
        message: "A sua agenda foi otimizada para evitar conflitos",
      };
      resolve(adjustedSchedule);
    }, 600);
  });
};
