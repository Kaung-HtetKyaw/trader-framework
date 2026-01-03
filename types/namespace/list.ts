import { PaginationParams } from '../list';

export type NamespaceListParams = PaginationParams & {
  label: string[] | undefined;
};

export type NamespaceListFilterParams = {
  label: string[];
  search?: string;
};

export type NamespaceListRequest = { clusterID: string };
