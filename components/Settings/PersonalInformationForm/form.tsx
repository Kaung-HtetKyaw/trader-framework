'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PersonalInfoFormData } from '@/lib/validations';
import { CustomToast } from '@/components/CustomToast';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<
    {
      firstName: string;
      lastName: string;
      email: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  onSubmit: (data: PersonalInfoFormData) => Promise<{
    success: boolean;
    error?: string;
    redirectTo?: string;
    message?: string;
  }>;
}

const ProfilePersonalInformationForm = ({ form, onSubmit }: Props) => {
  const handleSubmit = async (data: PersonalInfoFormData) => {
    const result = await onSubmit(data);
    if (result.success) {
      CustomToast({
        type: 'success',
        message: result?.message || 'Changes saved successfully',
      });

      // reset the form to the default values
      form.reset(form.getValues());
    } else {
      CustomToast({ type: 'error', message: 'Uh oh, something went wrong' });
    }
  };

  return (
    <div className="bg-white rounded-lg w-full md:w-[26.25rem]">
      <h1 className="text-text-950 font-medium text-lg mb-4">Personal Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name={'firstName'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize font-normal">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        type="text"
                        placeholder={'Enter your first name'}
                        {...field}
                        className={`form-input border ${
                          form.formState.errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                            : 'border-text-200 focus-visible:ring-0'
                        }`}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'lastName'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize font-normal">Last Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        type="text"
                        placeholder={'Enter your last name'}
                        {...field}
                        className={`form-input border ${
                          form.formState.errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                            : 'border-text-200 focus-visible:ring-0'
                        }`}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'email'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize font-normal text-text-500">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        required
                        type="text"
                        placeholder={'Enter your email'}
                        disabled
                        {...field}
                        className={`form-input border ${
                          form.formState.errors[field.name]
                            ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
                            : 'border-text-200 focus-visible:ring-0'
                        }`}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfilePersonalInformationForm;
