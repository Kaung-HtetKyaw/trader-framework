import DoubleArrowIcon from '@/components/svgs/DoubleArrowIcon';
import { BaseButton } from '@/components/ui/base-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useGeneratePromptMutation } from '@/store/api/agentApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

const MAX_DESCRIPTION_LENGTH = 500;

const schema = z.object({
  description: z
    .string()
    .min(1, 'Please enter a short description to continue.')
    .max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters.`),
  suggestedPrompt: z.string(),
});

export type AgentSuggestedPromptFormData = z.infer<typeof schema>;

export type DescriptionGeneratorProps = {
  onSubmit: (instruction: string) => void;
  onClose: () => void;
};

const DescriptionGenerator = (props: DescriptionGeneratorProps) => {
  const { onSubmit, onClose } = props;
  // NOTE: this is a temp state to instantly reflect the insertiong from auto generation
  const [suggestedPrompt, setSuggestedPrompt] = useState<string>('');
  const [generatePrompt, { isLoading: isGeneratingPrompt }] = useGeneratePromptMutation();

  const form = useForm<AgentSuggestedPromptFormData>({
    resolver: zodResolver(schema),
    defaultValues: { description: '', suggestedPrompt: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const isDisabled = useMemo(() => {
    return !suggestedPrompt || isGeneratingPrompt;
  }, [suggestedPrompt, isGeneratingPrompt]);

  const onGeneratePrompt = useCallback(async () => {
    if (!form.getValues('description')) {
      form.setError('description', { message: 'Please enter a description to continue.' });
      return;
    }

    const response = await generatePrompt({ input: form.getValues('description') });
    if (response.data) {
      form.setValue('suggestedPrompt', response.data.output || '');
      setSuggestedPrompt(response.data.output || '');
    }
  }, [generatePrompt, form]);

  const onCancel = useCallback(() => {
    onClose();
    form.reset();
    setSuggestedPrompt('');
  }, [onClose, form]);

  const handleSubmit = useCallback(
    async (data: AgentSuggestedPromptFormData) => {
      onSubmit(data.suggestedPrompt);
      onClose();
    },
    [onSubmit, onClose]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => handleSubmit(data))} className="flex flex-col gap-6 w-full">
        <div className="w-full flex flex-row items-center gap-1">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this agent should do"
                    className="min-h-[100px] max-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
              </FormItem>
            )}
          />

          {isGeneratingPrompt ? (
            <LoadingSpinner className="w-full gap-0" containerClassName="gap-0">
              <p></p>
            </LoadingSpinner>
          ) : (
            <BaseButton
              type="button"
              onClick={onGeneratePrompt}
              variant="outlined"
              className={cn(
                'w-[30px] h-[30px] flex items-center justify-center group hover:bg-secondary-500 translate-y-[12px] rounded-lg cursor-pointer'
              )}
            >
              <DoubleArrowIcon
                style={{ width: '14px', height: '14px' }}
                className="text-secondary-500 group-hover:text-white "
              />
            </BaseButton>
          )}

          <FormField
            control={form.control}
            name="suggestedPrompt"
            disabled={!form.getValues('suggestedPrompt')}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Suggested Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Generate a prompt by describing what you want the agent to do in the “Description” field on the left."
                    className="min-h-[100px] max-h-[100px] resize-none disabled:opacity-100 disabled:bg-text-50 "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-center gap-4 pt-6">
          <BaseButton type="button" variant="outlined" onClick={onCancel} className="w-[128px]">
            Cancel
          </BaseButton>

          <BaseButton
            type="button"
            variant="outlined"
            onClick={() => {}}
            disabled={isDisabled}
            className={cn(
              'w-[128px]',
              isDisabled
                ? 'bg-text-50  text-text-400 cursor-not-allowed font-normal'
                : 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal',
              isGeneratingPrompt && 'opacity-75 cursor-not-allowed'
            )}
          >
            Insert
          </BaseButton>
        </div>
      </form>
    </Form>
  );
};

export default DescriptionGenerator;
