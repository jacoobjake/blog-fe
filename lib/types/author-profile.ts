import type { UserSummary } from "./user";

export type AuthorProfile = {
  id: string;
  name: string;
  bio?: string | null;
  user?: UserSummary & { email?: string } | null;
};
