import { Switch } from "@/components/ui/Switch";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Award,
  Bell,
  Calendar,
  ChevronRight,
  LogOut,
  Sliders,
  Target,
  User,
  UserCircle,
} from "lucide-react-native";

const colors = {
  ink: "#1A4D4E",
  inkMuted: "#3D6668",
  inkSoft: "#5C7A7C",
  page: "#FFFFFF",
  cardMint: "#F0F9F9",
  cardMintEdge: "rgba(26, 77, 78, 0.14)",
  mintIconWell: "#D8EFED",
  teal: "#0F766E",
  borderLight: "#E3EEED",
  signOut: "#DC2626",
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [googleConnected, setGoogleConnected] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const memberSinceLabel = useMemo(() => {
    const d = new Date(2026, 0, 1);
    return `Membro desde ${d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}`;
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.page }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: Math.max(insets.top, 12) + 8,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Cartão de perfil */}
      <View style={styles.profileHero}>
        <View style={styles.avatarRing}>
          <User size={32} color={colors.ink} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Alex Silva</Text>
          <Text style={styles.memberSince}>{memberSinceLabel}</Text>
          <View style={styles.streakPill}>
            <Award size={14} color={colors.page} strokeWidth={2} />
            <Text style={styles.streakText}>Sequência de 5 dias</Text>
          </View>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { marginRight: 8 }]}>
          <Text style={styles.statLabel}>Total de treinos</Text>
          <Text style={styles.statValue}>47</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Meta semanal</Text>
          <Text style={styles.statValue}>5</Text>
        </View>
      </View>

      {/* Google Agenda */}
      <View style={styles.googleCard}>
        <View style={styles.googleTop}>
          <View style={styles.googleIconWell}>
            <Calendar size={22} color={colors.teal} strokeWidth={2} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.googleTitle}>Google Agenda</Text>
            <Text style={styles.googleStatus}>
              {googleConnected ? "Conectado" : "Desconectado"}
            </Text>
          </View>
          <Pressable
            onPress={() => setGoogleConnected(!googleConnected)}
            style={({ pressed }) => [
              styles.disconnectBtn,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.disconnectBtnText}>
              {googleConnected ? "Desconectar" : "Conectar"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.googleDivider} />
        <Text style={styles.googleFoot}>
          Seus treinos são ajustados automaticamente com base nos eventos da agenda.
          Sincronizado pela última vez há 2 minutos.
        </Text>
      </View>

      {/* Configurações */}
      <Text style={styles.sectionTitle}>Configurações</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingIconWell}>
            <Bell size={20} color={colors.teal} strokeWidth={2} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Notificações</Text>
            <Text style={styles.settingSub}>Lembretes de treino</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingIconWell}>
            <Calendar size={20} color={colors.teal} strokeWidth={2} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Sincronização automática da agenda</Text>
            <Text style={styles.settingSub}>Sincronizar a cada 30 minutos</Text>
          </View>
          <Switch value={autoSync} onValueChange={setAutoSync} />
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingIconWell}>
            <Target size={20} color={colors.teal} strokeWidth={2} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Sugestões do Treinador IA</Text>
            <Text style={styles.settingSub}>Recomendações personalizadas</Text>
          </View>
          <Switch value={aiSuggestions} onValueChange={setAiSuggestions} />
        </View>
        <View style={styles.rowDivider} />
        <Pressable style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.75 }]}>
          <View style={styles.settingIconWell}>
            <Sliders size={20} color={colors.teal} strokeWidth={2} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Preferências de treino</Text>
          </View>
          <ChevronRight size={22} color={colors.teal} strokeWidth={2} />
        </Pressable>
        <View style={styles.rowDivider} />
        <Pressable style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.75 }]}>
          <View style={styles.settingIconWell}>
            <UserCircle size={20} color={colors.teal} strokeWidth={2} />
          </View>
          <View style={styles.settingTexts}>
            <Text style={styles.settingTitle}>Configurações da conta</Text>
          </View>
          <ChevronRight size={22} color={colors.teal} strokeWidth={2} />
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.85 }]}
        onPress={() => {}}
      >
        <LogOut size={20} color={colors.signOut} strokeWidth={2} />
        <Text style={[styles.signOutText, { marginLeft: 10 }]}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardMint,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    padding: 18,
    marginBottom: 16,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.mintIconWell,
    borderWidth: 2,
    borderColor: colors.cardMintEdge,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
  },
  memberSince: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
    color: colors.inkMuted,
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: colors.teal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.page,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.page,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#0F3D3D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.inkMuted,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.teal,
  },
  googleCard: {
    backgroundColor: colors.page,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    padding: 16,
    marginBottom: 24,
  },
  googleTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleIconWell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardMint,
    justifyContent: "center",
    alignItems: "center",
  },
  googleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  googleStatus: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: colors.inkMuted,
  },
  disconnectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: colors.page,
  },
  disconnectBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  googleDivider: {
    height: 1,
    backgroundColor: colors.teal,
    opacity: 0.25,
    marginVertical: 14,
  },
  googleFoot: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    color: colors.inkMuted,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: colors.page,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    overflow: "hidden",
    marginBottom: 18,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  settingIconWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardMint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTexts: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  settingSub: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: colors.teal,
    opacity: 0.9,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginLeft: 66,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardMintEdge,
    backgroundColor: colors.cardMint,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.signOut,
  },
});
