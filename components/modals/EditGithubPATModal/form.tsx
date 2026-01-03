import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ModalActionButton from '../ModalActionButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export const EditGithubPATSchema = z.object({
  token: z.string().min(1, 'Please enter a token'),
});

export type EditGithubPATFormData = z.infer<typeof EditGithubPATSchema>;

export type EditGithubPATFormProps = {
  defaultValues: EditGithubPATFormData;
  previousToken?: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: EditGithubPATFormData, onError?: (error: string) => void) => void;
};

const EditGithubPATForm = ({
  defaultValues = { token: '' },
  previousToken,
  isLoading,
  onClose,
  onSubmit,
}: EditGithubPATFormProps) => {
  const form = useForm<EditGithubPATFormData>({
    resolver: zodResolver(EditGithubPATSchema),
    defaultValues: {
      token: defaultValues.token,
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => onSubmit(data, error => form.setError('token', { message: error })))}
        className="flex flex-col justify-start items-start gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Token Value</FormLabel>

              <FormControl>
                <Input {...field} placeholder="Please enter the new PAT" />
              </FormControl>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="h-9 px-4 bg-text-50 rounded-md outline outline-1 outline-text-50 outline-offset-[-1px] flex items-center w-full text-text-950 text-sm font-normal leading-[16.8px]">
          {previousToken}
        </div>
        <div className="w-full flex gap-3 px-10">
          <ModalActionButton action="cancel" onClick={onClose}>
            Cancel
          </ModalActionButton>

          <ModalActionButton action="submit" type="submit" disabled={!form.formState.isValid}>
            {isLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Saving...</p>
              </LoadingSpinner>
            ) : (
              <span>Save Changes</span>
            )}
          </ModalActionButton>
        </div>
      </form>
    </Form>
  );
};

export default EditGithubPATForm;
