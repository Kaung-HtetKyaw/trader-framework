import { omit, pick } from 'lodash/fp';
import { EntityEnum } from './entities';
import { UserRoleEnum } from '.';

export const BasePermissions = {
  find: 'find',
  list: 'list',
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const;

export const RoleChangePermissions = {
  'make-org-owner': 'make-org-owner',
  'make-org-admin': 'make-org-admin',
  'make-org-user': 'make-org-user',
} as const;

export const AllPermissions = {
  ...BasePermissions,
  ...RoleChangePermissions,
} as const;

export type BasePermissionEnum = keyof typeof BasePermissions;

export type RoleChangePermissionEnum = keyof typeof RoleChangePermissions;

export type AllPermissionEnum = keyof typeof AllPermissions;

export type UserPermissionType = Record<EntityEnum, Partial<typeof BasePermissions>> & {
  roles: Partial<typeof BasePermissions> & {
    [key in RoleChangePermissionEnum]?: keyof typeof RoleChangePermissions;
  };
};

export const UserPermissions: UserPermissionType = {
  users: AllPermissions,
  roles: AllPermissions,
  clusters: AllPermissions,
  cluster_groups: AllPermissions,
  cluster_tokens: AllPermissions,
  organizations: AllPermissions,
  personal_access_tokens: AllPermissions,
  repositories: AllPermissions,
  agents: AllPermissions,
} as const;

export type UserPermissionEnum = keyof typeof UserPermissions;

export type UserAuthorizationMapType = Record<UserRoleEnum, Partial<UserPermissionType>>;

export const UserAuthorizationMap: UserAuthorizationMapType = {
  admin: {
    ...omit(['organizations'], UserPermissions),
    organizations: pick(['list', 'find'], UserPermissions.organizations),
    roles: omit(['make-org-owner'], UserPermissions.roles),
  },
  owner: UserPermissions,
  user: {
    users: pick(['find'], UserPermissions.users),
    clusters: pick(['list', 'find'], UserPermissions.clusters),
    cluster_groups: pick(['list', 'find'], UserPermissions.cluster_groups),
    cluster_tokens: pick(['list', 'find'], UserPermissions.cluster_tokens),
    organizations: pick(['find'], UserPermissions.organizations),
    personal_access_tokens: pick(['list', 'find'], UserPermissions.personal_access_tokens),
    repositories: pick(['list', 'find'], UserPermissions.repositories),
    agents: pick(['list', 'find'], UserPermissions.agents),
    roles: {},
  },
} as const;
