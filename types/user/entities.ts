export const Entities = {
  users: 'users',
  roles: 'roles',
  clusters: 'clusters',
  cluster_groups: 'cluster_groups',
  cluster_tokens: 'cluster_tokens',
  organizations: 'organizations',
  personal_access_tokens: 'personal_access_tokens',
  repositories: 'repositories',
  agents: 'agents',
} as const;

export type EntityEnum = keyof typeof Entities;
