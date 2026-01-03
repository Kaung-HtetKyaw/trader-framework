import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingSpinner';
import ModalActionButton from '../ModalActionButton';
import { Textarea } from '@/components/ui/textarea';

export const EditAzureDevOpsRepoSchema = z.object({
  name: z.string().min(1, 'Please enter a repository name to continue.'),
  description: z.string().min(1, 'Please enter a short description to continue.'),
});

export type EditAzureDevOpsRepoFormData = z.infer<typeof EditAzureDevOpsRepoSchema>;

export type EditAzureDevOpsRepoFormProps = {
  defaultValues: EditAzureDevOpsRepoFormData;
  previousToken?: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: EditAzureDevOpsRepoFormData, onError?: (error: string) => void) => void;
};

const EditAzureDevOpsRepoForm = ({ defaultValues, isLoading, onClose, onSubmit }: EditAzureDevOpsRepoFormProps) => {
  const form = useForm<EditAzureDevOpsRepoFormData>({
    resolver: zodResolver(EditAzureDevOpsRepoSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description,
    },
    mode: 'onChange',
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
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Repository Name</FormLabel>
              <FormControl>
                <Input placeholder="Organization/RepositoryName" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a short description for the AI to know when to use this repository."
                  className="min-h-[100px] max-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="w-full flex gap-3 justify-center pt-6">
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

export default EditAzureDevOpsRepoForm;
