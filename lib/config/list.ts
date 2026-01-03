import { AppListViewSettings, ListViews } from '@/types/list';

export const defaultListSettings: AppListViewSettings = {
  [ListViews.ENTITY_WITH_NAME_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'name', desc: false }],
  },
  [ListViews.CLUSTER_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [
      {
        id: 'stats.numberOfUpgrades',
        desc: false,
      },
    ],
  },
  [ListViews.NAMESPACE_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: true }],
  },
  [ListViews.POD_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: true }],
  },
  [ListViews.NODE_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: true }],
  },
  [ListViews.CONTAINER_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: true }],
  },
  [ListViews.API_KEYS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'name', desc: false }],
  },
  [ListViews.ORGANIZATION_MEMBER_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'role', desc: false }],
  },
  [ListViews.CLUSTER_GROUP_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'total', desc: false }],
  },
  [ListViews.PERSONAL_ACCESS_TOKENS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: false }],
  },
  [ListViews.GITHUB_PATS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: false }],
  },
  [ListViews.AZURE_DEVOPS_PATS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: false }],
  },
  [ListViews.GITHUB_REPOS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: false }],
  },
  [ListViews.AZURE_DEVOPS_REPOS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: false }],
  },
  [ListViews.K8S_OBJECTS_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'index', desc: false }],
  },
  [ListViews.EVENT_LIST]: {
    rowNumber: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '20') || 20,
    sortSettings: [{ id: 'eventTime', desc: true }],
  },
  [ListViews.CHAT_SESSION_LIST]: {
    rowNumber: 10,
    sortSettings: [{ id: 'createdAt', desc: true }],
  },
};
