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
        { backgroundColor: isDark ? "#000" : "#F5F5FA" },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={onSelectAvatar}
      />

      <Text style={[styles.header, { color: isDark ? "#FFF" : "#1A1A2E" }]}>
        Profil
      </Text>

      {/* Profile Card */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
        ]}
      >
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
                  { color: isDark ? "#FFF" : "#1A1A2E" },
                ]}
                value={tempName}
                onChangeText={setTempName}
                autoFocus
                placeholder="Ton prénom"
                placeholderTextColor="#8E8E93"
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
                  { color: isDark ? "#FFF" : "#1A1A2E" },
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

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
          ]}
        >
          <Text style={[styles.statNumber, { color: ACCENT }]}>
            {user?.xp || 0}
          </Text>
          <Text style={styles.statLabel}>Points XP</Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
          ]}
        >
          <Text style={[styles.statNumber, { color: "#5856D6" }]}>
            {user?.reportsMade || 0}
          </Text>
          <Text style={styles.statLabel}>Signalements</Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
          ]}
        >
          <Text style={[styles.statNumber, { color: "#FF2D55" }]}>
            {user?.favorites?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
      </View>

      {/* Settings Section */}
      <Text style={styles.sectionTitle}>PARAMÈTRES</Text>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
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
                  { color: isDark ? "#FFF" : "#1A1A2E", marginLeft: 0 },
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
                { color: isDark ? "#FFF" : "#1A1A2E" },
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
                { color: isDark ? "#FFF" : "#1A1A2E" },
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
                { color: isDark ? "#FFF" : "#1A1A2E" },
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
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
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
                  { color: isDark ? "#FFF" : "#1A1A2E", marginLeft: 0 },
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
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E5E5EA",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: ACCENT,
    padding: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileInfo: { marginLeft: 16, flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  nameText: { fontSize: 22, fontWeight: "700" },
  nameInput: {
    fontSize: 20,
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
  levelText: { fontSize: 14, color: "#8E8E93", marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    fontWeight: "500",
  },
  section: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "600",
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
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: { fontSize: 16, marginLeft: 12, fontWeight: "500" },
  rowRight: { flexDirection: "row", alignItems: "center" },
  valueText: { fontSize: 14, color: "#8E8E93", marginRight: 6 },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C6C6C8",
    marginLeft: 42,
  },
  radiusButtons: { flexDirection: "row", gap: 6 },
  radiusBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  radiusBtnActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  radiusBtnText: { fontSize: 11, fontWeight: "700", color: "#1C1C1E" },
  radiusBtnTextActive: { color: "#FFF" },
  versionText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 20,
  },
});
