'use client';
import { useCallback, useMemo, useState } from 'react';
import Instructions from './Instructions';
import Overview from './Overview';
import SegmentedTabs, { SegmentedMenuItem } from '../SegmentedTabs';
import { CustomAgent } from '@/types/agent';
import { Form } from '../ui/form';
import { useCreateAgentMutation, useUpdateAgentMutation } from '@/store/api/agentApi';
import { BaseApiResponse } from '@/types';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import { CustomToast } from '../CustomToast';
import { useRouter } from 'next/navigation';
import { getCustomAgentDetailsPath } from '@/app/(root)/agents/urls';
import { z } from 'zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalActionButton from '../modals/ModalActionButton';
import LoadingSpinner from '../LoadingSpinner';
import { cn } from '@/lib/utils';
import useStateFromProps from '@/lib/hooks/useStateFromProps';
import useFormDraft from '@/lib/hooks/useFormDraft';
import { useGetListMCPServersQuery } from '@/store/api/mcpServerApi';
import { createMCPServerLabel } from '@/constants/mcpServers';
import { MCPConnection } from '../modals/ConnectMCPModal';
import { CustomAgentRegisteredMCPClient } from '@/types/agent/mcp';

export const AgentFormTabsSteps = {
  overview: 'overview',
  instructions: 'instructions',
  scheduling: 'scheduling',
} as const;
export type AgentFormTabsStepEnum = keyof typeof AgentFormTabsSteps;

export type AgentFormTabsProps = {
  agent: CustomAgent | null;
};

const schema = z.object({
  name: z.string().min(1, 'Please enter an agent name to continue.'),
  instruction: z.string().min(1, 'Please enter an agent prompt to continue.'),
  description: z.string().max(500, `Description must be less than ${500} characters.`),
});

export type AgentFormData = z.infer<typeof schema>;

export const CREATE_AGENT_DRAFT_KEY = 'create-agent-draft';
// TODO: add registeredMCPClients to the draft if create flow needs mcp client connection right away
export type AgentDraft = {
  id: string;
  name: string;
  description: string;
  instruction: string;
  lastUpdatedAt: string;
  ownedBy: string;
};

export type OnChangeAgentFormInput = <TFieldName extends keyof AgentFormData>(
  field: ControllerRenderProps<AgentFormData, TFieldName>
) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

