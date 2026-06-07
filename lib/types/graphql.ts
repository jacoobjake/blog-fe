export type PaginatorInfo = {
  count: number;
  currentPage: number;
  firstItem: number;
  hasMorePages: boolean;
  lastItem: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type GraphqlResponseWithPaginatorInfo<T> = {
  data: T[];
  paginatorInfo: PaginatorInfo;
};
