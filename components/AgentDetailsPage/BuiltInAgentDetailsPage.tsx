'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BaseButton } from '@/components/ui/base-button';
import ClockLineIcon from '@/components/svgs/ClockLineIcon';
import { useUpdateCustomInstructionMutation } from '@/store/api/agentApi';
import { CustomToast } from '@/components/CustomToast';
import { getDefaultErrorMessageByErrorCode, notifyErrorFromResponse } from '@/lib/utils/error';
import { useAgents } from '@/lib/hooks/useAgents';
import LoadingSpinner from '../LoadingSpinner';
import EmptyAgentDetails from './EmptyAgentDetails';

const customInstructionSchema = z.object({
  customInstruction: z.string(),
});

type CustomInstructionFormData = z.infer<typeof customInstructionSchema>;

const BuiltInAgentDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const {
    buildInAgents: { data, isLoading },
  } = useAgents({ type: 'built-in' });
  const [updateCustomInstruction, { isLoading: isUpdating }] = useUpdateCustomInstructionMutation();

  const agent = useMemo(() => data.find(agent => agent.name === agentId), [data, agentId]);

  const IconComponent = useMemo(() => agent?.icon || null, [agent?.icon]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CustomInstructionFormData>({
    resolver: zodResolver(customInstructionSchema),
    defaultValues: {
      customInstruction: '',
    },
  });

  useEffect(() => {
    if (agent?.customInstruction !== undefined) {
      reset({
        customInstruction: agent.customInstruction || '',
      });
    }
  }, [agent?.customInstruction, reset]);

  const onSubmit = async (data: CustomInstructionFormData) => {
    if (!agent) return;

    const response = await updateCustomInstruction({
      agentName: agent.name,
      instruction: data.customInstruction,
    });

    const { error } = notifyErrorFromResponse(response);

    if (error) {
      CustomToast({
        type: 'error',
        message: error.errorMessage || getDefaultErrorMessageByErrorCode(error.errorCode),
      });
      return;
    }

    reset({
      customInstruction: data.customInstruction,
    });

    CustomToast({
      type: 'success',
      message: 'Custom instruction has been successfully updated!',
    });
  };

  const handleCancel = () => {
    reset();
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!agent) {
    return <EmptyAgentDetails />;
  }

  return (
    <div className="h-full flex flex-col bg-background-50 overflow-auto p-4">
      <div className="flex-1 bg-white rounded-lg p-8">
        <div className="flex flex-col gap-6 max-w-4xl">
          <section>
            <h2 className="text-sm font-semibold text-text-950 mb-3">Overview</h2>
            <div className="border rounded-lg border-border-100 p-3 inline-block mb-4 w-[30%]">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: agent?.hexColor }}
                >
                  {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-950">{agent?.label}</h3>
                  <p className="text-sm text-text-600 font-normal">{agent?.ownedBy}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-900 font-normal leading-relaxed">{agent?.description}</p>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-text-950 mb-1">Instructions</h2>
            <div className="bg-white rounded-lg inline-block">
              <p className="text-sm text-text-900 font-normal">{agent?.builtInInstruction}</p>
            </div>
          </section>

          <form onSubmit={handleSubmit(onSubmit)}>
            <section>
              <h2 className="text-sm font-semibold text-text-950 mb-3">Custom Instructions</h2>
              <div className="bg-white rounded-lg border border-border-100 p-5 w-full">
                <textarea
                  {...register('customInstruction')}
                  placeholder="Describe what this agent should do"
                  className="w-full min-h-[100px] resize-none border-0 focus:outline-none text-sm text-text-900 placeholder:text-text-400 font-normal"
                />
              </div>
            </section>

            <div className="w-full flex justify-start items-center gap-3 mt-2">
              <BaseButton
                type="submit"
                disabled={isUpdating || !isDirty}
                className="px-4 py-2 font-normal rounded-md transition bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </BaseButton>
              <BaseButton
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 font-normal rounded-md transition bg-white text-text-600 border border-text-200 hover:bg-text-50 cursor-pointer"
              >
                Cancel
              </BaseButton>
              <p className="text-xs text-text-500 flex items-center gap-1">
                <ClockLineIcon className="w-3 h-3 text-text-500" />
                Last updated {format(new Date(agent.updatedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuiltInAgentDetailsPage;
