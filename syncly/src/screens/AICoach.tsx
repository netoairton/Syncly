import { useLocalSearchParams } from "expo-router";
import { Bot, Mic, Play, Send } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const colors = {
  ink: "#1A4D4E",
  inkMuted: "#3D6668",
  inkSoft: "#5C7A7C",
  teal: "#0F766E",
  page: "#FFFFFF",
  coachBubble: "#EEF2F2",
  borderHairline: "#E5E7EB",
  borderPill: "#D1D5DB",
  userBubble: "#0F766E",
  userBubbleText: "#FFFFFF",
};

type Role = "coach" | "user";

type Message = {
  id: string;
  role: Role;
  content: string;
  /** Bolha inicial do coach com UI de áudio simulada */
  showVoiceChrome?: boolean;
  at: Date;
};

const feelingLabels: Record<string, string> = {
  "low-energy": "Pouca energia",
  "high-energy": "Muita energia",
  pain: "Dor",
  great: "Ótimo",
};

const coachReply = "Obrigado! Vou ajustar o seu treino com base no que você contou.";

let messageId = 0;
function nextId() {
  messageId += 1;
  return `m-${messageId}`;
}

export default function AICoach() {
  const insets = useSafeAreaInsets();
  const { initialFeeling } = useLocalSearchParams<{ initialFeeling?: string }>();
  const handledFeeling = useRef(false);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: nextId(),
      role: "coach",
      content:
        "Oi! Eu sou seu treinador pessoal de IA. Diga-me como você está se sentindo hoje e eu ajudarei a personalizar seu treino.",
      showVoiceChrome: true,
      at: new Date(),
    },
  ]);

  const sendQuick = useCallback((value: string) => {
    const userMsg: Message = {
      id: nextId(),
      role: "user",
      content: value,
      at: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "coach",
          content: coachReply,
          at: new Date(),
        },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    if (handledFeeling.current || !initialFeeling) return;
    const label = feelingLabels[initialFeeling];
    if (!label) return;
    handledFeeling.current = true;
    sendQuick(label);
  }, [initialFeeling, sendQuick]);

  function formatTime(d: Date) {
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const quickOptions = [
    "Pouca energia",
    "Muita energia",
    "Dor nas costas",
    "Músculos doloridos",
  ];

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerIcon}>
          <Bot size={26} color={colors.page} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Treinador pessoal de IA</Text>
          <Text style={styles.headerSub}>Alimentado por IA avançada</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.messageBlock,
              m.role === "user" ? { alignItems: "flex-end" } : { alignItems: "flex-start" },
            ]}
          >
            <View
              style={[
                styles.bubble,
                m.role === "user" ? styles.bubbleUser : styles.bubbleCoach,
              ]}
            >
              {m.role === "coach" && m.showVoiceChrome && (
                <View style={styles.voiceRow}>
                  <Pressable style={styles.playBtn} hitSlop={8}>
                    <Play size={14} color={colors.page} fill={colors.page} />
                  </Pressable>
                  <View style={styles.waveTrack}>
                    <View style={styles.waveFill} />
                  </View>
                </View>
              )}
              <Text
                style={[
                  styles.bubbleText,
                  m.role === "user" && styles.bubbleTextUser,
                ]}
              >
                {m.content}
              </Text>
            </View>
            <Text
              style={[
                styles.timestamp,
                m.role === "user" && styles.timestampUser,
              ]}
            >
              {formatTime(m.at)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickSection}>
        <Text style={styles.quickLabel}>Respostas rápidas:</Text>
        <View style={styles.quickRow}>
          {quickOptions.map((label) => (
            <Pressable
              key={label}
              onPress={() => sendQuick(label)}
              style={({ pressed }) => [styles.quickPill, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.quickPillText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.voiceBar}>
        <Pressable style={({ pressed }) => [styles.micFab, pressed && { opacity: 0.9 }]} hitSlop={6}>
          <Mic size={26} color={colors.page} strokeWidth={2} />
        </Pressable>
        <Text style={styles.voiceHint}>Toque para enviar mensagem de voz</Text>
        <Pressable style={({ pressed }) => [styles.sendFab, pressed && { opacity: 0.85 }]} hitSlop={6}>
          <Send size={20} color={colors.teal} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.page,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderHairline,
    backgroundColor: colors.page,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.teal,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: colors.teal,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  messageBlock: {
    marginBottom: 18,
  },
  bubble: {
    maxWidth: "88%",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bubbleCoach: {
    backgroundColor: colors.coachBubble,
    borderTopLeftRadius: 6,
  },
  bubbleUser: {
    backgroundColor: colors.userBubble,
    borderTopRightRadius: 6,
  },
  voiceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.teal,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  waveTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    overflow: "hidden",
  },
  waveFill: {
    width: "35%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.inkSoft,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: colors.ink,
  },
  bubbleTextUser: {
    color: colors.userBubbleText,
  },
  timestamp: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "500",
    color: colors.teal,
    opacity: 0.85,
    paddingHorizontal: 4,
  },
  timestampUser: {
    color: colors.inkSoft,
    alignSelf: "flex-end",
  },
  quickSection: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
    backgroundColor: colors.page,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.teal,
    marginBottom: 10,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  quickPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: colors.page,
    borderWidth: 1,
    borderColor: colors.borderPill,
    margin: 4,
  },
  quickPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.teal,
  },
  voiceBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderHairline,
    backgroundColor: colors.page,
  },
  micFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.teal,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceHint: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: colors.teal,
    paddingHorizontal: 8,
  },
  sendFab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.page,
    borderWidth: 1,
    borderColor: colors.borderPill,
    justifyContent: "center",
    alignItems: "center",
  },
});
