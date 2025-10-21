import type { PageInfo } from "../types/pagination";

/**
 * Calculate pagination information
 * @param totalCount Total number of items in the dataset
 * @param page Current page number (1-based)
 * @param pageSize Number of items per page
 * @returns PageInfo object with pagination details
 */
export function calculatePagination(totalCount: number, page: number = 1, pageSize: number = 10): PageInfo {
  // Ensure page is at least 1
  const currentPage = Math.max(1, page);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Calculate if there are next/previous pages
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Calculate cursor positions (using page numbers as cursors for simplicity)
  const startCursor = totalCount > 0 ? currentPage.toString() : null;
  const endCursor = totalCount > 0 ? currentPage.toString() : null;

  return {
    hasNextPage,
    hasPreviousPage,
    startCursor,
    endCursor,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
  };
}

/**
 * Calculate skip and take values for Prisma queries
 * @param page Current page number (1-based)
 * @param pageSize Number of items per page
 * @returns Object with skip and take values for Prisma
 */
export function calculatePrismaParams(page: number = 1, pageSize: number = 10) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * pageSize;
  const take = pageSize;

  return { skip, take };
}

/**
 * Create a paginated response
 * @param items Array of items for current page
 * @param totalCount Total number of items in the dataset
 * @param page Current page number
 * @param pageSize Number of items per page
 * @returns Connection object with items and pagination info
 */
export function createPaginatedResponse<T>(items: T[], totalCount: number, page: number = 1, pageSize: number = 10) {
  return {
    nodes: items,
    pageInfo: calculatePagination(totalCount, page, pageSize),
  };
}
