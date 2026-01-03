'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BaseButton } from '@/components/ui/base-button';
import { useAbility } from '@/lib/authorization/casl/AbilityProvider';

const EditOrganizationSchema = z.object({
  name: z.string().min(1, 'Please enter an organization name.'),
});

export type EditOrganizationFormData = z.infer<typeof EditOrganizationSchema>;

type EditOrganizationNameFormProps = {
  defaultValues: EditOrganizationFormData;
  isLoading: boolean;
  onSubmit: (data: EditOrganizationFormData, onError?: (error: string) => void) => void;
};

const EditOrganizationNameForm = ({ defaultValues, isLoading, onSubmit }: EditOrganizationNameFormProps) => {
  const form = useForm<EditOrganizationFormData>({
    resolver: zodResolver(EditOrganizationSchema),
    defaultValues,
    mode: 'onBlur',
  });
  const ability = useAbility();
  const canUpdate = ability.can('update', 'organizations');
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => onSubmit(data, error => form.setError('name', { message: error })))}
        className="flex items-center gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Organization Name"
                    {...field}
                    disabled={!canUpdate}
                    className={`form-input border w-full ${
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
        {canUpdate && (
          <BaseButton
            type="submit"
            variant="contained"
            color="secondary"
            size="medium"
            className="h-9 px-4"
            disabled={!(form.formState.isValid && form.formState.isDirty)}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </BaseButton>
        )}
      </form>
    </Form>
  );
};

export default EditOrganizationNameForm;
