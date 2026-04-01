"use client";

import { useCallback } from "react";
import { useAuthStore } from "./useAuthStore";
import { type LoginDto } from "@/lib/schemas";
import { authApi } from "@/lib/apis";

export const useAuth = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const check = useCallback(async () => {
    try {
      const user = await authApi.me();
      setUser(user);
      return true;
    } catch {
      clearUser();
      return false;
    }
  }, [setUser, clearUser]);

  const login = useCallback(
    async (dto: LoginDto) => {
      await authApi.login(dto);
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    clearUser();
  }, [clearUser]);

  return { user, login, logout, check, isAuthenticated };
};
