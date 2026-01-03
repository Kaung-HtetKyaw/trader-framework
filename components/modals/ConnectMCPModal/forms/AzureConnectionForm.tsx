import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BaseButton } from '@/components/ui/base-button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCallback, useMemo } from 'react';

const azureConnectionSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  personalAccessToken: z.string().min(1, 'PAT token is required'),
});

export type AzureConnectionFormData = z.infer<typeof azureConnectionSchema>;

type AzureConnectionFormProps = {
  isConnecting: boolean;
  onConnect: (data: AzureConnectionFormData) => void;
};

const AzureConnectionForm = ({ onConnect, isConnecting }: AzureConnectionFormProps) => {
  const form = useForm<AzureConnectionFormData>({
    resolver: zodResolver(azureConnectionSchema),
    defaultValues: {
      organizationName: '',
      personalAccessToken: '',
    },
  });

  const isFormValid = useMemo(() => form.formState.isValid, [form.formState.isValid]);

  const onSubmit = useCallback(() => {
    if (isConnecting) {
      return;
    }

    const data = form.getValues();
    onConnect(data);
  }, [onConnect, isConnecting, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 bg-text-50 rounded-lg">
      <h4 className="text-sm font-semibold text-text-950">Azure Configuration</h4>

      <FormField
        control={form.control}
        name="organizationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-text-950">Organization Name</FormLabel>
            <FormControl>
              <input
                {...field}
                type="text"
                placeholder="Enter Organization Name"
                className="w-full h-11 px-3 py-2 bg-white border border-text-200 rounded-md text-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </FormControl>
            <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personalAccessToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-text-950">Personal Access Token</FormLabel>
            <FormControl>
              <input
                {...field}
                type="password"
                placeholder="Enter Azure PAT Token"
                className="w-full h-11 px-3 py-2 bg-white border border-text-200 rounded-md text-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </FormControl>
            <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
          </FormItem>
        )}
      />

      <BaseButton
        type="button"
        variant="contained"
        color="secondary"
        className="w-fit rounded-lg self-end"
        onClick={onSubmit}
        disabled={!isFormValid || isConnecting}
      >
        {isConnecting ? (
          <LoadingSpinner className="w-full gap-2">
            <p>Connecting...</p>
          </LoadingSpinner>
        ) : (
          <span>Connect</span>
        )}
      </BaseButton>
    </form>
  );
};

export default AzureConnectionForm;
