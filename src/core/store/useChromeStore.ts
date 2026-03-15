import { create } from "zustand";

interface ChromeState {
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
}

export const useChromeStore = create<ChromeState>((set) => ({
  tabBarVisible: true,
  setTabBarVisible: (tabBarVisible) => set({ tabBarVisible })
}));
