export type BlogHeaderElementProps = {
  title: string;
  description?: string;
  author: string;
  is_published: boolean;
  tags: string[];
  created_at: Date | string;
  hero_asset_uuid?: string;
  hero_src?: string;
  hero_object_position?: string;
};
