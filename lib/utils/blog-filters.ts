export type BlogListFilters = {
  title?: string;
  author?: string;
  tags?: string[];
  is_published?: boolean;
};

export type BlogOrderByColumn =
  | "created_at"
  | "updated_at"
  | "title"
  | "author";

export type BlogOrderByClause = {
  column: BlogOrderByColumn;
  order: "ASC" | "DESC";
};

export function toLikePattern(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return `%${trimmed}%`;
}

export function parseTagsInput(value: string): string[] | undefined {
  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : undefined;
}

export function sortingStateToOrderBy(
  sorting: { id: string; desc: boolean }[],
): BlogOrderByClause[] | undefined {
  const first = sorting[0];
  if (!first) return undefined;

  const allowed: BlogOrderByColumn[] = [
    "created_at",
    "updated_at",
    "title",
    "author",
  ];

  if (!allowed.includes(first.id as BlogOrderByColumn)) {
    return undefined;
  }

  return [
    {
      column: first.id as BlogOrderByColumn,
      order: first.desc ? "DESC" : "ASC",
    },
  ];
}

export function orderByToGraphql(
  orderBy?: BlogOrderByClause[],
): { column: string; order: "ASC" | "DESC" }[] | undefined {
  if (!orderBy?.length) return undefined;

  return orderBy.map((clause) => ({
    column: clause.column.toUpperCase(),
    order: clause.order,
  }));
}
