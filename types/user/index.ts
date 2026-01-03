import { BasePermissionEnum } from './permissions';

export interface User {
  id: string;
  organizationID: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role: UserRoleEnum;
}

// TODO: change these enums when api is ready
export const UserRoles = {
  admin: 'admin',
  owner: 'owner',
  user: 'user',
} as const;

export type UserRoleEnum = keyof typeof UserRoles;

export type UserRole = {
  name: UserRoleEnum;
  resources: UserRoleResource[];
  higherRoleNames: UserRoleEnum[];
};

export type UserRoleResource = {
  name: string;
  permissions: BasePermissionEnum[];
};

export type InvitedUser = {
  email: string;
  organizationID: string;
  role: UserRoleEnum;
};

export type CombinedUser = User | InvitedUser;
