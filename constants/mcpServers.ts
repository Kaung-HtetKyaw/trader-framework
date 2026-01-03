
export const MCP_SERVER_NAMES = {
  GITHUB: 'github-mcp-server',
  AZURE: 'azure-devops-mcp',
  KUBEGRADE: 'kubegrade-mcp-server',
} as const;

export type MCPServerName = (typeof MCP_SERVER_NAMES)[keyof typeof MCP_SERVER_NAMES];


export const MCP_SERVER_LABELS: Record<string, string> = {
  [MCP_SERVER_NAMES.GITHUB]: 'Github',
  [MCP_SERVER_NAMES.AZURE]: 'Azure DevOps',
  [MCP_SERVER_NAMES.KUBEGRADE]: 'Kubegrade',
};

export const createMCPServerLabel = (name: string): string => {
  if (MCP_SERVER_LABELS[name]) {
    return MCP_SERVER_LABELS[name];
  }
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
