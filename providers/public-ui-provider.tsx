"use client";

import { ThemeState } from "@/stores/types";
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

export default function PublicUiProvider({
    children,
    initialThemeState,
}: {
    children: React.ReactNode;
    initialThemeState?: ThemeState;
}) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeContextProvider initialState={initialThemeState}>
                {children}
            </ThemeContextProvider>
        </QueryClientProvider>
    );
}
