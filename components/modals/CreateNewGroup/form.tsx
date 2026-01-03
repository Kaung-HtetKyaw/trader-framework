'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomToast } from '@/components/CustomToast';
import { cn } from '@/lib/utils';
import { ErrorCodes, notifyErrorFromResponse } from '@/lib/utils/error';
import { useCreateClusterGroupMutation, useGetClusterGroupsQuery } from '@/store/api/clusterApi';
import ModalActionButton from '../ModalActionButton';
import LoadingSpinner from '@/components/LoadingSpinner';

/**  NOTE:
 Kubernetes label values and namespace names max out at 63 characters.
 Allowing 70 here provides a small buffer for internal usage while still
 preventing names that would break Kubernetes DNS-label rules.
**/
export const MAX_CLUSTER_GROUP_NAME_LENGTH = 70;

type ClusterGroup = { name: string };
const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'Please enter a group name to continue.')
    .max(MAX_CLUSTER_GROUP_NAME_LENGTH, `Group name must be less than ${MAX_CLUSTER_GROUP_NAME_LENGTH} characters.`),
});

type CreateGroupFormValues = z.infer<typeof CreateGroupSchema>;

export type CreateNewGroupFormProps = {
  onClose: () => void;
};

const CreateNewGroupForm = ({ onClose }: CreateNewGroupFormProps) => {
  const { data: clusterGroups, isLoading: isGroupsLoading } = useGetClusterGroupsQuery();
  const existingGroupNames = ((clusterGroups as ClusterGroup[]) ?? []).map(g => g.name);

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [createClusterGroup, { isLoading: isRequestLoading }] = useCreateClusterGroupMutation();

  const handleCreate = async (values: CreateGroupFormValues, onError: (error: string) => void) => {
    if (isRequestLoading) {
      return;
    }

    try {
      const response = await createClusterGroup({ name: values.name });

      const { error, notify } = notifyErrorFromResponse(response, onError);

      if (error) {
        return notify(
          error?.errorCode === ErrorCodes.EKG40004
            ? 'This name is already taken, please choose another one.'
            : 'Something went wrong'
        );
      }

      CustomToast({
        type: 'success',
        message: 'New cluster group has been created successfully!',
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

  const isNameTaken = existingGroupNames.some(n => n.trim().toLowerCase() === form.watch('name').trim().toLowerCase());

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => handleCreate(data, error => form.setError('name', { message: error })))}
        className="flex flex-col gap-4 w-full"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-text-950">Create a new cluster group</h2>
          <p className="text-xs font-normal text-text-950 leading-[1.3]">
            Create a new cluster group here to be able to use it across the Kubegrade application.
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Cluster Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter cluster group name" {...field} disabled={isGroupsLoading} />
              </FormControl>
              {isNameTaken && (
                <div className="text-xs font-normal leading-[1.3] text-red-500 mt-1">
                  This name is already taken, please choose another one.
                </div>
              )}
              <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-2">
          <ModalActionButton action="cancel" onClick={onClose} className="md:w-[120px]">
            Cancel
          </ModalActionButton>

          <ModalActionButton
            action="submit"
            className={cn(
              'md:w-[120px]',
              !(form.formState.isValid && form.formState.isDirty) || isNameTaken || isGroupsLoading
                ? 'bg-text-50  text-text-400 cursor-not-allowed font-normal'
                : 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal',
              isRequestLoading && 'opacity-75 cursor-not-allowed'
            )}
            disabled={!(form.formState.isValid && form.formState.isDirty) || isNameTaken || isGroupsLoading}
          >
            {isRequestLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Creating...</p>
              </LoadingSpinner>
            ) : (
              <span>Create</span>
            )}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default CreateNewGroupForm;
