export type BlogHeaderElementProps = {
  title: string;
  description?: string;
  author: string;
  is_published: boolean;
  tags: string[]; 
  created_at: Date;
};
