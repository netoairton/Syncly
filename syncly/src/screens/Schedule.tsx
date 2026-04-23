import {
  mockGoogleCalendar,
  type ScheduleExercise,
  type TrainingScheduleItem,
} from "@/services/mockApis";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Calendar, Clock, RotateCcw, X } from "lucide-react-native";

const colors = {
  ink: "#1A4D4E",
  inkMuted: "#3D6668",
  inkSoft: "#5C7A7C",
  page: "#FAFBFB",
  cardMint: "#F0F9F9",
  cardMintEdge: "rgba(26, 77, 78, 0.12)",
  mintIconWell: "#E8F6F6",
  white: "#FFFFFF",
  borderLight: "#E3EEED",
  badgeTeal: "#0F766E",
  badgeMutedBg: "#EEF2F2",
  badgeMutedText: "#374151",
};

const MONTHS_SHORT = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "mai.",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
];

const WEEKDAYS_SHORT = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatSectionLabel(sectionDate: Date, today: Date): string {
  const day = sectionDate.getDate();
  const mon = MONTHS_SHORT[sectionDate.getMonth()];
  if (isSameDay(sectionDate, today)) {
    return `Hoje, ${day} de ${mon}`;
  }
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(sectionDate, tomorrow)) {
    return `Amanhã, ${day} de ${mon}`;
  }
  const wd = WEEKDAYS_SHORT[sectionDate.getDay()];
  const wdCap = wd.charAt(0).toUpperCase() + wd.slice(1);
  return `${wdCap} ${day} de ${mon}`;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatExerciseLine(ex: ScheduleExercise) {
  if (ex.unit === "sec") {
    return `${ex.sets} séries × ${ex.reps} s`;
  }
  return `${ex.sets} séries × ${ex.reps} repetições`;
}

function groupScheduleByDay(items: TrainingScheduleItem[]) {
  const map = new Map<string, TrainingScheduleItem[]>();
  for (const it of items) {
    const k = dateKey(it.start);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.start.getTime() - b.start.getTime());
  }
  const keys = Array.from(map.keys()).sort();
  return keys.map((k) => {
    const list = map.get(k)!;
    return { key: k, sectionDate: startOfDay(list[0].start), items: list };
  });
}

