'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomToast } from '@/components/CustomToast';
import { cn } from '@/lib/utils';
import ModalActionButton from '../ModalActionButton';
import { Textarea } from '@/components/ui/textarea';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';
import { useMemo } from 'react';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { useAddGithubRepoMutation } from '@/store/api/gitOpsApi';
import { PersonalAccessToken } from '@/types/gitOps';
import LoadingSpinner from '@/components/LoadingSpinner';

export const MAX_GITHUB_REPO_NAME_LENGTH = 100;
export const MAX_GITHUB_REPO_DESCRIPTION_LENGTH = 500;

const AddGithubRepoSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a repository name to continue.')
    .regex(/^[^/]+\/[^/]+$/, 'Repository name must be in the format: Namespace/RepositoryName'),
  description: z
    .string()
    .min(1, 'Please enter a short description to continue.')
    .max(
      MAX_GITHUB_REPO_DESCRIPTION_LENGTH,
      `Description must be less than ${MAX_GITHUB_REPO_DESCRIPTION_LENGTH} characters.`
    ),
});

type AddGithubRepoFormValues = z.infer<typeof AddGithubRepoSchema>;

export type AddGithubRepoFormProps = {
  credential: PersonalAccessToken | null | undefined;
  onClose: () => void;
};

const AddGithubRepoForm = (props: AddGithubRepoFormProps) => {
  const { credential, onClose } = props;
  const ability = useAbility();
  const form = useForm<AddGithubRepoFormValues>({
    resolver: zodResolver(AddGithubRepoSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [addGithubRepo, { isLoading: isRequestLoading }] = useAddGithubRepoMutation();

  const isDisabled = useMemo(
    () => !credential || !form.formState.isValid || !ability.can('create', 'repositories'),
    [credential, form.formState.isValid, ability]
  );

  const handleCreate = async (values: AddGithubRepoFormValues) => {
    if (isRequestLoading) {
      return;
    }

    if (!credential) {
      CustomToast({
        type: 'error',
        message: 'Personal Access Token not found',
      });
      return;
    }

    const [namespace, repositoryName] = values.name.split('/');

    if (!namespace || !repositoryName) {
      CustomToast({
        type: 'error',
        message: 'Invalid repository name',
      });
      return;
    }

    try {
      const response = await addGithubRepo({
        name: repositoryName,
        description: values.description,
        personalAccessTokenIDs: [credential.id],
        //* NOTE: Github does not have a namespace, so we use an empty string for now
        namespace,
      });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        notify(error.errorMessage);
        return { success: false, error: error.errorMessage };
      }

      CustomToast({
        type: 'success',
        message: 'Repository has been added successfully!',
      });
      onClose();
    } catch (error) {
      console.error(error);
      CustomToast({
        type: 'error',
        message: 'Request failed',
      });
      onClose();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => handleCreate(data))} className="flex flex-col gap-4 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Repository Name</FormLabel>
              <FormControl>
                <Input placeholder="Namespace/RepositoryName" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
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

        <div className="flex items-center justify-center gap-4 pt-6">
          <ModalActionButton action="cancel" onClick={onClose} className="md:w-[120px]">
            Cancel
          </ModalActionButton>

          <ModalActionButton
            action="submit"
            className={cn(
              'md:w-[120px]',
              isDisabled
                ? 'bg-text-50  text-text-400 cursor-not-allowed font-normal'
                : 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal',
              isRequestLoading && 'opacity-75 cursor-not-allowed'
            )}
            disabled={isDisabled}
          >
            {isRequestLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Adding...</p>
              </LoadingSpinner>
            ) : (
              <span>Add</span>
            )}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default AddGithubRepoForm;
