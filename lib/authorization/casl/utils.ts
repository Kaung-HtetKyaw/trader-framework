import { UserRoleEnum } from '@/types/user';
import { EntityEnum } from '@/types/user/entities';
import { AllPermissionEnum, BasePermissionEnum, UserAuthorizationMap } from '@/types/user/permissions';

export const applyAuthorizationPermissionsFor = (
  role: UserRoleEnum,
  can: (permission: AllPermissionEnum, entity: EntityEnum) => void
) => {
  for (const [entity, permissions] of Object.entries(UserAuthorizationMap[role])) {
    for (const permission of Object.values(permissions)) {
      can(permission as BasePermissionEnum, entity as EntityEnum);
    }
  }
};
