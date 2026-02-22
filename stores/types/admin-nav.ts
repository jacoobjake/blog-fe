export type AdminNavState = {
  isSideMenuOpen: boolean;
};

export type AdminNavActions = {
  setIsSideMenuOpen: (isOpen: boolean) => void;
};

export type AdminNavStore = AdminNavState & AdminNavActions;
