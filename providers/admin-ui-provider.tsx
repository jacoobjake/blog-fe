"use client";

import { AdminNavContextProvider } from "./admin-nav-provider";
import { AuthContextProvider } from "./auth-provider";
import { AdminNavState, AuthState, ThemeState } from "@/stores/types";
import { ThemeContextProvider } from "./theme-provider";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function AdminUiProvider({
  children,
  initialNavState,
  initialAuthState,
  initialThemeState,
}: {
  children: React.ReactNode;
  initialNavState?: AdminNavState;
  initialAuthState?: AuthState;
  initialThemeState?: ThemeState;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider initialState={initialAuthState}>
        <ThemeContextProvider initialState={initialThemeState}>
          <AdminNavContextProvider initialState={initialNavState}>
            {children}
          </AdminNavContextProvider>
        </ThemeContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
