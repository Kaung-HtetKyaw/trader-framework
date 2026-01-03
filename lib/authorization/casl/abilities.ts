import { UserRoleEnum, UserRoles } from '@/types/user';
import { EntityEnum } from '@/types/user/entities';
import { AllPermissionEnum, BasePermissionEnum, RoleChangePermissionEnum } from '@/types/user/permissions';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { applyAuthorizationPermissionsFor } from './utils';

export type Action = AllPermissionEnum;

export type Subject = EntityEnum;

export type TypedAbility = Omit<PureAbility<[Action, Subject]>, 'can'> & {
  // More specific overload FIRST (order matters for overload resolution)
  can(action: RoleChangePermissionEnum, subject: 'roles'): boolean;

  // More general overload SECOND
  can(action: BasePermissionEnum, subject: EntityEnum): boolean;
};

export type BaseCanAbility = (action: AllPermissionEnum, subject: EntityEnum) => boolean;

export function defineAbilitiesFor(userRole: UserRoleEnum) {
  const { can, rules } = new AbilityBuilder<PureAbility<[Action, Subject]>>(PureAbility);

  for (const role of Object.values(UserRoles)) {
    if (userRole === role) {
      applyAuthorizationPermissionsFor(role, can);
    }
  }

  return new PureAbility<[Action, Subject]>(rules) as TypedAbility;
}
