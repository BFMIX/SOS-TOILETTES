import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Alert,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../store/useStore";
import { db } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import AvatarPicker from "../components/Shared/AvatarPicker";

const ACCENT = "#13e5ec";

export default function SettingsScreen() {
  const {
    user,
    updateProfile,
    theme,
    setTheme,
    searchRadius,
    setSearchRadius,
    showGlobal,
    setShowGlobal,
  } = useStore();
  const systemColorScheme = useColorScheme();
  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";

  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [tempName, setTempName] = useState(user?.firstName || "");

  const handleSaveName = async () => {
    if (!user?.uid) return;
    try {
      if (db) {
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, { firstName: tempName });
      }
      updateProfile({ firstName: tempName });
      setIsEditing(false);
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de mettre à jour le nom.");
    }
  };

  const onSelectAvatar = async (avatarUrl: string) => {
    if (!user?.uid) return;
    try {
      if (db) {
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, { profileImage: avatarUrl });
      }
      updateProfile({ profileImage: avatarUrl });
      setShowAvatarPicker(false);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de changer l'avatar.");
    }
  };

  const renderAvatar = () => {
    if (user?.profileImage?.startsWith("ICON:")) {
      const [_, icon, color] = user.profileImage.split(":");
      return (
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: color + "20",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Ionicons name={icon as any} size={36} color={color} />
        </View>
      );
    }
    return (
      <Image
        source={{
          uri:
            user?.profileImage ||
            "https://ui-avatars.com/api/?name=" +
              (user?.firstName || "User") +
              "&background=13e5ec&color=fff&bold=true",
        }}
        style={styles.avatar}
      />
    );
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("auto");
    else setTheme("light");
  };

  const getThemeLabel = () => {
    if (theme === "auto") return "Auto";
    return theme === "dark" ? "Sombre" : "Clair";
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#102122" : "#f6f8f8" },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={onSelectAvatar}
      />

      <Text style={[styles.header, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
        Profil
      </Text>

      {/* Super Profile Card */}
      <View
        style={[
          styles.superProfileCard,
          { backgroundColor: isDark ? "#0f172a" : "#FFF" },
        ]}
      >
        <View style={styles.profileHeaderContent}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setShowAvatarPicker(true)}
          >
            {renderAvatar()}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[
                    styles.nameInput,
                    { color: isDark ? "#f1f5f9" : "#0f172a" },
                  ]}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  placeholder="Ton prénom"
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity onPress={handleSaveName}>
                  <Ionicons name="checkmark-circle" size={28} color={ACCENT} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nameRow}
                onPress={() => setIsEditing(true)}
              >
                <Text
                  style={[
                    styles.nameText,
                    { color: isDark ? "#f1f5f9" : "#0f172a" },
                  ]}
                >
                  Bonjour, {user?.firstName || "Utilisateur"}
                </Text>
                <Ionicons
                  name="pencil"
                  size={14}
                  color={ACCENT}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.levelText}>
              Local Guide • Niveau {user?.level || 1}
            </Text>
          </View>
        </View>

        <View style={styles.superStatsSeparator} />

        <View style={styles.superStatsRow}>
          <View style={styles.superStatItem}>
            <Text style={[styles.superStatNumber, { color: ACCENT }]}>
              {user?.xp || 0}
            </Text>
            <Text style={styles.superStatLabel}>Points XP</Text>
          </View>
          <View style={styles.superStatItem}>
            <Text style={[styles.superStatNumber, { color: "#5856D6" }]}>
              {user?.reportsMade || 0}
            </Text>
            <Text style={styles.superStatLabel}>Signalements</Text>
          </View>
          <View style={styles.superStatItem}>
            <Text style={[styles.superStatNumber, { color: "#FF2D55" }]}>
              {user?.favorites?.length || 0}
            </Text>
            <Text style={styles.superStatLabel}>Favoris</Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <Text style={styles.sectionTitle}>PARAMÈTRES</Text>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#0f172a" : "#FFF" },
        ]}
      >
        {/* Radius */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#34C759" }]}>
              <Ionicons name="resize" size={16} color="#FFF" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={[
                  styles.settingText,
                  { color: isDark ? "#f1f5f9" : "#0f172a", marginLeft: 0 },
                ]}
              >
                Rayon de recherche
              </Text>
              <Text style={styles.valueText}>
                {showGlobal
                  ? "Désactivé (Global)"
                  : `${searchRadius / 1000} km`}
              </Text>
            </View>
          </View>
          <View style={styles.radiusButtons}>
            {[1, 5, 10, 30].map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setSearchRadius(r * 1000)}
                disabled={showGlobal}
                style={[
                  styles.radiusBtn,
                  searchRadius === r * 1000 &&
                    !showGlobal &&
                    styles.radiusBtnActive,
                  showGlobal && { opacity: 0.3 },
                ]}
              >
                <Text
                  style={[
                    styles.radiusBtnText,
                    searchRadius === r * 1000 &&
                      !showGlobal &&
                      styles.radiusBtnTextActive,
                  ]}
                >
                  {r}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.separator} />

        {/* Global Toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#5856D6" }]}>
              <Ionicons name="globe" size={16} color="#FFF" />
            </View>
            <Text
              style={[
                styles.settingText,
                { color: isDark ? "#f1f5f9" : "#0f172a" },
              ]}
            >
              Mode Global
            </Text>
          </View>
          <Switch
            value={showGlobal}
            onValueChange={setShowGlobal}
            trackColor={{ false: "#D1D1D6", true: ACCENT }}
          />
        </View>

        <View style={styles.separator} />

        {/* Theme */}
        <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#AF52DE" }]}>
              <Ionicons name="moon" size={16} color="#FFF" />
            </View>
            <Text
              style={[
                styles.settingText,
                { color: isDark ? "#f1f5f9" : "#0f172a" },
              ]}
            >
              Thème
            </Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.valueText}>{getThemeLabel()}</Text>
            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Notifications */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#FF9500" }]}>
              <Ionicons name="notifications" size={16} color="#FFF" />
            </View>
            <Text
              style={[
                styles.settingText,
                { color: isDark ? "#f1f5f9" : "#0f172a" },
              ]}
            >
              Notifications
            </Text>
          </View>
          <Switch
            value={true}
            trackColor={{ false: "#D1D1D6", true: ACCENT }}
          />
        </View>
      </View>

      {/* Sources */}
      <Text style={styles.sectionTitle}>INFORMATIONS</Text>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#0f172a" : "#FFF" },
        ]}
      >
        {[
          "Ville de Paris - Open Data",
          "Île-de-France Mobilités",
          "RATP - Sanitaires Réseau",
        ].map((source, i, arr) => (
          <React.Fragment key={source}>
            <TouchableOpacity style={styles.settingRow}>
              <Text
                style={[
                  styles.settingText,
                  { color: isDark ? "#f1f5f9" : "#0f172a", marginLeft: 0 },
                ]}
              >
                {source}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>

      <Text style={styles.versionText}>
        SOS Toilettes v1.0.0 • Fait avec ❤️ à Paris
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    fontSize: 28,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  superProfileCard: {
    padding: 24,
    borderRadius: 32,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  profileHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#e2e8f0",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: ACCENT,
    padding: 6,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileInfo: { marginLeft: 16, flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  nameText: {
    fontSize: 20,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
  },
  nameInput: {
    fontSize: 18,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: ACCENT,
    paddingVertical: 2,
    flex: 1,
    marginRight: 10,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelText: {
    fontSize: 13,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    marginTop: 4,
  },
  superStatsSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    marginBottom: 20,
  },
  superStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  superStatItem: {
    alignItems: "center",
    flex: 1,
  },
  superStatNumber: {
    fontSize: 22,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "800",
  },
  superStatLabel: {
    fontSize: 11,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    marginTop: 4,
    fontWeight: "600",
  },
  section: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLabel: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    fontSize: 15,
    fontFamily: "Plus Jakarta Sans",
    marginLeft: 12,
    fontWeight: "600",
  },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  valueText: {
    fontSize: 13,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginLeft: 44,
  },
  radiusButtons: { flexDirection: "row", gap: 6 },
  radiusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  radiusBtnActive: {
    backgroundColor: "rgba(19, 229, 236, 0.15)",
    borderColor: "rgba(19, 229, 236, 0.3)",
  },
  radiusBtnText: {
    fontSize: 12,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    color: "#0f172a",
  },
  radiusBtnTextActive: { color: ACCENT },
  versionText: {
    textAlign: "center",
    color: "#94a3b8",
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
});
