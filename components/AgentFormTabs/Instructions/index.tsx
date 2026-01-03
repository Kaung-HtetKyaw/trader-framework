import ConnectMCPModal, { MCPConnection } from '@/components/modals/ConnectMCPModal';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon } from '@/components/svgs/PlusIcon';
import { BaseButton } from '@/components/ui/base-button';
import { UseFormReturn } from 'react-hook-form';
import { useCallback } from 'react';
import { AgentFormData, OnChangeAgentFormInput } from '..';
import { CustomAgent } from '@/types/agent';
import useStateFromProps from '@/lib/hooks/useStateFromProps';
import PromptBuilderModal from '@/components/modals/PromptBuilderModal';

export type InstructionsProps = {
  agent: CustomAgent | null;
  instruction: string;
  mcpConnections: MCPConnection[];
  onChangeInstruction: (instruction: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<AgentFormData, any, undefined>;
  onChangeInput: OnChangeAgentFormInput;
};

const Instructions = (props: InstructionsProps) => {
  const { agent, mcpConnections: mcpConnectionsProp, form, onChangeInput, onChangeInstruction, instruction } = props;
  const [mcpConnections, setMcpConnections] = useStateFromProps<MCPConnection[]>(mcpConnectionsProp || []);

  const onInsertInstruction = useCallback(
    async (instruction: string) => {
      onChangeInstruction(instruction);
    },
    [onChangeInstruction]
  );

  const handleSaveMCPConnection = useCallback(
    (connection: MCPConnection) => {
      setMcpConnections(prev => {
        const existingIndex = prev.findIndex(c => c.id === connection.id);
        if (existingIndex >= 0) {
          // Update existing connection
          const updated = [...prev];
          updated[existingIndex] = connection;
          return updated;
        }
        // Add new connection
        return [...prev, connection];
      });
    },
    [setMcpConnections]
  );

  const handleRemoveMCPConnection = useCallback(
    (connectionId: string) => {
      setMcpConnections(prev => prev.filter(c => c.id !== connectionId));
    },
    [setMcpConnections]
  );

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h3 className="body-1 font-normal">
          Agent Prompt <span className="text-red-500">*</span>
        </h3>
        <p className="body-1 font-normal text-text-400">
          Build the agent’s prompt by clicking the button below and describing its intended behaviour.
        </p>

        {!!instruction && (
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full flex flex-row items-center gap-1">
              <FormField
                control={form.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe what this agent should do"
                        className="min-h-[100px] max-h-[500px] resize-none"
                        onChange={onChangeInput(field)}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-normal leading-[1.3] text-red-500 mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <PromptBuilderModal onSubmit={onInsertInstruction} />
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <h3>MCP Servers</h3>

        <div className="flex flex-row gap-2">
          <ConnectMCPModal
            agent={agent || null}
            onSave={handleSaveMCPConnection}
            trigger={
              <BaseButton
                variant="outlined"
                className=" w-fit rounded-lg border border-dashed border-text-200 hover:bg-text-50 "
                disabled={!agent?.id}
              >
                <PlusIcon style={{ width: '18px', height: '18px' }} className="text-text-700" />
                <span className="text-text-700">Connect MCP Servers</span>
              </BaseButton>
            }
          />

          {mcpConnections.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {mcpConnections.map(connection => (
                <ConnectMCPModal
                  key={connection.id}
                  agent={agent || null}
                  existingConnection={connection}
                  onSave={handleSaveMCPConnection}
                  onRemove={handleRemoveMCPConnection}
                  trigger={
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-text-200 rounded-lg hover:bg-text-50 cursor-pointer"
                      disabled={!agent?.id}
                    >
                      <span className="text-sm font-medium text-text-950">{connection.serverLabel}</span>
                      <span className="text-sm text-text-500">
                        (
                        {connection.tools.length > 3
                          ? `${connection.tools.slice(0, 3).join(', ')}, ...`
                          : connection.tools.join(', ')}
                        )
                      </span>
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instructions;