export default function Schedule() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<TrainingScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<TrainingScheduleItem | null>(null);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const data = await mockGoogleCalendar.getTrainingSchedule();
      setItems(data);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const sections = useMemo(() => groupScheduleByDay(items), [items]);

  const onSyncNow = async () => {
    setSyncing(true);
    try {
      await load({ silent: true });
    } finally {
      setSyncing(false);
    }
  };

  const closeModal = () => setSelectedWorkout(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.page }}>
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.page }}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 12) + 8,
        paddingHorizontal: 20,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Agenda de treinos</Text>
      <Text style={styles.screenSubtitle}>
        Seus treinos são ajustados automaticamente com base no seu Google Agenda
      </Text>

      <View style={styles.syncCard}>
        <View style={styles.syncIconWell}>
          <Calendar size={22} color={colors.ink} strokeWidth={2} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.syncTitle}>Google Agenda</Text>
          <Text style={styles.syncSub}>Conectado e sincronizado</Text>
        </View>
        <Pressable
          onPress={onSyncNow}
          disabled={syncing}
          style={({ pressed }) => [
            styles.syncButton,
            (pressed || syncing) && { opacity: 0.75 },
          ]}
        >
          {syncing ? (
            <ActivityIndicator size="small" color={colors.ink} />
          ) : (
            <>
              <RotateCcw size={16} color={colors.ink} strokeWidth={2} />
              <Text style={styles.syncButtonText}>Sincronizar agora</Text>
            </>
          )}
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.badgeTeal} />
          <Text style={styles.loadingText}>Carregando a agenda…</Text>
        </View>
      ) : (
        sections.map((section) => (
          <View key={section.key} style={{ marginBottom: 8 }}>
            <Text style={styles.sectionHeading}>
              {formatSectionLabel(section.sectionDate, today)}
            </Text>
            {section.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedWorkout(item)}
                style={({ pressed }) => [styles.workoutCard, pressed && { opacity: 0.92 }]}
              >
                <View style={styles.workoutTopRow}>
                  <View style={styles.timeRow}>
                    <Clock size={18} color={colors.inkMuted} strokeWidth={2} />
                    <Text style={styles.timeText}>{formatTime(item.start)}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "in_progress" ? styles.badgeActive : styles.badgeIdle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === "in_progress" && styles.statusBadgeTextOn,
                      ]}
                    >
                      {item.status === "in_progress" ? "Em andamento" : "Agendado"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.workoutTitle}>{item.title}</Text>
                <Text style={styles.durationText}>{item.durationMin} min</Text>
                <View style={styles.cardFooter}>
                  <Calendar size={14} color={colors.inkSoft} strokeWidth={2} />
                  <Text style={styles.footerText}>Sincronizado: {item.syncNote}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))
      )}
    </ScrollView>

    <Modal
      visible={selectedWorkout !== null}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalRoot}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
        <View
          style={[styles.modalCenter, { paddingBottom: Math.max(insets.bottom, 16) }]}
          pointerEvents="box-none"
        >
          <View style={styles.modalCard} pointerEvents="auto">
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.modalTitle}>{selectedWorkout?.title}</Text>
                <Text style={styles.modalMeta}>
                  {selectedWorkout
                    ? `${formatTime(selectedWorkout.start)} · ${selectedWorkout.durationMin} min`
                    : ""}
                </Text>
              </View>
              <Pressable
                onPress={closeModal}
                hitSlop={12}
                style={({ pressed }) => [styles.modalClose, pressed && { opacity: 0.7 }]}
              >
                <X size={22} color={colors.ink} strokeWidth={2} />
              </Pressable>
            </View>
            <Text style={styles.modalSectionLabel}>Exercícios</Text>
            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {selectedWorkout?.exercises?.length ? (
                selectedWorkout.exercises.map((ex, idx) => (
                  <View
                    key={`${ex.name}-${idx}`}
                    style={[
                      styles.exerciseRow,
                      idx < selectedWorkout.exercises.length - 1 && styles.exerciseRowBorder,
                    ]}
                  >
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseDetail}>{formatExerciseLine(ex)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.modalEmpty}>Sem exercícios listados.</Text>
              )}
            </ScrollView>
            <Pressable
              onPress={closeModal}
              style={({ pressed }) => [styles.modalBtn, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.modalBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
    marginBottom: 22,
    paddingRight: 8,
  },
  syncCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardMint,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 26,
  },
  syncIconWell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mintIconWell,
    justifyContent: "center",
    alignItems: "center",
  },
  syncTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  syncSub: {
    marginTop: 4,
    fontSize: 12,
    color: colors.inkSoft,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 40,
  },
  syncButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.badgeTeal,
    marginBottom: 12,
    marginTop: 4,
  },
  workoutCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0F3D3D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  workoutTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: colors.inkMuted,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: colors.badgeTeal,
  },
  badgeIdle: {
    backgroundColor: colors.badgeMutedBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.badgeMutedText,
  },
  statusBadgeTextOn: {
    color: colors.white,
  },
  workoutTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: colors.inkSoft,
    fontWeight: "500",
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.inkSoft,
    fontWeight: "500",
  },
  loadingBox: {
    paddingVertical: 48,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.inkSoft,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "rgba(15, 61, 61, 0.45)",
  },
  modalCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "78%",
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    lineHeight: 24,
  },
  modalMeta: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: colors.inkSoft,
  },
  modalClose: {
    padding: 4,
    borderRadius: 8,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.badgeTeal,
    marginBottom: 10,
  },
  modalList: {
    maxHeight: 320,
    marginBottom: 16,
  },
  exerciseRow: {
    paddingVertical: 12,
  },
  exerciseRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  exerciseDetail: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
    color: colors.inkSoft,
  },
  modalEmpty: {
    fontSize: 14,
    color: colors.inkSoft,
    paddingVertical: 12,
  },
  modalBtn: {
    backgroundColor: colors.badgeTeal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
