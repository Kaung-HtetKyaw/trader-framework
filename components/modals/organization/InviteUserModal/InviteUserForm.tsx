'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseButton } from '@/components/ui/base-button';
import { useInviteUserMutation } from '@/store/api/organizationApi';
import { CustomToast } from '@/components/CustomToast';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { UserRole, UserRoleEnum } from '@/types/user';
import { DropdownOption } from '@/components/Dropdown';
import { capitalize } from 'lodash';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

export const InviteUserSchema = z.object({
  email: z.string().email('Please enter an email address'),
  role: z.string().min(1, 'Please select a role'),
});

export type InviteUserFormValues = z.infer<typeof InviteUserSchema>;

type InviteUserFormProps = {
  isLoading: boolean;
  roles: UserRole[];
  roleOptions: DropdownOption[];
  onClose: () => void;
};

const roleDisplayMap: Record<UserRoleEnum, string> = {
  admin: 'Org Admin',
  owner: 'Org Owner',
  user: 'Org User',
};

const InviteUserForm = ({ isLoading: isLoadingRoles, roles, roleOptions, onClose }: InviteUserFormProps) => {
  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: '',
      role: roleOptions[0].value,
    },
  });

  const [inviteUser, { isLoading }] = useInviteUserMutation();

  const roleData = useMemo(() => roles?.map(el => el.name) || [], [roles]);

  const onSubmit = async (data: InviteUserFormValues) => {
    if (isLoading) {
      return;
    }

    const selectedRole = roleData.find(role => role === data.role);
    if (!selectedRole) {
      CustomToast({ type: 'error', message: 'Invalid role selected.' });
      return;
    }

    const response = await inviteUser({ email: data.email, roleName: selectedRole });
    const { error, notify } = notifyErrorFromResponse(response);
    if (error) {
      return notify(capitalize(error?.errorMessage) || 'Something went wrong');
    }

    CustomToast({
      type: 'success',
      message: 'The invitation has been sent successfully!',
    });
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage className="text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {isLoadingRoles ? (
                    <SelectItem value="" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {roleDisplayMap[role.value as UserRoleEnum] || role.value}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <div className="flex justify-center items-center gap-4 pt-2">
          <BaseButton
            type="button"
            variant="contained"
            color="cancel"
            size="medium"
            className="flex w-[156px] h-9 px-4 justify-center items-center gap-2"
            onClick={onClose}
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            variant="contained"
            color="secondary"
            className={cn(
              'flex w-[156px] h-9 px-4 justify-center items-center gap-2',
              isLoading && 'opacity-75 cursor-not-allowed'
            )}
            size="medium"
            disabled={!form.formState.isValid}
          >
            {isLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Inviting...</p>
              </LoadingSpinner>
            ) : (
              <span>Invite</span>
            )}
          </BaseButton>
        </div>
      </form>
    </Form>
  );
};

export default InviteUserForm;
