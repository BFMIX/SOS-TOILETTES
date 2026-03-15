import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";
import { ToiletFilters } from "@/types/models";

const defaultFilters: ToiletFilters = {
  openOnly: false,
  freeOnly: false,
  accessibleOnly: false,
  babyChangeOnly: false,
  open24hOnly: false,
  parisOnly: false,
  indoorOnly: false,
  sanisetteOnly: false
};

interface FilterState extends ToiletFilters {
  setFilter: <K extends keyof ToiletFilters>(
    key: K,
    value: ToiletFilters[K]
  ) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...defaultFilters,
      setFilter: (key, value) => set({ [key]: value } as Partial<FilterState>),
      reset: () => set(defaultFilters)
    }),
    {
      name: STORAGE_KEYS.filters,
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
