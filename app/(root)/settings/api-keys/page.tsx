'use client';

import ApiKeysTable from '@/components/tables/ApiKeysTable';
import GenerateNewClusterTokenModal from '@/components/modals/ConnectClusterModal';
import { BaseButton } from '@/components/ui/base-button';
import Can from '@/lib/authorization/casl/Can';
import { AddIcon } from '@/components/svgs/AddIcon';

const ApiKeysPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <h1 className="body-1 font-bold">API & Key Management</h1>

        <Can do="create" on="cluster_tokens">
          <GenerateNewClusterTokenModal
            modalType="generate"
            renderTrigger={() => (
              <BaseButton size="small" className="w-fit flex flex-row items-center gap-1">
                <span className="text-white body-2">Create New Key</span>
                <AddIcon className="w-4 h-4 text-text-50" />
              </BaseButton>
            )}
          />
        </Can>
      </div>
      <ApiKeysTable />
    </div>
  );
};

export default ApiKeysPage;
