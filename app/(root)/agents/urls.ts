export const AGENT_PATHNAME = '/agents';

export const CREATE_AGENT_PATHNAME = `${AGENT_PATHNAME}/create`;

export const BUILT_IN_AGENT_PATHNAME = `${AGENT_PATHNAME}/built-in`;
export const CUSTOM_AGENT_PATHNAME = `${AGENT_PATHNAME}/custom`;

export const getBuiltInAgentDetailsPath = (agentName: string) => {
  return `${BUILT_IN_AGENT_PATHNAME}/${agentName}`;
};

export const getCustomAgentDetailsPath = (agentName: string) => {
  return `${CUSTOM_AGENT_PATHNAME}/${agentName}`;
};

export const getCustomAgentDraftPath = () => {
  return `${CUSTOM_AGENT_PATHNAME}/draft`;
};
