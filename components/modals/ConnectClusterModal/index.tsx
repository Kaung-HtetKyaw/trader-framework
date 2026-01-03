'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useMemo, useState } from 'react';
import { BaseButton } from '@/components/ui/base-button';
import ChooseClusterTokenModal from './ChooseClusterTokenModal';
import GenerateNewClusterTokenModal from './GenerateNewClusterTokenModal';
import { CustomToast } from '@/components/CustomToast';
import { GenerateNewClusterTokenFormData } from './GenerateNewClusterTokenModal/schema';
import { ErrorCodes, notifyErrorFromResponse } from '@/lib/utils/error';
import Can from '@/lib/authorization/casl/Can';
import { useGetClusterKeysQuery } from '@/store/api/clusterApi';
import { useCreateClusterKeyMutation } from '@/store/api/clusterApi';
import { cn } from '@/lib/utils';
import { ConnectClusterIcon } from '@/components/svgs/ConnectClusterIcon';

/**
 * Props for the ConnectClusterModal component
 * @typedef {Object} ConnectClusterModalProps
 * @property {Function} [triggerButton] - Optional render function for custom trigger button
 * @param {Object} triggerButtonProps - Props passed to the trigger button render function
 * @param {boolean} triggerButtonProps.open - Current open state of the modal
 * @returns {React.ReactNode} Custom trigger button component
 */
export type ConnectClusterModalProps = {
  modalType?: ClusterTokenModalType;
  renderTrigger?: (props: { open: boolean }) => React.ReactNode;
  className?: string;
};

export type ClusterTokenModalType = 'generate' | 'choose';

/**
 * A modal dialog component for connecting a Kubernetes cluster to the Kubegrade platform.
 * Provides a UI for selecting an API key and displaying the connection command.
 *
 * @param {Object} props - Component props
 * @param {Function} [props.triggerButton] - Optional custom trigger button render function
 * @returns {JSX.Element} Connect cluster modal dialog
 */
export default function ConnectClusterModal(props?: ConnectClusterModalProps) {
  const { renderTrigger, modalType, className = 'h-9' } = props || {};

  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>();
  const [newKey, setNewKey] = useState<string>();

  const [clusterTokenModalType, setClusterTokenModalType] = useState<ClusterTokenModalType>(modalType || 'choose');

  const { data: keys, refetch } = useGetClusterKeysQuery(undefined);

  const [createClusterKey, { isLoading: isSubmitting }] = useCreateClusterKeyMutation();

  const onSubmit = async (data: GenerateNewClusterTokenFormData, onError?: (value: string) => void) => {
    if (isSubmitting) {
      return;
    }

    try {
      const response = await createClusterKey({ name: data.name });

      const { error, notify } = notifyErrorFromResponse(response, onError);

      if (error) {
        return notify(
          error?.errorCode === ErrorCodes.EKG40003
            ? 'This name is already taken, please choose another one.'
            : 'Something went wrong'
        );
      }

      if (!response.error) {
        setClusterTokenModalType(modalType || 'choose');
        setOpen(modalType === 'generate' ? false : true);
        refetch();
        setNewKey(response.data.value);
        CustomToast({
          message: 'A new key has been generated successfully!',
          type: 'success',
        });
      }
    } catch (error) {
      CustomToast({
        message: 'Failed to generate a new key!',
        type: 'error',
      });
      console.error(error);
    }
  };

  const keysOptions = useMemo(() => {
    return (
      keys?.map(key => ({
        label: `${key.value}`,
        value: key.value,
        name: key.name,
      })) || []
    );
  }, [keys]);

  const defaultKey = useMemo(() => {
    return newKey || keysOptions[0]?.value;
  }, [keysOptions, newKey]);

  const onChange = (key: string) => {
    setSelectedKey(key);
    setNewKey(undefined);
  };

  const onCloseGenerateModal = () => {
    if (modalType === 'generate') {
      setOpen(false);
      return;
    }

    setClusterTokenModalType('choose');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {renderTrigger ? (
          <div onClick={() => setOpen(true)}>{renderTrigger({ open })}</div>
        ) : (
          <BaseButton
            className={cn(`flex flex-row justify-center items-center bg-secondary-500 text-white`, className)}
            onClick={() => setOpen(true)}
          >
            <span className="hidden lg:block">Connect Cluster</span>
            <ConnectClusterIcon className="w-4 h-4 ml-0 lg:ml-2 text-text-50" />
          </BaseButton>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[640px]  bg-white p-6 flex flex-col items-center">
        <Can do="create" on="cluster_tokens">
          {(modalType === 'generate' || clusterTokenModalType === 'generate') && (
            <GenerateNewClusterTokenModal
              onCancel={onCloseGenerateModal}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </Can>

        <Can do="list" on="cluster_tokens">
          {clusterTokenModalType === 'choose' && (
            <ChooseClusterTokenModal
              keysOptions={keysOptions}
              selectedKey={newKey || selectedKey || defaultKey}
              onChange={onChange}
              setOpen={setOpen}
              onGenerateNewToken={() => setClusterTokenModalType('generate')}
            />
          )}
        </Can>
      </DialogContent>
    </Dialog>
  );
}
