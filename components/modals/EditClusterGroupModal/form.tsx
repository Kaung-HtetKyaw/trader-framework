'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ModalActionButton from '../ModalActionButton';
import { MAX_CLUSTER_GROUP_NAME_LENGTH } from '../CreateNewGroup/form';

const EditClusterGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a group name to continue.')
    .max(MAX_CLUSTER_GROUP_NAME_LENGTH, `Group name must be less than ${MAX_CLUSTER_GROUP_NAME_LENGTH} characters.`),
});

export type EditClusterGroupFormData = z.infer<typeof EditClusterGroupSchema>;

export type EditClusterGroupFormProps = {
  defaultValues: EditClusterGroupFormData;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: EditClusterGroupFormData, onError?: (error: string) => void) => void;
};

const EditClusterGroupForm = ({ defaultValues, isLoading, onClose, onSubmit }: EditClusterGroupFormProps) => {
  const form = useForm<EditClusterGroupFormData>({
    resolver: zodResolver(EditClusterGroupSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => onSubmit(data, error => form.setError('name', { message: error })))}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Group Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter group name"
                    {...field}
                    className={`form-input border ${
                      form.formState.errors[field.name]
                        ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                        : 'border-text-200 focus-visible:ring-0'
                    }`}
                  />
                  <FormMessage className="text-red-500 mt-1" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-center items-center gap-4 pt-2">
          <ModalActionButton action="cancel" onClick={onClose}>
            Cancel
          </ModalActionButton>

          <ModalActionButton action="submit" disabled={!(form.formState.isValid && form.formState.isDirty)}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default EditClusterGroupForm;
