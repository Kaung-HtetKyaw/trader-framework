import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ClusterTokenDropdown, { ClusterTokenDropdownOption } from './ClusterTokenDropdown';
import InfoCard from '@/components/InfoCard';
import { INFO_TYPE } from '@/constants';
import { BaseButton } from '@/components/ui/base-button';
import { useMemo } from 'react';
import CopyToClipboard from '@/components/CopyToClipboard';
import { ConnectClusterModalIcon } from '@/components/svgs/ConnectClusterModalIcon';
import config from '@/lib/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import ClusterNameForm from './ClusterNameForm/form';
import { clusterNameFormSchema, ClusterNameFormData } from './ClusterNameForm/schema';

export type ChooseClusterTokenModalProps = {
  keysOptions: ClusterTokenDropdownOption[];
  selectedKey: string;
  onChange: (key: string) => void;
  setOpen: (open: boolean) => void;
  onGenerateNewToken: () => void;
};

const ChooseClusterTokenModal = (props: ChooseClusterTokenModalProps) => {
  const { keysOptions, selectedKey, onChange, setOpen, onGenerateNewToken } = props;

  const form = useForm<ClusterNameFormData>({
    resolver: zodResolver(clusterNameFormSchema),
    defaultValues: {
      clusterName: '',
    },
    mode: 'onChange',
  });


  const handleKeyChange = (key: ClusterTokenDropdownOption) => {
    onChange(key.value);
  };

  const clusterName = form.watch('clusterName');
  const isClusterNameValid = clusterName && !form.formState.errors.clusterName;

  const commandText = useMemo(() => {
    const token = selectedKey;
    return `curl -H "Authorization: APIKEY ${token}" "${config.NEXT_PUBLIC_API_BASE_URL}/agent.yaml?clusterName=${clusterName}" | kubectl apply -f -`;
  }, [selectedKey, clusterName]);

  const commandJSX = (
    <>
      curl -H &quot;Authorization: APIKEY {selectedKey}&quot;{' '}
      <span className="text-blue-500">
        &quot;{config.NEXT_PUBLIC_API_BASE_URL}/agent.yaml?clusterName={clusterName}&quot;
      </span>{' '}
      | kubectl apply -f -
    </>
  );

  return (
    <div>
      <Form {...form}>
        <div className="max-w-[544px]   flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="font-semibold text-text-950 text-center flex flex-col gap-2 items-center title-1">
              <ConnectClusterModalIcon className="w-12 h-12 text-secondary-500" />
              Connect your cluster
            </DialogTitle>
          </DialogHeader>

          <p className="text-text-950 text-center text-sm px-8">
            Make sure that kubectl is installed and that it can access your cluster. Copy the script below and run it in
            your cloud shell or terminal.
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <p className="text-text-950 body-1">Cluster Key</p>

            <ClusterTokenDropdown
              selectedKey={selectedKey}
              onGenerateNewToken={onGenerateNewToken}
              options={keysOptions}
              onChange={handleKeyChange}
            />
          </div>

          <ClusterNameForm form={form} />

        {isClusterNameValid && (
          <div className="relative bg-secondary-950 p-3 text-white text-xs rounded-lg flex items-center justify-between w-full">
            <pre className="whitespace-pre-wrap break-all overflow-wrap-anywhere flex-1">{commandJSX}</pre>
            <div className="ml-2 flex-shrink-0">
              <CopyToClipboard text={commandText} />
            </div>
          </div>
        )}

          <div className="rounded-lg flex items-start w-full">
            <InfoCard
              type={INFO_TYPE.info}
              title={'Connection process'}
              content={
                'The connection process may take a few minutes to finish. If this takes longer than expected, please refresh, try again or contact support.'
              }
            />
          </div>
        </div>

        <div className="flex justify-center">
          <BaseButton onClick={() => setOpen(false)} className="w-[180px] mt-4 bg-secondary-500 text-white">
            Done
          </BaseButton>
        </div>
      </Form>
    </div>
  );
};

export default ChooseClusterTokenModal;
