'use client';
import { EntityEnum } from '@/types/user/entities';
import { AllPermissionEnum, AllPermissions } from '@/types/user/permissions';
import { useAbility } from './AbilityProvider';
import { useMemo } from 'react';
import { BaseCanAbility } from './abilities';

export type CanProps = {
  children: React.ReactNode;
  do: 'all' | AllPermissionEnum | AllPermissionEnum[];
  on: EntityEnum;
  fallback?: React.ReactNode;
};

const Can = ({ children, do: canAction, on, fallback }: CanProps) => {
  const ability = useAbility();

  const can = useMemo(() => {
    if (canAction === 'all') {
      return Object.values(AllPermissions).every(permission => (ability.can as BaseCanAbility)(permission, on));
    }

    return Array.isArray(canAction)
      ? canAction.every(action => (ability.can as BaseCanAbility)(action, on))
      : (ability.can as BaseCanAbility)(canAction, on);
  }, [canAction, on, ability]);

  if (!can) {
    return fallback || null;
  }

  return children;
};

export default Can;