const AgentFormTabs = (props: AgentFormTabsProps) => {
  const { agent } = props;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AgentFormTabsStepEnum>(AgentFormTabsSteps.overview);
  // NOTE: this is a temp state to instantly reflect the insertiong from prompt builder
  const [instruction, setInstruction] = useStateFromProps<string>(agent?.instruction || '');

  const form = useForm<AgentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: agent?.name || '',
      description: agent?.description || '',
      instruction: agent?.instruction || '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { clearDraft, setDraftByFieldName } = useFormDraft({
    key: CREATE_AGENT_DRAFT_KEY,
    enabled: !agent,
    onDraftReady: draft => {
      form.reset(draft);
      setInstruction(draft.instruction);
    },
    getValues: () => ({
      ...form.getValues(),
      lastUpdatedAt: new Date().toISOString(),
      // TODO: this could be user id , user name or a whole object of user, revisit this after BE is ready
      ownedBy: 'You',
    }),
  });

  const [createAgent, { isLoading: isCreatingAgent }] = useCreateAgentMutation();
  const [updateAgent, { isLoading: isUpdatingAgent }] = useUpdateAgentMutation();

  const { data: mcpServersData, isLoading: isLoadingServers } = useGetListMCPServersQuery();

  const mcpServers = useMemo(() => {
    if (!mcpServersData) return [];

    return mcpServersData.map(server => ({
      label: createMCPServerLabel(server.name),
      value: server.name,
      id: server.id,
      connectionSchema: server.connectionSchema,
    }));
  }, [mcpServersData]);

  const getMcpConnectionFromRegisteredMCPClient = useCallback(
    (registeredMCPClient: CustomAgentRegisteredMCPClient) => {
      const server = mcpServers.find(server => server.id === registeredMCPClient.mcpServerID);
      if (!server) return null;

      return {
        id: `${registeredMCPClient.mcpServerID}-${registeredMCPClient.allowedTools.join(',')}`,
        serverID: registeredMCPClient.mcpServerID,
        server: server.value,
        serverLabel: server.label,
        tools: registeredMCPClient.allowedTools,
      };
    },
    [mcpServers]
  );

  const mcpConnections: MCPConnection[] = useMemo(() => {
    if (!mcpServers) return [];

    const registeredMCPClients = agent?.mcpClientConfigs || [];

    return registeredMCPClients.map(getMcpConnectionFromRegisteredMCPClient).filter(el => !!el);
  }, [mcpServers, agent?.mcpClientConfigs, getMcpConnectionFromRegisteredMCPClient]);

  const isLoading = useMemo(
    () => isCreatingAgent || isUpdatingAgent || isLoadingServers,
    [isCreatingAgent, isUpdatingAgent, isLoadingServers]
  );
  const isDisabled = useMemo(() => !form.formState.isValid || isLoading, [form.formState.isValid, isLoading]);

  const menus: SegmentedMenuItem[] = useMemo(() => {
    return [
      {
        label: AgentFormTabsSteps.overview,
        isActive: () => activeTab === AgentFormTabsSteps.overview,
        onClick: () => setActiveTab(AgentFormTabsSteps.overview),
      },
      {
        label: AgentFormTabsSteps.instructions,
        isActive: () => activeTab === AgentFormTabsSteps.instructions,
        onClick: () => setActiveTab(AgentFormTabsSteps.instructions),
      },
      // TODO: add scheduling tab
    ];
  }, [activeTab]);

  const onChangeInput: OnChangeAgentFormInput = useCallback(
    field => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      field.onChange(value);
      setDraftByFieldName(field.name, value);
    },
    [setDraftByFieldName]
  );

  const onChangeInstruction = useCallback(
    (instruction: string) => {
      setInstruction(instruction);
      form.setValue('instruction', instruction, { shouldValidate: true });
      setDraftByFieldName('instruction', instruction);
    },
    [form, setInstruction, setDraftByFieldName]
  );

  const onCreateOverview = useCallback(
    async (values: AgentFormData) => {
      const response = await createAgent({
        name: values.name,
        description: values.description,
        instruction: values.instruction,
        // TODO: this should be added after MCP client connection is implemented
        registeredMCPClients: [],
      });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        notify(error.errorMessage);
        return { success: false, error: error.errorMessage };
      }

      CustomToast({
        type: 'success',
        message: 'Agent has been created successfully!',
      });

      clearDraft();

      router.push(getCustomAgentDetailsPath(response?.data?.agentID || ''));
      return response;
    },
    [createAgent, router, clearDraft]
  );

  const onUpdateOverview = useCallback(
    async (values: AgentFormData) => {
      const response = await updateAgent({
        agentID: agent?.id || '',
        name: agent?.name || '',
        description: values.description,
        instruction: values.instruction,
      });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        notify(error.errorMessage);
        return { success: false, error: error.errorMessage };
      }

      CustomToast({
        type: 'success',
        message: 'Agent has been updated successfully!',
      });

      clearDraft();

      return response;
    },
    [updateAgent, agent, clearDraft]
  );

  const handleSubmite = useCallback(
    async (values: AgentFormData) => {
      // TODO: remove the type cast after BE is ready
      if (agent) {
        return onUpdateOverview(values) as unknown as Promise<BaseApiResponse<null>>;
      } else {
        return onCreateOverview(values) as unknown as Promise<BaseApiResponse<null>>;
      }
    },
    [agent, onCreateOverview, onUpdateOverview]
  );

  return (
    <SegmentedTabs menus={menus}>
      <div className="flex flex-col gap-6 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => handleSubmite(data))} className="flex flex-col gap-4 w-full">
            {activeTab === AgentFormTabsSteps.overview && (
              <Overview form={form} onChangeInput={onChangeInput} isDraft={!agent} />
            )}

            {activeTab === AgentFormTabsSteps.instructions && (
              <Instructions
                agent={agent || null}
                mcpConnections={mcpConnections}
                instruction={instruction}
                onChangeInput={onChangeInput}
                onChangeInstruction={onChangeInstruction}
                form={form}
              />
            )}

            <div className="flex items-center justify-start pt-12">
              <ModalActionButton
                action="submit"
                className={cn(
                  'md:w-[120px]',
                  isDisabled
                    ? 'bg-text-50  text-text-400 cursor-not-allowed font-normal'
                    : 'bg-secondary-500 text-white hover:bg-secondary-600 cursor-pointer font-normal',
                  isLoading && 'opacity-75 cursor-not-allowed'
                )}
                disabled={isDisabled}
              >
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
      </div>
    </SegmentedTabs>
  );
};

export default AgentFormTabs;
