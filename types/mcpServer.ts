export type MCPServer = {
  id: string;
  name: string;
  connectionSchema: Record<string, string>;
};

export type MCPServerListResponse = {
  items: MCPServer[];
};
