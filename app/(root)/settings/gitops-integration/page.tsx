'use client';

import GithubIntegrationSection from '@/components/GithubIntegrationSection';
import AzureDevOpsIntegrationSection from '@/components/AzureDevOpsIntegrationSection';
import { useListGitProviderQuery } from '@/store/api/gitOpsApi';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import { useMemo } from 'react';
import { GitProviders } from '@/types/gitOps';

const GitOpsIntegrationPage = () => {
  const ability = useAbility();

  const { data, isLoading, isFetching } = useListGitProviderQuery(
    {},
    {
      skip: !ability.can('list', 'personal_access_tokens') || !ability.can('list', 'repositories'),
    }
  );

  const githubProvider = useMemo(
    () => data?.items?.find(provider => provider.name === GitProviders.github) || null,
    [data]
  );

  const azureProvider = useMemo(
    () => data?.items?.find(provider => provider.name === GitProviders.azure) || null,
    [data]
  );

  return (
    <div className="flex flex-col gap-6">
      <GithubIntegrationSection
        provider={githubProvider}
        isAvailable={!azureProvider}
        isLoading={isLoading}
        isFetching={isFetching}
      />
      <AzureDevOpsIntegrationSection
        provider={azureProvider}
        isAvailable={!githubProvider}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </div>
  );
};

export default GitOpsIntegrationPage;
