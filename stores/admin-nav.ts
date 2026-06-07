import { createStore } from "zustand";
import { AdminNavState, AdminNavStore } from "./types";

export const defaultInitState: AdminNavState = {
  isSideMenuOpen: true,
};

export const createAdminNavStore = (
  initState: AdminNavState = defaultInitState,
) => {
  return createStore<AdminNavStore>()((set) => ({
    ...initState,
    setIsSideMenuOpen: (isOpen: boolean) => {
      set({ isSideMenuOpen: isOpen });
    },
  }));
};
