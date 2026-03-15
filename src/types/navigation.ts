import { NavigatorScreenParams } from "@react-navigation/native";

import { ToiletPoint } from "@/types/models";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  FiltersModal: undefined;
  FavorisSheet: undefined;
  Settings: undefined;
  Credits: undefined;
};

export type MainTabParamList = {
  Explorer: undefined;
  Favoris: undefined;
  Profile: undefined;
};

export interface ToiletSelectionPayload {
  toilet: ToiletPoint;
  open: boolean;
}
