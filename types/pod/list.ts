import { PaginationParams } from '../list';

export type PodListParams = PaginationParams & {
  namespace?: string[];
  cluster?: string;
};

export type PodListFilterParams = {
  search?: string;
  namespace?: string[];
};

export type PodListRequest = { clusterID: string; namespaces: string[] };
