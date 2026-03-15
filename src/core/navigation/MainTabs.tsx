import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useTranslation } from "react-i18next";

import { FavorisScreen } from "@/features/favoris/screens/FavorisScreen";
import { ExplorerScreen } from "@/features/explorer/screens/ExplorerScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { MainTabParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={() => null}>
      <Tab.Screen
        name="Explorer"
        component={ExplorerScreen}
        options={{ title: t("tabs.explorer") }}
      />
      <Tab.Screen
        name="Favoris"
        component={FavorisScreen}
        options={{ title: t("tabs.favoris") }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t("tabs.profile") }}
      />
    </Tab.Navigator>
  );
};
