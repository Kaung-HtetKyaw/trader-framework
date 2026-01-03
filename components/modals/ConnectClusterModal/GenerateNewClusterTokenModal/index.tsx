import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GenerateNewClusterTokenModalForm from './form';
import { GenerateNewClusterTokenFormData } from './schema';
import { KeyIcon } from '@/components/svgs/KeyIcon';

type GenerateNewClusterTokenModalProps = {
  onCancel: () => void;
  onSubmit: (data: GenerateNewClusterTokenFormData, onError?: (value: string) => void) => void;
  isSubmitting: boolean;
};

const GenerateNewClusterTokenModal = (props: GenerateNewClusterTokenModalProps) => {
  const { onCancel, onSubmit, isSubmitting } = props;

  return (
    <div>
      <div className="max-w-[544px]   flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="font-semibold text-text-950 text-center flex flex-col gap-2 items-center title-1">
            <KeyIcon className="w-12 h-12 text-secondary-500 " />
            <span className="text-[1.375rem] font-bold">Generate new key</span>
          </DialogTitle>
        </DialogHeader>

        <GenerateNewClusterTokenModalForm onCancel={onCancel} onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default GenerateNewClusterTokenModal;
