import { Agent, CustomAgent } from '@/types/agent';
import DefaultCustomAgentIcon from '../svgs/DefaultCustomAgentIcon';
import ClockLineIcon from '../svgs/ClockLineIcon';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DEFAULT_AGENT_COLOR } from '@/constants/agents';

export type AgentOverviewCardProps = {
  agent: CustomAgent | Agent;
  type: 'custom' | 'built-in';
  isDraft?: boolean;
};

const AgentOverviewCard = (props: AgentOverviewCardProps) => {
  const { agent, type, isDraft } = props;

  return (
    <div className="h-full min-h-[180px] flex flex-col justify-between bg-white border border-border-100 rounded-lg p-5 hover:bg-secondary-50 transition-colors cursor-pointer">
      <div>
        <div className="flex items-start gap-3 mb-3">
          {type === 'built-in' && (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: agent.hexColor }}
            >
              <agent.icon className="w-5 h-5 text-white" />
            </div>
          )}
          {type === 'custom' && (
            <div
              style={{ backgroundColor: agent.hexColor || DEFAULT_AGENT_COLOR }}
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            >
              <DefaultCustomAgentIcon className=" text-white" />
            </div>
          )}

          <div className="w-full flex flex-row justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-950 capitalize">{agent.name}</h3>
              <p className="text-sm text-text-500 max-w-[200px] truncate">
                {type === 'custom' ? 'by' : ''} {agent.ownedBy}
              </p>
            </div>

            {type === 'custom' && (
              <div
                className={cn(
                  'h-[18px] flex items-center justify-center px-[6px] py-[2px] rounded-[4px]',
                  isDraft ? 'bg-text-50' : 'bg-secondary-100'
                )}
              >
                <span className={cn('body-2', isDraft ? 'text-text-500' : 'text-secondary-600')}>
                  {isDraft ? 'Draft' : 'Published'}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-text-600 mb-4 line-clamp-3">{agent.description}</p>
      </div>

      {agent.updatedAt && (
        <p className="text-xs text-text-400 flex items-center gap-1">
          <ClockLineIcon className="w-3 h-3" />
          Last updated {format(new Date(agent.updatedAt), 'MMM dd, yyyy')}
        </p>
      )}
    </div>
  );
};

export default AgentOverviewCard;
