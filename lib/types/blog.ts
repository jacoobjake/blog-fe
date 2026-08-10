import type { Asset } from "./asset";
import type { AuthorProfile } from "./author-profile";
import type { UserSummary } from "./user";

export enum BlogContentType {
  CompressedBase64 = "compressed_base64",
}

export type Blog = {
  slug: string;
  title: string;
  description?: string | null;
  json_content: {
    type: BlogContentType;
    body: string;
  } | null;
  hero_asset_uuid?: string | null;
  hero_asset?: Asset | null;
  author_profile: AuthorProfile;
  is_published: boolean;
  tags: { name: string }[];
  created_by?: UserSummary;
  updated_by?: UserSummary;
  created_at: string;
  updated_at: string;
};
