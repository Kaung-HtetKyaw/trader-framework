'use client';
import React, { createContext, useContext } from 'react';
import { PureAbility } from '@casl/ability';
import { defineAbilitiesFor, TypedAbility } from './abilities';
import { useSession } from 'next-auth/react';
import { UserRoleEnum, UserRoles } from '@/types/user';

export const AbilityContext = createContext<TypedAbility>(new PureAbility([]) as TypedAbility);

const AbilityProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  let role: UserRoleEnum = 'user';
  if (status === 'authenticated' && session?.user?.role) {
    const sessionRole = session.user.role as UserRoleEnum;
    if ((Object.values(UserRoles) as string[]).includes(sessionRole)) {
      role = sessionRole;
    }
  }

  const ability = defineAbilitiesFor(role);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

export const useAbility = () => {
  return useContext(AbilityContext);
};

export type UseAbilityType = ReturnType<typeof useAbility>;

export default AbilityProvider;
