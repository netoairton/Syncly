import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

import {
  Battery,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Frown,
  Smile,
  Zap,
} from "lucide-react-native";

/** Paleta alinhada ao visual Syncly (teal escuro + fundos menta claros) */
const colors = {
  ink: "#1A4D4E",
  inkMuted: "#3D6668",
  inkSoft: "#5C7A7C",
  page: "#FFFFFF",
  cardMint: "#F0F9F9",
  cardMintEdge: "rgba(26, 77, 78, 0.12)",
  circleLow: "#FFE8EC",
  circleLowIcon: "#C93B48",
  circleHigh: "#E0F4FF",
  circleHighIcon: "#1A4D4E",
  circlePain: "#E8EBED",
  circlePainIcon: "#6B7280",
  circleGreat: "#D6F5F2",
  circleGreatIcon: "#1A4D4E",
  mintIconWell: "#E8F6F6",
  borderLight: "#E3EEED",
  progressTrack: "#E0EFEE",
  progressFill: "#2A9D94",
  accentButton: "#0F766E",
};

function DottedRingLogo() {
  const n = 12;
  const r = 18;
  const cx = 22;
  const cy = 22;
  return (
    <View style={styles.dottedRingWrap}>
      {[...Array(n)].map((_, i) => {
        const rad = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <View
            key={i}
            style={[
              styles.dottedParticle,
              {
                left: cx + r * Math.cos(rad) - 1.5,
                top: cy + r * Math.sin(rad) - 1.5,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function SynclyHeader() {
  return (
    <View style={styles.headerBlock}>
      <View style={styles.diamondOuter}>
        <View style={styles.diamond}>
          <View style={styles.diamondInner}>
            <DottedRingLogo />
          </View>
        </View>
      </View>
      <Text style={styles.brandWord}>SYNCLY</Text>
      <Text style={styles.tagline}>BEM-ESTAR CONTÍNUO</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const feelings = [
    {
      label: "Pouca energia",
      value: "low-energy",
      Icon: Battery,
      circleBg: colors.circleLow,
      iconColor: colors.circleLowIcon,
    },
    {
      label: "Muita energia",
      value: "high-energy",
      Icon: Zap,
      circleBg: colors.circleHigh,
      iconColor: colors.circleHighIcon,
    },
    {
      label: "Dor",
      value: "pain",
      Icon: Frown,
      circleBg: colors.circlePain,
      iconColor: colors.circlePainIcon,
    },
    {
      label: "Ótimo",
      value: "great",
      Icon: Smile,
      circleBg: colors.circleGreat,
      iconColor: colors.circleGreatIcon,
    },
  ];

  const exercises = [
    { name: "Flexões", sets: 3, reps: 12, completed: true },
    { name: "Remada com halteres", sets: 3, reps: 10, completed: true },
    { name: "Desenvolvimento de ombros", sets: 3, reps: 12, completed: false },
    { name: "Rosca bíceps", sets: 3, reps: 15, completed: false },
  ];

  const completed = exercises.filter((e) => e.completed).length;
  const total = exercises.length;
  const progressPct = (completed / total) * 100;

  function goToCoach(feeling: string) {
    router.push(`/coach?initialFeeling=${feeling}`);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.page }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: Math.max(insets.top, 12) + 8,
        paddingBottom: 28,
      }}
      showsVerticalScrollIndicator={false}
    >
      <SynclyHeader />

      {/* Cartão — Como está a sentir-se */}
      <View style={styles.feelingCard}>
        <Text style={styles.feelingTitle}>Como você está se sentindo hoje?</Text>

        <View style={styles.feelingRow}>
          {feelings.map((item) => {
            const Icon = item.Icon;
            return (
              <Pressable
                key={item.value}
                onPress={() => goToCoach(item.value)}
                style={({ pressed }) => [styles.feelingItem, pressed && { opacity: 0.85 }]}
              >
                <View style={[styles.feelingCircle, { backgroundColor: item.circleBg }]}>
                  <Icon size={26} color={item.iconColor} strokeWidth={2} />
                </View>
                <Text style={styles.feelingLabel}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.feelingHint}>
          Toque em um sentimento para falar com seu treinador de IA
        </Text>
      </View>

      {/* Google Agenda — pílula */}
      <View style={styles.calendarPill}>
        <View style={styles.calendarIconWell}>
          <Calendar size={22} color={colors.ink} strokeWidth={2} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.calendarTitle}>Google Agenda sincronizada</Text>
          <Text style={styles.calendarSub}>Última sincronização: há 2 minutos</Text>
        </View>
        <View style={styles.checkWell}>
          <CheckCircle2 size={22} color={colors.progressFill} strokeWidth={2.2} />
        </View>
      </View>

      {/* Treino de hoje */}
      <View style={styles.workoutSection}>
        <View style={styles.workoutSectionHeader}>
          <Text style={styles.workoutSectionTitle}>Treino de hoje</Text>
          <View style={styles.durationPill}>
            <Clock size={16} color={colors.ink} strokeWidth={2} />
            <Text style={[styles.durationText, { marginLeft: 6 }]}>45 min</Text>
          </View>
        </View>

        <View style={styles.workoutInnerCard}>
          <View style={styles.workoutInnerTop}>
            <Text style={styles.workoutPlanTitle}>Força de membros superiores</Text>
            <Text style={styles.workoutPlanMeta}>
              {completed}/{total} exercícios
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={styles.exerciseList}>
            {exercises.map((exercise, index) => (
              <View
                key={exercise.name}
                style={[
                  styles.exerciseRow,
                  index < exercises.length - 1 && styles.exerciseRowBorder,
                ]}
              >
                <View style={styles.exerciseRowInner}>
                  {exercise.completed ? (
                    <CheckCircle2 size={22} color={colors.progressFill} strokeWidth={2} />
                  ) : (
                    <Circle size={22} color="#CBD5E1" strokeWidth={2} />
                  )}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={[
                        styles.exerciseName,
                        exercise.completed && styles.exerciseNameDone,
                      ]}
                    >
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseDetail}>
                      {exercise.sets} séries × {exercise.reps} repetições
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button
            style={styles.ctaButton}
            onPress={() => router.push("/coach")}
          >
            <Text style={styles.ctaButtonText}>Continuar treino</Text>
          </Button>
        </View>
      </View>

      {/* Progresso semanal — mesmo idioma visual */}
      <Card className="mb-2 border-0" style={styles.weekCard}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Text style={styles.workoutSectionTitle}>Progresso desta semana</Text>
          <Zap size={22} color={colors.progressFill} strokeWidth={2} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={styles.calendarSub}>Treinos concluídos</Text>
          <Text style={styles.workoutPlanMeta}>3/5</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: "60%" }]} />
        </View>
        <Text style={styles.weekEncouragement}>
          Muito bem! Você está no caminho para cumprir a meta semanal.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  diamondOuter: {
    marginBottom: 14,
  },
  diamond: {
    width: 76,
    height: 76,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: "#FAFEFE",
    transform: [{ rotate: "45deg" }],
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  diamondInner: {
    width: 52,
    height: 52,
    transform: [{ rotate: "-45deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  dottedRingWrap: {
    width: 44,
    height: 44,
    position: "relative",
  },
  dottedParticle: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.ink,
  },
  brandWord: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: colors.inkMuted,
    letterSpacing: 1.2,
  },
  feelingCard: {
    backgroundColor: colors.cardMint,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  feelingTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
    marginBottom: 20,
  },
  feelingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  feelingItem: {
    alignItems: "center",
    width: "22%",
    maxWidth: 76,
  },
  feelingCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  feelingLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
    textAlign: "center",
    lineHeight: 14,
  },
  feelingHint: {
    marginTop: 18,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  calendarPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardMint,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  calendarIconWell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mintIconWell,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  calendarSub: {
    marginTop: 4,
    fontSize: 12,
    color: colors.inkSoft,
  },
  checkWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F6F6",
    justifyContent: "center",
    alignItems: "center",
  },
  workoutSection: {
    marginBottom: 20,
  },
  workoutSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  workoutSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mintIconWell,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  workoutInnerCard: {
    backgroundColor: colors.page,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 18,
    shadowColor: "#0F3D3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  workoutInnerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  workoutPlanTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 22,
  },
  workoutPlanMeta: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.inkMuted,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.progressFill,
  },
  exerciseList: {
    marginHorizontal: -4,
    marginBottom: 8,
  },
  exerciseRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  exerciseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EFF5F4",
  },
  exerciseRowInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  exerciseNameDone: {
    textDecorationLine: "line-through",
    color: colors.inkSoft,
  },
  exerciseDetail: {
    marginTop: 2,
    fontSize: 12,
    color: colors.inkSoft,
  },
  ctaButton: {
    alignSelf: "center",
    backgroundColor: colors.accentButton,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  weekCard: {
    backgroundColor: colors.cardMint,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    padding: 18,
  },
  weekEncouragement: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: colors.progressFill,
    lineHeight: 18,
  },
});
