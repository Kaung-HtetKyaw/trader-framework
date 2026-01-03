import { DialogContent } from '@/components/ui/dialog';
import CreateNewGroupForm from '../CreateNewGroup/form';

type CreateNewClusterGroupFormProps = {
  onClose: () => void;
};

const CreateNewClusterGroupForm = ({ onClose }: CreateNewClusterGroupFormProps) => {
  return (
    <DialogContent className="bg-text-50 w-[540px] max-w-none p-5 rounded-xl">
      <CreateNewGroupForm onClose={onClose} />
    </DialogContent>
  );
};

export default CreateNewClusterGroupForm;
