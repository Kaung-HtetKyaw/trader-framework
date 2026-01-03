'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomToast } from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { cn } from '@/lib/utils';
import ModalActionButton from '../ModalActionButton';
import InfoCard from '@/components/InfoCard';
import { INFO_TYPE } from '@/constants';
import config from '@/lib/config';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { useAddAzureDevOpsPATMutation } from '@/store/api/gitOpsApi';

const CreateAzureDevOpsPATSchema = z.object({
  name: z.string().min(1, 'Please enter a name to continue.'),
  token: z.string().min(1, 'Please enter a token to continue.'),
  owner: z.string().min(1, 'Please enter the organization associated with the PAT.'),
});

type CreateAzureDevOpsPATFormValues = z.infer<typeof CreateAzureDevOpsPATSchema>;

export type CreateAzureDevOpsPATFormProps = {
  onClose: () => void;
};

const CreateAzureDevOpsPATForm = ({ onClose }: CreateAzureDevOpsPATFormProps) => {
  const form = useForm<CreateAzureDevOpsPATFormValues>({
    resolver: zodResolver(CreateAzureDevOpsPATSchema),
    defaultValues: {
      name: config.NEXT_PUBLIC_AZURE_DEVOPS_TOKEN_NAME,
      token: '',
      owner: '',
    },
    mode: 'onChange',
  });

  const [createAccessToken, { isLoading: isRequestLoading }] = useAddAzureDevOpsPATMutation();

  const handleCreate = async (values: CreateAzureDevOpsPATFormValues) => {
    try {
      const resp = await createAccessToken({
        name: config.NEXT_PUBLIC_AZURE_DEVOPS_TOKEN_NAME,
        value: values.token,
        owner: values.owner,
      });

      const { error, notify } = notifyErrorFromResponse(resp);

      if (error) {
        notify(error.errorMessage);
        return { success: false, error: error.errorMessage };
      }

      CustomToast({
        type: 'success',
        message: 'Personal Access Token has been added successfully!',
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
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Token Value*</FormLabel>
              <FormControl>
                <Input placeholder="Please enter the PAT generated in GitHub" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Azure Organization*</FormLabel>
              <FormControl>
                <Input placeholder="Please enter the Organization associated to the PAT" {...field} />
              </FormControl>
              <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="rounded-lg flex items-start w-full">
          <InfoCard
            type={INFO_TYPE.info}
            title={'Personal Access Token expiration'}
            content={[
              'Please make sure the PAT is not expired.',
              'When the PAT expires, please make sure to update to a new valid token.',
            ]}
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <ModalActionButton action="cancel" onClick={onClose} className="lg:w-[120px]">
            Cancel
          </ModalActionButton>

          <ModalActionButton
            action="submit"
            className={cn(
              'lg:w-[120px]',
              !form.formState.isValid
                ? 'bg-text-50  text-text-400 cursor-not-allowed font-normal'
                : 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal'
            )}
            disabled={!form.formState.isValid}
          >
            {isRequestLoading ? (
              <LoadingSpinner className="p-0">
                <p className="text-sm font-normal text-text-50">Adding...</p>
              </LoadingSpinner>
            ) : (
              'Add'
            )}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default CreateAzureDevOpsPATForm;
