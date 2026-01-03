import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ModalActionButton from '../ModalActionButton';
import { Textarea } from '@/components/ui/textarea';
import { MAX_GITHUB_REPO_NAME_LENGTH } from '../AddGithubRepo/form';
import { MAX_GITHUB_REPO_DESCRIPTION_LENGTH } from '../AddGithubRepo/form';
import LoadingSpinner from '@/components/LoadingSpinner';

export const EditGithubRepoSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a repository name to continue.')
    .max(MAX_GITHUB_REPO_NAME_LENGTH, `Repository name must be less than ${MAX_GITHUB_REPO_NAME_LENGTH} characters.`),
  description: z
    .string()
    .min(1, 'Please enter a short description to continue.')
    .max(
      MAX_GITHUB_REPO_DESCRIPTION_LENGTH,
      `Description must be less than ${MAX_GITHUB_REPO_DESCRIPTION_LENGTH} characters.`
    ),
});

export type EditGithubRepoFormData = z.infer<typeof EditGithubRepoSchema>;

export type EditGithubRepoFormProps = {
  defaultValues: EditGithubRepoFormData;
  previousToken?: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: EditGithubRepoFormData, onError?: (error: string) => void) => void;
};

const EditGithubRepoForm = ({ defaultValues, isLoading, onClose, onSubmit }: EditGithubRepoFormProps) => {
  const form = useForm<EditGithubRepoFormData>({
    resolver: zodResolver(EditGithubRepoSchema),
    defaultValues: {
      name: defaultValues.name,
      description: defaultValues.description,
    },
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
              <LoadingSpinner className="w-full gap-2">
                <p>Saving...</p>
              </LoadingSpinner>
            ) : (
              <span>Save Changes</span>
            )}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default EditGithubRepoForm;
