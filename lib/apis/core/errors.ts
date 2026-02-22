import type { ApiError } from "./types";

export function createApiError(
  message: string,
  status?: number,
  data?: unknown,
): ApiError {
  const err = new Error(message) as ApiError;
  err.status = status;
  err.data = data;
  return err;
}

export async function parseJsonSafe(
  res: Response,
): Promise<unknown | undefined> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return undefined;
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    const data = await parseJsonSafe(res);
    return data as T;
  }

  const data = await parseJsonSafe(res);
  const message =
    (data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as any).message === "string"
      ? (data as any).message
      : res.statusText) || "Request failed";

  throw createApiError(message, res.status, data);
}
