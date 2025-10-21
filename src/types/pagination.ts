export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

// Generic Connection type
export type Connection<T> = {
  nodes: T[];
  pageInfo: PageInfo;
};
