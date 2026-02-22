import { User } from "@/lib/types";

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

export type AuthActions = {
  setUser: (user: User) => void;
  clearUser: () => void;
};

export type AuthStore = AuthState & AuthActions;
