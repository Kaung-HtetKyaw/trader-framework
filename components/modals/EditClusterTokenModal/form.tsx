import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ModalActionButton from '../ModalActionButton';
import { MAX_CLUSTER_TOKEN_NAME_LENGTH } from '../ConnectClusterModal/GenerateNewClusterTokenModal/schema';

export const EditClusterTokenSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a key name')
    .max(MAX_CLUSTER_TOKEN_NAME_LENGTH, `Key name must be less than ${MAX_CLUSTER_TOKEN_NAME_LENGTH} characters.`),
});

export type EditClusterTokenFormData = z.infer<typeof EditClusterTokenSchema>;

export type EditClusterTokenFormProps = {
  defaultValues: EditClusterTokenFormData;
  keyValue: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: EditClusterTokenFormData, onError?: (error: string) => void) => void;
};

const EditClusterTokenForm = ({ defaultValues, keyValue, isLoading, onClose, onSubmit }: EditClusterTokenFormProps) => {
  const form = useForm<EditClusterTokenFormData>({
    resolver: zodResolver(EditClusterTokenSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => onSubmit(data, error => form.setError('name', { message: error })))}
        className="flex flex-col justify-start items-start gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Key Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="h-9 px-4 bg-text-50 rounded-md outline outline-1 outline-text-50 outline-offset-[-1px] flex items-center w-full text-text-950 text-sm font-normal leading-[16.8px]">
          {keyValue}
        </div>
        <div className="w-full flex gap-3 px-10">
          <ModalActionButton action="cancel" onClick={onClose}>
            Cancel
          </ModalActionButton>

          <ModalActionButton
            action="submit"
            type="submit"
            disabled={!(form.formState.isValid && form.formState.isDirty)}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default EditClusterTokenForm;
