import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  GenerateNewClusterTokenFormData,
  generateNewClusterTokenFormDefaultValues,
  generateNewClusterTokenFormSchema,
} from './schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { INFO_TYPE } from '@/constants';
import InfoCard from '@/components/InfoCard';
import ModalActionButton from '../../ModalActionButton';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

type GenerateNewClusterTokenModalFormProps = {
  onCancel: () => void;
  onSubmit: (data: GenerateNewClusterTokenFormData, onError?: (value: string) => void) => void;
  isSubmitting: boolean;
};

const GenerateNewClusterTokenModalForm = (props: GenerateNewClusterTokenModalFormProps) => {
  const { onCancel, onSubmit, isSubmitting } = props;

  const form = useForm<GenerateNewClusterTokenFormData>({
    resolver: zodResolver(generateNewClusterTokenFormSchema),
    defaultValues: generateNewClusterTokenFormDefaultValues,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(data => onSubmit(data, value => form.setError('name', { message: value })))}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Key Name</FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter key name"
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
            <div className="rounded-lg flex items-start w-full">
              <InfoCard
                type={INFO_TYPE.info}
                title={'Key generation'}
                content={
                  'After the key has been generated, it can be selected from the “key list” in the connect cluster screen when you connect a cluster.'
                }
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <ModalActionButton
                action="cancel"
                type="button"
                className="md:w-[11.25rem] bg-text-300 hover:bg-text-400"
                onClick={onCancel}
              >
                Cancel
              </ModalActionButton>
              <ModalActionButton
                action="submit"
                disabled={!form.formState.isValid}
                className={cn('md:w-[11.25rem]', isSubmitting && 'opacity-75 cursor-not-allowed')}
              >
                {isSubmitting ? (
                  <LoadingSpinner className="w-full gap-2">
                    <p>Generating key...</p>
                  </LoadingSpinner>
                ) : (
                  <span>Generate</span>
                )}
              </ModalActionButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GenerateNewClusterTokenModalForm;
