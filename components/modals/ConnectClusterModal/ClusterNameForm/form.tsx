import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ClusterNameFormData } from './schema';
import InfoCard from '@/components/InfoCard';
import { INFO_TYPE } from '@/constants';

type ClusterNameFormProps = {
  form: UseFormReturn<ClusterNameFormData>;
};

const ClusterNameForm = ({ form }: ClusterNameFormProps) => {
  const error = form.formState.errors.clusterName;

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name="clusterName"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="text-text-950 body-1 font-normal">
              Cluster Name <span className="text-red-500">*</span>
            </FormLabel>

            <FormControl>
              <Input
                type="text"
                placeholder="Enter Cluster Name"
                {...field}
                required
                className={`form-input border ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                    : 'border-text-200 focus-visible:ring-0'
                }`}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {error && (
        <InfoCard
          type={INFO_TYPE.error}
          title="Invalid Cluster Name"
          content={["Use only letters (a-z, A-Z), numbers (0-9), and hyphens (-)", "Must start and end with a letter or number", "No spaces allowed", "Maximum 253 characters"]}
        />
      )}
    </div>
  );
};

export default ClusterNameForm;
