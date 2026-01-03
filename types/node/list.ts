import { PaginationParams } from '../list';

export type NodeListParams = PaginationParams & {
  cluster?: string;
};

export type NodeListFilterParams = {
  cluster?: string;
};

export type NodeListRequest = { clusterID: string };
