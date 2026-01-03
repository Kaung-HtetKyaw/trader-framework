import { useRouter } from 'next/navigation';
import { stringifyQs } from '@/lib/utils';
import { omit } from 'lodash/fp';
import config from '../config';

/**
 * TODO: This interface is not in sync with the backend yet. Need to update the types to match the backend.
 * @description This interface is used to represent the page information that is returned from the API
 * @param currentPage - The current page number
 * @param lastPage - The last page number
 * @param total - The total number of items
 */
export interface PageInfo {
  currentPage: number;
  limit: number;
  total: number;
}

export interface Pagination<T = number> {
  limit?: T;
  page?: T;
  search?: string;
}

export type PaginationState = Pagination<number>;

export function createPaginationState(limit: number, query: Pagination): PaginationState {
  return query
    ? {
        page: query?.page || limit,
        limit: query?.limit || limit,
      }
    : { page: 1, limit: config.NEXT_PUBLIC_DEFAULT_PAGE_SIZE };
}

export type PagePaginationInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  total: number;
  totalPages: number;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  currentPageItemCount: number;
  limit: number;
};

export const getNewPageInfo = (pageInfo: PageInfo | undefined, paginationState: Pagination): PagePaginationInfo => {
  if (!pageInfo) {
    return {
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: 0,
      previousPage: 0,
      currentPageItemCount: 0,
      currentPage: 1,
      total: 0,
      totalPages: 0,
      limit: config.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
      lastPage: 1,
    };
  }

  const limit = paginationState.limit || config.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;
  const totalPages = Math.ceil(pageInfo.total / limit);
  const previousPage = pageInfo.currentPage - 1 || 1;
  const nextPage = pageInfo.currentPage + 1 > totalPages ? pageInfo.currentPage : pageInfo.currentPage + 1;
  const currentPageItemCount = limit * pageInfo.currentPage;

  const lastPage = Math.ceil(pageInfo.total / limit);

  return {
    hasNextPage: pageInfo.currentPage !== lastPage && pageInfo.currentPage !== nextPage,
    hasPreviousPage: pageInfo.currentPage !== previousPage,
    nextPage,
    previousPage,
    currentPageItemCount,
    currentPage: pageInfo.currentPage,
    total: pageInfo.total,
    totalPages,
    limit,
    lastPage,
  };
};

export type PaginateFnParams = {
  pageInfo: PageInfo | undefined;
  paginationState: PaginationState;
  queryParams?: Pagination;
  shouldResetPageOnSearch: boolean;
};

/**
 * TODO: Currently, the type system is not in sync with the backend yet. Need to update the types to match the backend.
 * @description This hook is used to paginate the data
 * and persist the pagination state in the url to persist
 * the pagination state when the page is refreshed
 *
 * @returns A paginate function that provides pagination functionality
 *
 * The hook provides the following features:
 * - URL-based pagination state persistence
 * - Navigation between pages
 * - Pagination information calculation
 * - Search parameter handling with optional page reset
 *
 * @example
 * ```tsx
 * const paginate = usePaginator();
 *
 * // In your component:
 * const { loadNextPage, loadPreviousPage, loadPage, searchPage, pageInfo } = paginate({
 *   pageInfo: {        // Current page information
 *     currentPage: 1,
 *     limit: 10,
 *     total: 100
 *   },
 *   paginationState: { // Current pagination state
 *     page: 1,
 *     limit: 10
 *   },
 *   queryParams: {     // Optional query parameters
 *     page: 1,
 *     limit: 10,
 *     search: 'query'
 *   },
 *   shouldResetPageOnSearch: true  // Whether to reset to page 1 on search
 * });
 *
 * // Navigate to next/previous pages
 * loadNextPage();
 * loadPreviousPage();
 *
 * // Navigate to a specific page
 * loadPage(5);
 *
 * // Perform search with optional page reset
 * searchPage('search term');
 *
 * // Access pagination information
 * const {
 *   hasNextPage,
 *   hasPreviousPage,
 *   currentPage,
 *   total,
 *   totalPages,
 *   nextPage,
 *   previousPage,
 *   currentPageItemCount,
 *   limit,
 *   lastPage
 * } = pageInfo;
 * ```
 *
 * @param params - Object containing pagination parameters:
 *   - pageInfo: Current page information containing:
 *     - currentPage: Current page number
 *     - limit: Items per page
 *     - total: Total number of items
 *   - paginationState: Current pagination state containing:
 *     - page: Current page number
 *     - limit: Items per page
 *   - queryParams: Optional query parameters including:
 *     - page: Page number
 *     - limit: Items per page
 *     - search: Search query string
 *   - shouldResetPageOnSearch: Whether to reset to page 1 when searching
 */
const usePaginator = () => {
  const router = useRouter();

  const navigateToNewPage = (pageInfo: PageInfo | undefined, queryParams: Pagination, newPage?: number) => {
    if (!pageInfo) return;

    const query = stringifyQs({
      ...omit(['limit'], queryParams),
      page: newPage || queryParams.page || 1,
    });

    router.push(`?${query}`);
  };

  const paginate = ({ pageInfo, paginationState, queryParams, shouldResetPageOnSearch }: PaginateFnParams) => {
    const loadNextPage = () => {
      if (!pageInfo || !queryParams) return;

      if (
        pageInfo.currentPage >=
        Math.ceil(pageInfo.total / (paginationState.limit || config.NEXT_PUBLIC_DEFAULT_PAGE_SIZE))
      )
        return;

      navigateToNewPage(pageInfo, queryParams, pageInfo.currentPage + 1);
    };

    const loadPreviousPage = () => {
      if (!pageInfo || !queryParams) return;

      if (pageInfo.currentPage <= 1) return;

      navigateToNewPage(pageInfo, queryParams, pageInfo.currentPage - 1);
    };

    const loadPage = (page: number) => {
      if (!pageInfo || !queryParams) return;

      if (page <= 1) return;

      if (page > Math.ceil(pageInfo.total / (paginationState.limit || config.NEXT_PUBLIC_DEFAULT_PAGE_SIZE))) return;

      navigateToNewPage(pageInfo, queryParams, page);
    };

    const searchPage = (searchString: string) => {
      const query = shouldResetPageOnSearch
        ? {
            ...omit(['limit'], queryParams),
            page: 1,
            search: searchString,
          }
        : {
            ...omit(['limit'], queryParams),
            search: searchString,
          };

      const queryString = stringifyQs(query);

      return router.push(`?${queryString}`);
    };

    const newPageInfo = getNewPageInfo(pageInfo, paginationState);

    return {
      loadNextPage,
      loadPreviousPage,
      loadPage,
      searchPage,
      pageInfo: newPageInfo,
    };
  };

  return paginate;
};

export default usePaginator;
