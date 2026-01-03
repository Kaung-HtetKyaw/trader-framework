import { ClusterStatusEnum } from './index';
import { PaginationParams } from '../list';

export type ClusterListParams = PaginationParams & {
  group: string[] | undefined;
  status: string[] | undefined;
};

export type ClusterListFilterParams = {
  group: string[];
  status: ClusterStatusEnum[];
};

export type ClusterKeyListParams = PaginationParams & {
  search: string;
};
