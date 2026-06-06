export enum AssetType {
  Image = "image",
}

export type Asset = {
  uuid: string;
  type: AssetType;
  media: {
    file_name: string;
    mime_type: string;
    url: string;
    thumbnail_100: string;
    thumbnail_200: string;
  };
  created_at: string;
  updated_at: string;
};
