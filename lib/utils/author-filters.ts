export type AuthorListFilters = {
  name?: string;
};

export type AuthorOrderByColumn = "name" | "created_at";

export type AuthorOrderByClause = {
  column: AuthorOrderByColumn;
  order: "ASC" | "DESC";
};

export function toLikePattern(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return `%${trimmed}%`;
}

export function sortingStateToAuthorOrderBy(
  sorting: { id: string; desc: boolean }[],
): AuthorOrderByClause[] | undefined {
  const first = sorting[0];
  if (!first) return undefined;

  const allowed: AuthorOrderByColumn[] = ["name", "created_at"];

  if (!allowed.includes(first.id as AuthorOrderByColumn)) {
    return undefined;
  }

  return [
    {
      column: first.id as AuthorOrderByColumn,
      order: first.desc ? "DESC" : "ASC",
    },
  ];
}

export function authorOrderByToGraphql(
  orderBy?: AuthorOrderByClause[],
): { column: string; order: "ASC" | "DESC" }[] | undefined {
  if (!orderBy?.length) return undefined;

  return orderBy.map((clause) => ({
    column: clause.column.toUpperCase(),
    order: clause.order,
  }));
}
