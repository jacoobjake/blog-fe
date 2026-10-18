import type { AuthorProfile } from "@/lib/types";
import type { getServerApi } from "@/lib/apis/server";
import { getErrorStatus } from "@/lib/utils/api-error";

type ServerApi = Awaited<ReturnType<typeof getServerApi>>;

export async function getCurrentUserAuthorProfile(
  api: ServerApi,
): Promise<AuthorProfile | null> {
  try {
    return await api.authors.getMyAuthorProfile();
  } catch (error) {
    if (getErrorStatus(error) !== 404) {
      throw error;
    }

    return null;
  }
}
