export enum BlogContentType {
  CompressedBase64 = "compressed_base64",
}

export type Blog = {
  slug: string;
  title: string;
  json_content: {
    type: BlogContentType;
    body: string;
  } | null;
  author: string;
  is_published: boolean;
  tags: { name: string }[];
  createdAt: Date;
  updatedAt: Date;
};
