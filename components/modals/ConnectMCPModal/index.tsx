'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseButton } from '@/components/ui/base-button';
import { useState, ReactNode, useMemo, useCallback } from 'react';
import DatabaseIcon from '@/components/svgs/DatabaseIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import KubegradeConnectionForm, { KubegradeConnectionFormData } from './forms/KubegradeConnectionForm';
import GithubConnectionForm, { GithubConnectionFormData } from './forms/GithubConnectionForm';
import AzureConnectionForm, { AzureConnectionFormData } from './forms/AzureConnectionForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CustomToast } from '@/components/CustomToast';
import {
  useGetListMCPServersQuery,
  useRegisterMCPClientMutation,
  useAddMCPClientToAgentMutation,
  useRemoveMCPClientFromAgentMutation,
} from '@/store/api/mcpServerApi';
import { createMCPServerLabel, MCP_SERVER_NAMES } from '@/constants/mcpServers';
import { RegisteredMCPClient } from '@/types/agent/mcp';
import { CustomAgent } from '@/types/agent';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';

const mcpConnectionSchema = z.object({
  server: z.string().min(1, 'MCP Server is required'),
  serverLabel: z.string().min(1, 'Server label is required'),
  tools: z.array(z.string()).min(1, 'At least one tool must be selected'),
  isConnected: z.boolean(),
});

type MCPConnectionFormData = z.infer<typeof mcpConnectionSchema>;

export type MCPConnection = {
  id: string;
  serverID: string;
  server: string;
  serverLabel: string;
  tools: string[];
  registerID?: string;
};

type ConnectMCPModalProps = {
  trigger?: ReactNode;
  agent: CustomAgent | null;
  onSave?: (connection: MCPConnection) => void;
  onRemove?: (connectionId: string) => void;
  existingConnection?: MCPConnection;
};

