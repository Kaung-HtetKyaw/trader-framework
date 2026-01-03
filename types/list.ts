import { SortingState } from '@tanstack/react-table';
import { PaginationContext } from './pagination';

export enum ListViews {
  ENTITY_WITH_NAME_LIST = 'ENTITY_WITH_NAME_LIST',
  CLUSTER_LIST = 'CLUSTER_LIST',
  NAMESPACE_LIST = 'NAMESPACE_LIST',
  POD_LIST = 'POD_LIST',
  NODE_LIST = 'NODE_LIST',
  API_KEYS_LIST = 'API_KEYS_LIST',
  ORGANIZATION_MEMBER_LIST = 'ORGANIZATION_MEMBER_LIST',
  CLUSTER_GROUP_LIST = 'CLUSTER_GROUP_LIST',
  PERSONAL_ACCESS_TOKENS_LIST = 'PERSONAL_ACCESS_TOKENS_LIST',
  GITHUB_PATS_LIST = 'GITHUB_PATS_LIST',
  AZURE_DEVOPS_PATS_LIST = 'AZURE_DEVOPS_PATS_LIST',
  GITHUB_REPOS_LIST = 'GITHUB_REPOS_LIST',
  AZURE_DEVOPS_REPOS_LIST = 'AZURE_DEVOPS_REPOS_LIST',
  CONTAINER_LIST = 'CONTAINER_LIST',
  K8S_OBJECTS_LIST = 'K8S_OBJECTS_LIST',
  EVENT_LIST = 'EVENT_LIST',
  CHAT_SESSION_LIST = 'CHAT_SESSION_LIST',
}

export interface ListSettings<TColumn extends string = string> {
  columns?: TColumn[];
  rowNumber: number;
  sortSettings: SortingState;
}

export interface AppListViewSettings {
  [ListViews.ENTITY_WITH_NAME_LIST]: ListSettings;
  [ListViews.CLUSTER_LIST]: ListSettings;
  [ListViews.NAMESPACE_LIST]: ListSettings;
  [ListViews.POD_LIST]: ListSettings;
  [ListViews.NODE_LIST]: ListSettings;
  [ListViews.API_KEYS_LIST]: ListSettings;
  [ListViews.ORGANIZATION_MEMBER_LIST]: ListSettings;
  [ListViews.CLUSTER_GROUP_LIST]: ListSettings;
  [ListViews.PERSONAL_ACCESS_TOKENS_LIST]: ListSettings;
  [ListViews.GITHUB_PATS_LIST]: ListSettings;
  [ListViews.AZURE_DEVOPS_PATS_LIST]: ListSettings;
  [ListViews.GITHUB_REPOS_LIST]: ListSettings;
  [ListViews.AZURE_DEVOPS_REPOS_LIST]: ListSettings;
  [ListViews.CONTAINER_LIST]: ListSettings;
  [ListViews.K8S_OBJECTS_LIST]: ListSettings;
  [ListViews.EVENT_LIST]: ListSettings;
  [ListViews.CHAT_SESSION_LIST]: ListSettings;
}

export type PaginationParams = {
  page?: string;
  limit?: string;
  search?: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ListRequest<T, Filter = {}> = {
  filter?: Filter;
  sort?: Partial<{
    [key in keyof T]: 'asc' | 'desc';
  }>;
  pagination?: {
    nextCursor?: string;
    prevCursor?: string;
    pageSize?: number;
  };
};

export type ListResponse<T> = T & {
  items: T[];
  pagination?: PaginationContext;
};
