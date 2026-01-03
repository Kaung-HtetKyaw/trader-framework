import { Pagination } from '@/lib/hooks/useCursorPaginator';
import { K8sContextObject } from '.';
import { PaginationContext } from '../pagination';

export type VisualizationListFilterParams = {
  group?: string[];
  cluster?: string[];
  kind?: string[];
  excludedKind?: string[];
  namespace?: string[];
  excludedNamespace?: string[];
  clusterWideObject?: string[];
  excludedClusterWideObject?: string[];
  allNamespaces?: boolean;
  allClusterWideObjects?: boolean;
  allKinds?: boolean;
} & Pagination;

export type ListObjectFilterContext = {
  filter?: ListObjectFilters;
  fields?: ListObjectSelectionField[];
  pagination?: PaginationContext;
};

export type ListObjectFilters = {
  clusterID?: string;
  namespaced?: boolean;
  namespace?: string;
  kind?: string;
};

export type ListObjectSelectionField = keyof K8sContextObject | 'createdAt' | 'clusterID';
