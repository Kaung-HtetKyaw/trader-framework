import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BaseButton } from '@/components/ui/base-button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCallback, useMemo } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const githubConnectionSchema = z.object({
  token: z.string().min(1, 'PAT token is required'),
});

export type GithubConnectionFormData = z.infer<typeof githubConnectionSchema>;

type GithubConnectionFormProps = {
  isConnecting: boolean;
  onConnect: (data: GithubConnectionFormData) => void;
};

const GithubConnectionForm = ({ onConnect, isConnecting }: GithubConnectionFormProps) => {
  const form = useForm<GithubConnectionFormData>({
    resolver: zodResolver(githubConnectionSchema),
    defaultValues: {
      token: '',
    },
  });

  const isFormValid = useMemo(() => form.formState.isValid, [form.formState.isValid]);

  const onSubmit = useCallback(() => {
    if (isConnecting) {
      return;
    }

    const data = form.getValues();
    onConnect(data);
  }, [form, onConnect, isConnecting]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 bg-text-50 rounded-lg">
      <h4 className="text-sm font-semibold text-text-950">Github Configuration</h4>

      <FormField
        control={form.control}
        name="token"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-text-950">Personal Access Token</FormLabel>
            <FormControl>
              <input
                {...field}
                type="text"
                placeholder="Enter Github PAT Token"
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
        disabled={!isFormValid || isConnecting}
        onClick={onSubmit}
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

export default GithubConnectionForm;
