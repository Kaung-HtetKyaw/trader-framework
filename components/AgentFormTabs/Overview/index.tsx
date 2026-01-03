import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DefaultCustomAgentIcon from '@/components/svgs/DefaultCustomAgentIcon';
import { AgentFormData, OnChangeAgentFormInput } from '../index';
import { cn } from '@/lib/utils';

export type OverviewProps = {
  isDraft: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<AgentFormData, any, undefined>;
  onChangeInput: OnChangeAgentFormInput;
};

const Overview = (props: OverviewProps) => {
  const { form, isDraft, onChangeInput } = props;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className=" min-w-[260px] w-fit px-4 py-3 rounded-lg border border-text-100 flex flex-row gap-10 justify-between">
          <div className=" flex flex-row gap-[10px] ">
            <div className="relative w-12 h-12">
              <div className="bg-[#81A6FE] flex items-center justify-center w-12 h-12 rounded-lg">
                <DefaultCustomAgentIcon className="w-[22px] h-[22px]" />
              </div>
            </div>

            <div className="flex flex-row">
              <div className="flex flex-col gap-1 justify-center items-start">
                <p className="body-1 font-bold text-text-900">{form.getValues('name') || 'Untitled Agent'}</p>
                <p className="body-2 text-text-600">by You</p>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'h-[18px] flex items-center justify-center px-[6px] py-[2px] rounded-[4px]',
              isDraft ? 'bg-text-50' : 'bg-secondary-100'
            )}
          >
            <span className={cn('body-2', !isDraft && 'text-secondary-600')}>{isDraft ? 'Draft' : 'Published'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required className="text-sm font-normal leading-[1.2] text-text-950">
                  Agent Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Agent Name" {...field} onChange={onChangeInput(field)} />
                </FormControl>
                <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal leading-[1.2] text-text-950">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this agent does"
                    className="min-h-[120px] max-h-[160px] resize-none"
                    {...field}
                    onChange={onChangeInput(field)}
                  />
                </FormControl>
                <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
