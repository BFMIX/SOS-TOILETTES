import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconButton } from "@/components/common/IconButton";
import { AppMenuItem, AppMenuOverlay } from "@/components/navigation/AppMenuOverlay";
import { useAppShellStore } from "@/core/store/useAppShellStore";
import { RootStackParamList } from "@/types/navigation";
import { useAppTheme } from "@/theme/ThemeProvider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Credits">;

export const CreditsScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const menuOpen = useAppShellStore((state) => state.menuOpen);
  const openMenu = useAppShellStore((state) => state.openMenu);
  const closeMenu = useAppShellStore((state) => state.closeMenu);

  const handleSelect = (item: AppMenuItem) => {
    closeMenu();

    if (item === "Settings" || item === "Credits") {
      navigation.navigate(item);
      return;
    }

    navigation.navigate("MainTabs", { screen: item });
  };

  const handleOpenMenu = () => {
    navigation.navigate("MainTabs", { screen: "Explorer" });
    openMenu();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <IconButton icon="menu" onPress={handleOpenMenu} />
        </View>

        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
          ]}
        >
          {t("credits.title")}
        </Text>
        <Text
          style={[
            styles.body,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.family.medium
            }
          ]}
        >
          {[
            t("credits.intro"),
            "",
            `${t("credits.maps.title")} — ${t("credits.maps.body")}`,
            "",
            `${t("credits.openData.title")} — ${t("credits.openData.body")}`,
            "",
            `${t("credits.community.title")} — ${t("credits.community.body")}`
          ].join("\n")}
        </Text>

        <View style={styles.links}>
          {[
            {
              key: "paris",
              url: "https://opendata.paris.fr/explore/dataset/sanisettesparis"
            },
            {
              key: "idf",
              url: "https://data.iledefrance.fr/explore/dataset/toilettes-publiques-en-ile-de-france"
            },
            {
              key: "geopf",
              url: "https://geoservices.ign.fr/documentation/services/services-geoplateforme/geocodage"
            }
          ].map((item) => (
            <Pressable key={item.key} onPress={() => void Linking.openURL(item.url)}>
              <Text
                style={[
                  styles.link,
                  {
                    color: theme.colors.primary,
                    fontFamily: theme.typography.family.bold
                  }
                ]}
              >
                {t(`credits.links.${item.key}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <AppMenuOverlay
        activeItem="Credits"
        onClose={closeMenu}
        onSelect={handleSelect}
        visible={menuOpen}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  content: {
    gap: 16,
    paddingBottom: 48,
    paddingHorizontal: 20,
    paddingTop: 18
  },
  topBar: {
    alignItems: "flex-start"
  },
  title: {
    fontSize: 30,
    textTransform: "uppercase"
  },
  body: {
    fontSize: 14,
    lineHeight: 22
  },
  links: {
    gap: 10,
    marginTop: 20
  },
  link: {
    fontSize: 14
  }
});
