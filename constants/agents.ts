import { BasicAgentIcon } from '@/components/svgs/BasicAgentIcon';
import { DiagnoseAgentIcon } from '@/components/svgs/DiagnoseAgentIcon';
import { UpgradeAgentIcon } from '@/components/svgs/UpgradeAgentIcon';
import { PullRequestAgentIcon } from '@/components/svgs/PullRequestAgentIcon';
import { PromptAgentTypeEnum, PromptAgentTypes } from '@/types/chat';

export type AgentConfig = {
  name: PromptAgentTypeEnum | string;
  label: string;
  defaultCommand: string;
  description: string;
  color: string;
  hexColor: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const AGENT_LABELS: Record<PromptAgentTypeEnum, string> = {
  [PromptAgentTypes.assistant]: 'Assistant',
  [PromptAgentTypes.inspector]: 'Diagnose',
  [PromptAgentTypes.upgrader]: 'Upgrade',
  [PromptAgentTypes.git]: 'Pull Request',
};

export const AGENTS: AgentConfig[] = [
  {
    name: PromptAgentTypes.assistant,
    label: AGENT_LABELS[PromptAgentTypes.assistant],
    defaultCommand: 'Analyse the current selection',
    description:
      'Provide helpful guidance across clusters. Answer technical questions, explain metrics, and support troubleshooting tasks.',
    color: 'text-white',
    hexColor: '#9DD1FF',
    icon: BasicAgentIcon,
  },
  {
    name: PromptAgentTypes.inspector,
    label: AGENT_LABELS[PromptAgentTypes.inspector],
    defaultCommand: 'Identify root causes and check pod status',
    description:
      'Analyze logs, events, and metrics to uncover root causes. Give clear, actionable insights to maintain system stability.',
    color: 'text-white',
    hexColor: '#82C9AC',
    icon: DiagnoseAgentIcon,
  },
  {
    name: PromptAgentTypes.upgrader,
    label: AGENT_LABELS[PromptAgentTypes.upgrader],
    defaultCommand: 'Suggest upgrade plans and strategies',
    description:
      'Recommend safe upgrade paths and flag compatibility risks. Help plan and execute version updates confidently.',
    color: 'text-white',
    hexColor: '#66BBCC',
    icon: UpgradeAgentIcon,
  },
  {
    name: PromptAgentTypes.git,
    label: AGENT_LABELS[PromptAgentTypes.git],
    defaultCommand: 'Help create and summarize pull requests',
    description:
      'Streamline PR creation and summaries. Generate concise overviews, highlight key changes, and improve overall clarity.',
    color: 'text-white',
    hexColor: '#6DB7F8',
    icon: PullRequestAgentIcon,
  },
];

export const getAgentByName = (name: PromptAgentTypeEnum): AgentConfig | undefined => {
  return AGENTS.find(agent => agent.name === name);
};

export const DEFAULT_AGENT_COLOR = '#81A6FE';
