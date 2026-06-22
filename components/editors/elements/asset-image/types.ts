export type AssetImageAlignment = "left" | "center" | "right";

export type AssetImageWidth = "full" | "large" | "medium" | "small";

export type AssetImageElementProps = {
  assetUuid?: string;
  url?: string;
  alt?: string;
  width?: AssetImageWidth;
  alignment?: AssetImageAlignment;
};
