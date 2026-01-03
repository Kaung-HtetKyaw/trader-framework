import { useRouter } from 'next/navigation';
import { stringifyQs } from '@/lib/utils';

export interface PageInfo {
  prevCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor: string;
}

export interface Pagination<T = number> {
  pageSize?: T;
  search?: string;
  nextCursor?: string;
  prevCursor?: string;
}

export type PaginationState = Pagination<number>;

export function createCursorPaginationState(pageSize: number, queryString: Pagination): PaginationState {
  return queryString && (queryString.prevCursor || queryString.nextCursor)
    ? queryString.nextCursor
      ? {
          nextCursor: queryString.nextCursor,
          prevCursor: '',
          pageSize,
        }
      : {
          nextCursor: '',
          prevCursor: queryString.prevCursor,
          pageSize,
        }
    : {};
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
  pageSize: number;
};

export const getNewPageInfo = (pageInfo: PageInfo, paginationState: PaginationState) =>
  pageInfo
    ? {
        ...pageInfo,
        hasNextPage: !!paginationState.prevCursor || pageInfo.hasNextPage,
        hasPreviousPage: !!paginationState.prevCursor || pageInfo.hasPreviousPage,
      }
    : undefined;

export type PaginateFnParams = {
  pageInfo: PageInfo;
  paginationState: PaginationState;
  queryParams: Pagination;
};

const useCursorPaginator = () => {
  const router = useRouter();

  const navigateNextPage = (pageInfo: PageInfo, queryString: Pagination) => {
    const query = stringifyQs({
      ...queryString,
      nextCursor: pageInfo.nextCursor,
      prevCursor: undefined,
    });

    router.push(`?${query}`);
  };

  const naviagatePreviousPage = (pageInfo: PageInfo, queryString: Pagination) => {
    const query = stringifyQs({
      ...queryString,
      nextCursor: undefined,
      prevCursor: pageInfo.prevCursor,
    });
    router.push(`?${query}`);
  };

  const paginate = ({ pageInfo, paginationState, queryParams }: PaginateFnParams) => {
    const loadNextPage = () => navigateNextPage(pageInfo, queryParams);
    const loadPreviousPage = () => naviagatePreviousPage(pageInfo, queryParams);

    const newPageInfo = getNewPageInfo(pageInfo, paginationState);

    return {
      loadNextPage,
      loadPreviousPage,
      pageInfo: newPageInfo,
    };
  };

  return paginate;
};

export default useCursorPaginator;