const ConnectMCPModal = ({
  trigger,
  agent,
  onSave: onSaveProp,
  onRemove: onRemoveProp,
  existingConnection,
}: ConnectMCPModalProps) => {
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [registeredClient, setRegisteredClient] = useState<RegisteredMCPClient | null>(null);
  const isEditMode = !!existingConnection;

  const { data: mcpServersData, isLoading: isLoadingServers } = useGetListMCPServersQuery();
  const [registerMCPClient, { isLoading: isRegisteringMCPClient }] = useRegisterMCPClientMutation();
  const [addMCPClientToAgent, { isLoading: isAddingMCPClientToAgent }] = useAddMCPClientToAgentMutation();
  const [removeMCPClientFromAgent] = useRemoveMCPClientFromAgentMutation();

  const agentID = useMemo(() => agent?.id || null, [agent]);

  const mcpServers = useMemo(() => {
    if (!mcpServersData) return [];

    return mcpServersData.map(server => ({
      label: createMCPServerLabel(server.name),
      value: server.name,
      id: server.id,
      connectionSchema: server.connectionSchema,
    }));
  }, [mcpServersData]);

  const form = useForm<MCPConnectionFormData>({
    resolver: zodResolver(mcpConnectionSchema),
    defaultValues: {
      server: '',
      serverLabel: '',
      tools: [],
      isConnected: false,
    },
  });

  const { watch, setValue, reset } = form;
  const watchedTools = watch('tools');
  const watchedServer = watch('server');
  const watchedIsConnected = watch('isConnected');

  const selectedServerData = useMemo(() => {
    return mcpServers.find(server => server.value === watchedServer);
  }, [mcpServers, watchedServer]);

  // Compute tools from registered client response
  const availableTools = useMemo(() => {
    if (registeredClient?.tools) {
      return registeredClient.tools.map(tool => ({
        label: tool,
        value: tool,
        // description: tool.description,
      }));
    }
    return [];
  }, [registeredClient]);

  const handleKubegradeConnect = async (data: KubegradeConnectionFormData) => {
    if (!selectedServerData?.id) return;

    try {
      const response = await registerMCPClient({
        mcpServerID: selectedServerData.id,
        connectionConfig: { configuration: data.configuration },
      }).unwrap();

      setRegisteredClient(response);
      setValue('isConnected', true);
      CustomToast({ type: 'success', message: 'Kubegrade MCP Server connected successfully!' });
    } catch (error) {
      console.error('Failed to connect Kubegrade:', error);
      CustomToast({ type: 'error', message: 'Failed to connect to Kubegrade MCP Server' });
    }
  };

  const handleGithubConnect = async (data: GithubConnectionFormData) => {
    if (!selectedServerData?.id) return;

    try {
      const response = await registerMCPClient({
        mcpServerID: selectedServerData.id,
        connectionConfig: { personalAccessToken: data.token },
      }).unwrap();

      setRegisteredClient(response);
      setValue('isConnected', true);
      CustomToast({ type: 'success', message: 'Github MCP Server connected successfully!' });
    } catch (error) {
      console.error('Failed to connect Github:', error);
      CustomToast({ type: 'error', message: 'Failed to connect to Github MCP Server' });
    }
  };

  const handleAzureConnect = async (data: AzureConnectionFormData) => {
    if (!selectedServerData?.id) return;

    try {
      const response = await registerMCPClient({
        mcpServerID: selectedServerData.id,
        connectionConfig: {
          organizationName: data.organizationName,
          personalAccessToken: data.personalAccessToken,
        },
      }).unwrap();

      setRegisteredClient(response);
      setValue('isConnected', true);
      CustomToast({ type: 'success', message: 'Azure DevOps MCP Server connected successfully!' });
    } catch (error) {
      console.error('Failed to connect Azure:', error);
      CustomToast({ type: 'error', message: 'Failed to connect to Azure DevOps MCP Server' });
    }
  };

  const handleSave = useCallback(async () => {
    if (!agentID) {
      CustomToast({ type: 'error', message: 'Failed to add MCP client to agent' });
      return;
    }

    const formData = form.getValues();

    // Validate that we have registerID before saving
    if (!registeredClient?.registerID) {
      CustomToast({ type: 'error', message: 'Please connect to MCP server first' });
      return;
    }

    try {
      // Call the API to add MCP client to agent
      await addMCPClientToAgent({
        agentID,
        registeredMCPClients: [
          {
            registerID: registeredClient.registerID,
            selectedTools: formData.tools,
          },
        ],
      }).unwrap();

      CustomToast({ type: 'success', message: 'MCP client added to agent successfully!' });

      // Call the parent callback if provided
      if (onSaveProp) {
        const connection: MCPConnection = {
          id: existingConnection?.id || `${formData.server}-${Date.now()}`,
          serverID: existingConnection?.serverID || '',
          server: formData.server,
          serverLabel: formData.serverLabel,
          tools: formData.tools,
          registerID: registeredClient.registerID,
        };
        onSaveProp(connection);
      }

      setOpen(false);
    } catch (error) {
      console.error('Failed to add MCP client to agent:', error);
      CustomToast({ type: 'error', message: 'Failed to add MCP client to agent' });
    }
  }, [agentID, onSaveProp, existingConnection, registeredClient, form, addMCPClientToAgent]);

  const handleUpdateConnection = useCallback(async () => {
    if (!agentID) {
      CustomToast({ type: 'error', message: 'Failed to add MCP client to agent' });
      return;
    }

    const formData = form.getValues();

    // Validate that we have registerID before saving
    if (!registeredClient?.registerID) {
      CustomToast({ type: 'error', message: 'Please connect to MCP server first' });
      return;
    }

    if (!existingConnection?.serverID) {
      CustomToast({ type: 'error', message: 'Related MCP server not found' });
      return;
    }

    try {
      await removeMCPClientFromAgent({
        agentID,
        mcpServerIDs: [existingConnection?.serverID || ''],
      }).unwrap();

      // Call the API to add MCP client to agent
      await addMCPClientToAgent({
        agentID,
        registeredMCPClients: [
          {
            registerID: registeredClient.registerID,
            selectedTools: formData.tools,
          },
        ],
      }).unwrap();

      CustomToast({ type: 'success', message: 'MCP client added to agent successfully!' });

      // Call the parent callback if provided
      if (onSaveProp) {
        const connection: MCPConnection = {
          id: existingConnection?.id || `${formData.server}-${Date.now()}`,
          serverID: existingConnection?.serverID || '',
          server: formData.server,
          serverLabel: formData.serverLabel,
          tools: formData.tools,
          registerID: registeredClient.registerID,
        };
        onSaveProp(connection);
      }

      setOpen(false);
    } catch (error) {
      console.error('Failed to add MCP client to agent:', error);
      CustomToast({ type: 'error', message: 'Failed to add MCP client to agent' });
    }
  }, [agentID, onSaveProp, existingConnection, registeredClient, form, addMCPClientToAgent, removeMCPClientFromAgent]);

  const handleRemove = async () => {
    if (!agentID) {
      CustomToast({ type: 'error', message: 'Failed to remove MCP client from agent' });
      return;
    }

    if (!existingConnection?.serverID) {
      CustomToast({ type: 'error', message: 'Related MCP server not found' });
      return;
    }

    try {
      await removeMCPClientFromAgent({
        agentID,
        mcpServerIDs: [existingConnection.serverID],
      }).unwrap();

      onRemoveProp?.(existingConnection.id);

      CustomToast({ type: 'success', message: 'MCP client removed from agent successfully!' });
    } catch (error) {
      console.error('Failed to remove MCP client from agent:', error);
      CustomToast({ type: 'error', message: 'Failed to remove MCP client from agent' });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setHasChanges(false);
      setRegisteredClient(null);
      if (existingConnection) {
        reset({
          server: existingConnection.server,
          serverLabel: existingConnection.serverLabel,
          tools: existingConnection.tools,
          isConnected: true,
        });
      } else {
        reset({
          server: '',
          serverLabel: '',
          tools: [],
          isConnected: false,
        });
      }
    }
  };

  const handleSelectServer = (value: string, label: string) => {
    setValue('server', value);
    setValue('serverLabel', label);
    setValue('tools', []);
    setValue('isConnected', false);
    setRegisteredClient(null);
  };

  const handleToolsChange = (values: string[]) => {
    setValue('tools', values);
    // Track changes if in edit mode
    if (isEditMode && existingConnection) {
      const originalTools = existingConnection.tools.slice().sort().join(',');
      const newTools = values.slice().sort().join(',');
      setHasChanges(originalTools !== newTools);
    }
  };

  // Render different forms based on selected MCP server
  const renderServerForm = () => {
    switch (watchedServer) {
      case MCP_SERVER_NAMES.KUBEGRADE:
        return <KubegradeConnectionForm isConnecting={isRegisteringMCPClient} onConnect={handleKubegradeConnect} />;
      case MCP_SERVER_NAMES.GITHUB:
        return <GithubConnectionForm isConnecting={isRegisteringMCPClient} onConnect={handleGithubConnect} />;
      case MCP_SERVER_NAMES.AZURE:
        return <AzureConnectionForm isConnecting={isRegisteringMCPClient} onConnect={handleAzureConnect} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTitle className="sr-only">Connect MCP server</DialogTitle>
      <DialogTrigger asChild>
        {trigger || (
          <BaseButton variant="outlined" className="rounded-lg">
            Connect MCP server
          </BaseButton>
        )}
      </DialogTrigger>

      <DialogContent
        className="bg-white w-[640px] max-w-none p-8 rounded-xl flex flex-col gap-6 [&>button]:focus:ring-0 [&>button]:focus-visible:ring-0 [&>button]:focus-visible:ring-offset-0"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col gap-[14px]">
          <DialogTitle className="font-semibold text-text-950 text-center flex flex-col gap-2 items-center title-1">
            <DatabaseIcon className="w-12 h-12 text-secondary-500 " />
            <span className="text-[1.375rem] font-bold">Connect MCP Server</span>
          </DialogTitle>
          <p className="text-center text-text-500 body-1 font-normal leading-[1.2]">
            Choose a server and configure the tools you want to enable for this agent.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-950">MCP Server</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full h-11 px-3 py-2 bg-white border border-text-200 rounded-md flex items-center justify-between text-sm hover:bg-text-50 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <span className={watch('serverLabel') ? 'text-text-950' : 'text-text-500'}>
                    {watch('serverLabel') || 'Select MCP Server'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-white border border-text-200 rounded-md shadow-md p-1">
                {isLoadingServers ? (
                  <div className="px-3 py-2 text-sm text-text-500">Loading servers...</div>
                ) : mcpServers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-text-500">No servers available</div>
                ) : (
                  mcpServers.map(server => (
                    <DropdownMenuItem
                      key={server.value}
                      onSelect={() => handleSelectServer(server.value, server.label)}
                      className="cursor-pointer px-3 py-2 text-sm text-text-950 hover:bg-primary-50 rounded-sm"
                    >
                      {server.label}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {watchedServer && renderServerForm()}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-950">Tools</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={!watchedIsConnected || !registeredClient}>
                <button
                  className={cn(
                    'w-full h-11 px-3 py-2 bg-white border border-text-200 rounded-md flex items-center justify-between text-sm hover:bg-text-50 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
                    (!watchedIsConnected || !registeredClient) && 'opacity-50 cursor-not-allowed bg-text-50'
                  )}
                  disabled={!watchedIsConnected}
                >
                  <span className={watchedTools.length > 0 ? 'text-text-950' : 'text-text-500'}>
                    {watchedTools.length === 0
                      ? 'Select Tools'
                      : watchedTools.length <= 3
                        ? watchedTools
                            .map(value => availableTools.find(t => t.value === value)?.label)
                            .filter(Boolean)
                            .join(', ')
                        : `${watchedTools.length} tools selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={false}
                className="w-[--radix-dropdown-menu-trigger-width] bg-white border border-text-200 rounded-md shadow-md p-4 min-h-[110px] max-h-[110px] overflow-y-auto"
              >
                <div className="flex flex-col gap-3">
                  {availableTools.map(tool => (
                    <div key={tool.value} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        id={`tool-${tool.value}`}
                        checked={watchedTools.includes(tool.value)}
                        onCheckedChange={() => {
                          if (watchedTools.includes(tool.value)) {
                            handleToolsChange(watchedTools.filter(v => v !== tool.value));
                          } else {
                            handleToolsChange([...watchedTools, tool.value]);
                          }
                        }}
                        className="w-[1.125rem] h-[1.125rem] border border-text-200 rounded-[4px] data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50 shadow-none focus:shadow-none"
                      />
                      <label
                        htmlFor={`tool-${tool.value}`}
                        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
                      >
                        <span className="body-1 capitalize text-text-950">{tool.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-row gap-3 justify-center mt-2">
          {isEditMode ? (
            <>
              <BaseButton
                variant="outlined"
                className="w-[200px] rounded-lg border-red-500 text-red-500 hover:bg-red-50"
                onClick={handleRemove}
              >
                <span>Remove Connection</span>
              </BaseButton>
              <BaseButton
                variant="contained"
                className="w-[200px] rounded-lg"
                onClick={handleUpdateConnection}
                disabled={!hasChanges || !watchedServer || watchedTools.length === 0}
              >
                {isAddingMCPClientToAgent ? (
                  <LoadingSpinner className="w-full gap-2">
                    <p>Saving...</p>
                  </LoadingSpinner>
                ) : (
                  <span>Save</span>
                )}
              </BaseButton>
            </>
          ) : (
            <>
              <BaseButton variant="outlined" className="w-[200px] rounded-lg" onClick={handleCancel}>
                Cancel
              </BaseButton>
              <BaseButton
                variant="contained"
                className="w-[200px] rounded-lg"
                onClick={handleSave}
                disabled={!watchedServer || watchedTools.length === 0}
              >
                {isAddingMCPClientToAgent ? (
                  <LoadingSpinner className="w-full gap-2">
                    <p>Adding...</p>
                  </LoadingSpinner>
                ) : (
                  <span>Connect</span>
                )}
              </BaseButton>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectMCPModal;
