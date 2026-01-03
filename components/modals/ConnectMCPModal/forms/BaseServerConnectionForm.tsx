import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { BaseButton } from '@/components/ui/base-button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useCallback, useMemo } from 'react';

const baseServerConnectionSchema = z.object({
  configuration: z.string().min(1, 'Configuration is required'),
});

export type BaseServerConnectionFormData = z.infer<typeof baseServerConnectionSchema>;

type BaseServerConnectionFormProps = {
  title: string;
  label?: string;
  placeholder?: string;
  onConnect: (data: BaseServerConnectionFormData) => void;
  isConnecting: boolean;
};

const BaseServerConnectionForm = ({
  title,
  label = 'Configuration',
  placeholder = 'Enter configuration',
  onConnect,
  isConnecting,
}: BaseServerConnectionFormProps) => {
  const form = useForm<BaseServerConnectionFormData>({
    resolver: zodResolver(baseServerConnectionSchema),
    defaultValues: {
      configuration: '',
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
      <h4 className="text-sm font-semibold text-text-950">{title}</h4>

      <FormField
        control={form.control}
        name="configuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-text-950">{label}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={placeholder}
                className="min-h-[100px] resize-none bg-white border border-text-200 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
        disabled={!isFormValid}
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

export default BaseServerConnectionForm;
