import { create } from "zustand";

interface AppShellState {
  menuOpen: boolean;
  pendingToiletId: string | null;
  openMenu: () => void;
  closeMenu: () => void;
  requestToiletDetails: (toiletId: string) => void;
  clearPendingToiletDetails: () => void;
}

export const useAppShellStore = create<AppShellState>((set) => ({
  menuOpen: false,
  pendingToiletId: null,
  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
  requestToiletDetails: (toiletId) => set({ pendingToiletId: toiletId }),
  clearPendingToiletDetails: () => set({ pendingToiletId: null })
}));
