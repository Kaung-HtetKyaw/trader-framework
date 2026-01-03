'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import {
  API_KEYS_SETTINGS_PATH,
  CLUSTER_GROUPS_SETTINGS_PATH,
  isSettingsPath,
  PASSWORD_SETTINGS_PATH,
  GITOPS_INTEGRATION_SETTINGS_PATH,
  PROFILE_SETTINGS_PATH,
  SETTINGS_PATH,
  USER_ROLE_SETTINGS_PATH,
} from './urls';
import Container from '@/components/Container';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import { UseAbilityType } from '@/lib/authorization/casl/AbilityProvider';
import useFeatureFlag, { IsFeatureEnabled } from '@/lib/hooks/useFeatureFlag';
import SegmentedTabs, { SegmentedMenuItem } from '@/components/SegmentedTabs';
import { useMemo } from 'react';

const getMenus = (ability: UseAbilityType, isFeatureEnabled: IsFeatureEnabled): SegmentedMenuItem[] => {
  return [
    {
      label: 'General Settings',
      isActive: (pathname: string) =>
        pathname === PROFILE_SETTINGS_PATH || pathname === SETTINGS_PATH || pathname === PASSWORD_SETTINGS_PATH,
      enabled: true,
      getHref: () => PROFILE_SETTINGS_PATH,
      children: [
        {
          label: 'Profile',
          getHref: () => PROFILE_SETTINGS_PATH,
          isActive: (pathname: string) => pathname === PROFILE_SETTINGS_PATH || pathname === SETTINGS_PATH,
          enabled: true,
        },
        {
          label: 'Password Management ',
          getHref: () => PASSWORD_SETTINGS_PATH,
          isActive: (pathname: string) => pathname === PASSWORD_SETTINGS_PATH,
          enabled: true,
        },
      ],
    },
    ...(isFeatureEnabled('settings.organization')
      ? [
          {
            label: 'Organization Settings',
            isActive: (pathname: string) =>
              pathname === GITOPS_INTEGRATION_SETTINGS_PATH ||
              pathname === API_KEYS_SETTINGS_PATH ||
              pathname === API_KEYS_SETTINGS_PATH ||
              pathname === CLUSTER_GROUPS_SETTINGS_PATH ||
              pathname === USER_ROLE_SETTINGS_PATH,
            enabled: true,
            getHref: () => GITOPS_INTEGRATION_SETTINGS_PATH,
            children: [
              {
                label: 'GitOps Integration',
                getHref: () => GITOPS_INTEGRATION_SETTINGS_PATH,
                isActive: (pathname: string) => pathname === GITOPS_INTEGRATION_SETTINGS_PATH,
                enabled:
                  isFeatureEnabled('settings.organization.gitopsIntegration') &&
                  ability.can('list', 'personal_access_tokens') &&
                  ability.can('list', 'repositories'),
              },
              {
                label: 'API & Key',
                getHref: () => API_KEYS_SETTINGS_PATH,
                isActive: (pathname: string) => pathname === API_KEYS_SETTINGS_PATH,
                enabled: isFeatureEnabled('settings.organization.apiKey') && ability.can('list', 'cluster_tokens'),
              },
              {
                label: 'Cluster Group',
                getHref: () => CLUSTER_GROUPS_SETTINGS_PATH,
                isActive: (pathname: string) => pathname === CLUSTER_GROUPS_SETTINGS_PATH,
                enabled:
                  isFeatureEnabled('settings.organization.clusterGroup') && ability.can('list', 'cluster_groups'),
              },
              {
                label: 'User Role',
                getHref: () => USER_ROLE_SETTINGS_PATH,
                isActive: (pathname: string) => pathname === USER_ROLE_SETTINGS_PATH,
                enabled: isFeatureEnabled('settings.organization.organizationMembers') && ability.can('list', 'roles'),
              },
            ],
          },
        ]
      : []),
  ];
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ability = useAbility();
  const { isFeatureEnabled } = useFeatureFlag();

  const menus = useMemo(() => getMenus(ability, isFeatureEnabled), [ability, isFeatureEnabled]);

  if (!isSettingsPath(pathname)) {
    return children;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] p-3">
      <Container className="flex w-full py-0 px-0 overflow-y-auto vertical-scroll-container">
        <SegmentedTabs menus={menus}>
          <div className="w-full  p-4">{children}</div>
        </SegmentedTabs>
      </Container>
    </div>
  );
}
