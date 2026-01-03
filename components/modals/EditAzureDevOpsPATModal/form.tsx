import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModalActionButton from '../ModalActionButton';

export const EditAzureDevOpsPATSchema = z.object({
  token: z.string(),
  owner: z.string().min(1, 'Please enter the organization associated with the PAT.'),
});

export type EditAzureDevOpsPATFormData = z.infer<typeof EditAzureDevOpsPATSchema>;

export type EditAzureDevOpsPATFormProps = {
  defaultValues: EditAzureDevOpsPATFormData;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: EditAzureDevOpsPATFormData, onError?: (error: string) => void) => void;
};

const EditAzureDevOpsPATForm = ({
  defaultValues = { token: '', owner: '' },
  isLoading,
  onClose,
  onSubmit,
}: EditAzureDevOpsPATFormProps) => {
  const form = useForm<EditAzureDevOpsPATFormData>({
    resolver: zodResolver(EditAzureDevOpsPATSchema),
    defaultValues: {
      token: '',
      owner: defaultValues.owner,
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => onSubmit(data, error => form.setError('token', { message: error })))}
        className="flex flex-col justify-start items-start gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Token Value</FormLabel>

              <FormControl>
                <Input {...field} placeholder="Please enter the new PAT" />
              </FormControl>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Azure Organization*</FormLabel>

              <FormControl>
                <Input placeholder="Please enter the Organization associated to the PAT" {...field} />
              </FormControl>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="w-full flex gap-3 px-10">
          <ModalActionButton action="cancel" onClick={onClose}>
            Cancel
          </ModalActionButton>

          <ModalActionButton action="submit" type="submit" disabled={!form.formState.isValid}>
            {isLoading ? (
              <LoadingSpinner className="p-0">
                <p className="text-sm font-normal text-text-50">Saving...</p>
              </LoadingSpinner>
            ) : (
              'Save Changes'
            )}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default EditAzureDevOpsPATForm;
