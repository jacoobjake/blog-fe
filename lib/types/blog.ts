export type Blog = {
  slug: string;
  title: string;
  json_content: Array<any> | null;
  author: string;
  is_published: boolean;
  tags: { name: string }[];
  createdAt: Date;
  updatedAt: Date;
};
