export enum AssetType {
  Image = "image",
}

export type AssetMedia = {
  file_name: string;
  mime_type: string;
  url: string;
  thumbnail_100: string;
  thumbnail_200: string;
};

export type Asset = {
  uuid: string;
  type: AssetType;
  media: AssetMedia | null;
};
