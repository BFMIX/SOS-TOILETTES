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
    loadToilets,
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
        await updateDoc(userRef, {
          firstName: tempName,
        });
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
          <Ionicons name={icon as any} size={30} color={color} />
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
              "&background=007AFF&color=fff",
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
    if (theme === "auto") return "Automatique (Système)";
    return theme === "dark" ? "Sombre" : "Clair";
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#F2F2F7" },
      ]}
      contentContainerStyle={styles.content}
    >
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={onSelectAvatar}
      />

      <Text style={[styles.header, { color: isDark ? "#FFF" : "#000" }]}>
        Paramètres
      </Text>

      {/* Profile Section */}
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
        ]}
      >
        <View style={styles.profileHeader}>
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
                    { color: isDark ? "#FFF" : "#000" },
                  ]}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  placeholder="Ton prénom"
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity onPress={handleSaveName}>
                  <Ionicons name="checkmark-circle" size={28} color="#34C759" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nameRow}
                onPress={() => setIsEditing(true)}
              >
                <Text
                  style={[styles.nameText, { color: isDark ? "#FFF" : "#000" }]}
                >
                  {user?.firstName || "Ajouter un prénom"}
                </Text>
                <Ionicons
                  name="pencil"
                  size={16}
                  color="#007AFF"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.xpText}>
              Local Guide • Niveau {user?.level || 1} • {user?.xp || 0} XP
            </Text>
          </View>
        </View>
      </View>

      {/* SEARCH SETTINGS SECTION */}
      <Text style={styles.sectionTitle}>PARAMÈTRES DE RECHERCHE</Text>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
        ]}
      >
        {/* Radius Selection */}
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#34C759" }]}>
              <Ionicons name="resize" size={18} color="#FFF" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={[
                  styles.settingText,
                  { color: isDark ? "#FFF" : "#000", marginLeft: 0 },
                ]}
              >
                Rayon de recherche
              </Text>
              <Text style={styles.valueText}>
                {showGlobal
                  ? "Désactivé (Mode Global)"
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
              <Ionicons name="globe" size={18} color="#FFF" />
            </View>
            <Text
              style={[styles.settingText, { color: isDark ? "#FFF" : "#000" }]}
            >
              Mode Global
            </Text>
          </View>
          <Switch
            value={showGlobal}
            onValueChange={setShowGlobal}
            trackColor={{ false: "#D1D1D6", true: "#34C759" }}
          />
        </View>
      </View>

      {/* App Settings */}
      <Text style={styles.sectionTitle}>APPLICATION</Text>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
        ]}
      >
        <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#AF52DE" }]}>
              <Ionicons name="moon" size={18} color="#FFF" />
            </View>
            <Text
              style={[styles.settingText, { color: isDark ? "#FFF" : "#000" }]}
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
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <View style={[styles.iconBox, { backgroundColor: "#FF9500" }]}>
              <Ionicons name="notifications" size={18} color="#FFF" />
            </View>
            <Text
              style={[styles.settingText, { color: isDark ? "#FFF" : "#000" }]}
            >
              Notifications
            </Text>
          </View>
          <Switch value={true} />
        </View>
      </View>

      {/* Sources & Credits */}
      <Text style={styles.sectionTitle}>SOURCES & CRÉDITS</Text>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
        ]}
      >
        <TouchableOpacity style={styles.settingRow}>
          <Text
            style={[styles.settingText, { color: isDark ? "#FFF" : "#000" }]}
          >
            Ville de Paris - Open Data
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.settingRow}>
          <Text
            style={[styles.settingText, { color: isDark ? "#FFF" : "#000" }]}
          >
            Île-de-France Mobilités
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.settingRow}>
          <Text
            style={[styles.settingText, { color: isDark ? "#FFF" : "#000" }]}
          >
            RATP - Sanitaires Réseau
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>
        SOS Toilettes v1.0.0 • Fait avec ❤️ à Paris
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
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
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E5EA",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    padding: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "600",
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    paddingVertical: 2,
    flex: 1,
    marginRight: 10,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xpText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: {
    fontSize: 17,
    marginLeft: 12,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 15,
    color: "#8E8E93",
    marginRight: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C6C6C8",
    marginLeft: 40,
  },
  radiusButtons: { flexDirection: "row", gap: 6 },
  radiusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  radiusBtnActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  radiusBtnText: { fontSize: 11, fontWeight: "600", color: "#1C1C1E" },
  radiusBtnTextActive: { color: "#FFF" },
  versionText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 10,
  },
});
