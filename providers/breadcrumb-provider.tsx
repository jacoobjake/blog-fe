"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BreadcrumbContextValue = {
  pageLabel: string | null;
  setPageLabel: (label: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [pageLabel, setPageLabelState] = useState<string | null>(null);
  const setPageLabel = useCallback((label: string | null) => {
    setPageLabelState(label);
  }, []);

  const value = useMemo(
    () => ({ pageLabel, setPageLabel }),
    [pageLabel, setPageLabel],
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbContext must be used within BreadcrumbProvider");
  }
  return context;
}
