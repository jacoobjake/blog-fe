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
  created_at: string;
  updated_at: string;
};
