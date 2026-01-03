'use client';

import { BaseButton } from '@/components/ui/base-button';
import Can from '@/lib/authorization/casl/Can';
import { AddIcon } from '@/components/svgs/AddIcon';
import GithubPATTable from '@/components/tables/GithubPATTable';
import CreateGithubPATModal from '@/components/modals/CreateGithubPATModal';
import AddGithubRepoModal from '@/components/modals/AddGithubRepo';
import GithubRepoTable from '@/components/tables/GithubRepoTable';
import { GitProvider } from '@/types/gitOps';
import { useMemo } from 'react';
import { getPATFromProvider } from '@/lib/utils';

export type GithubIntegrationSectionProps = {
  provider: GitProvider | null;
  isAvailable: boolean;
  isLoading: boolean;
  isFetching: boolean;
};

const GithubIntegrationSection = (props: GithubIntegrationSectionProps) => {
  const { isAvailable, provider, isLoading, isFetching } = props;

  const personalAccessTokens = useMemo(() => provider?.personalAccessTokens || [], [provider]);
  const repositories = useMemo(() => provider?.repositories || [], [provider]);

  const hasToken = useMemo(
    () => Boolean(personalAccessTokens && personalAccessTokens.length > 0),
    [personalAccessTokens]
  );

  const credential = useMemo(() => getPATFromProvider(provider), [provider]);

  const isPATActionDisabled = useMemo(() => !isAvailable || hasToken, [isAvailable, hasToken]);
  const isRepoActionDisabled = useMemo(() => !isAvailable || !hasToken, [isAvailable, hasToken]);

  return (
    <Can do="list" on="personal_access_tokens">
      <Can do="list" on="repositories">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <h1 className="body-1 font-bold">GitHub Integration</h1>

              <Can do="create" on="personal_access_tokens">
                <CreateGithubPATModal
                  renderTrigger={() => (
                    <BaseButton
                      size="small"
                      className={`px-2 w-fit flex flex-row items-center gap-1 ${isPATActionDisabled ? 'opacity-50' : ''}`}
                      disabled={isPATActionDisabled}
                    >
                      <span className={`${isPATActionDisabled ? 'text-text-400' : 'text-white'} body-2`}>
                        Add New PAT
                      </span>
                      <AddIcon className={`${isPATActionDisabled ? 'text-text-400' : 'text-text-50'} w-4 h-4`} />
                    </BaseButton>
                  )}
                />
              </Can>
            </div>
            <GithubPATTable
              repositories={repositories}
              personalAccessTokens={personalAccessTokens}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-end">
              <Can do="create" on="repositories">
                <AddGithubRepoModal
                  credential={credential}
                  renderTrigger={() => (
                    <BaseButton
                      size="small"
                      className={`px-2 w-fit flex flex-row items-center gap-1 ${isRepoActionDisabled ? 'opacity-50' : ''}`}
                      disabled={isRepoActionDisabled}
                    >
                      <span className={`${isRepoActionDisabled ? 'text-text-400' : 'text-white'} body-2`}>
                        Add New Repository
                      </span>
                      <AddIcon className={`${isRepoActionDisabled ? 'text-text-400' : 'text-text-50'} w-4 h-4`} />
                    </BaseButton>
                  )}
                />
              </Can>
            </div>
            <GithubRepoTable repositories={repositories} isLoading={isLoading} isFetching={isFetching} />
          </div>
        </div>
      </Can>
    </Can>
  );
};

export default GithubIntegrationSection;
