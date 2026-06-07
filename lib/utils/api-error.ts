import type { ApiError } from "@/lib/apis/core/types";

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("status" in error || "data" in error)
  );
}

/**
 * Extracts a human-friendly message from an unknown error thrown by our API layer.
 */
export function getErrorMessage(error: unknown, fallback = "Request failed") {
  if (isApiError(error)) {
    const data = error.data;
    const dataMessage =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : undefined;

    return dataMessage || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export function getErrorStatus(error: unknown, fallback = 400) {
  if (isApiError(error)) {
    return error.status || fallback;
  }

  return fallback;
}

export function formatError(error: unknown) {
  const message = getErrorMessage(error);
  const status = getErrorStatus(error);
  return { message, status };
}
