import { PaginationParams } from '../list';

export type ContainerListParams = PaginationParams & {
  namespace?: string[];
  pod?: string[];
};

export type ContainerListFilterParams = {
  namespace?: string[];
  pod?: string[];
  search?: string;
};

export type ContainerListRequest = { clusterID: string; namespaces: string[]; podIDs: string[] };
