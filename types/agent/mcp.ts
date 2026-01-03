export type RegisterMCPClientPayload<T extends Record<string, unknown>> = {
  mcpServerID: string;
  connectionConfig: T;
};

export type RegisterMCPClientResponse = {
  registerID: string;
  tools: string[];
};

export type AddMCPClientPayload = {
  agentID: string;
  registeredMCPClients: RegisteredMCPClientPayload[];
};

export type RemoveMCPClientPayload = {
  agentID: string;
  mcpServerIDs?: string[];
};

export type RegisteredMCPClient = {
  registerID: string;
  tools: string[];
};

export type CustomAgentRegisteredMCPClient = {
  mcpServerID: string;
  allowedTools: string[];
};

export type RegisteredMCPClientPayload = {
  registerID: string;
  selectedTools: string[];
};

export type MCPTool = {
  name: string;
  _meta?: Meta | null;
  description?: string;
  inputSchema?: ToolInputSchema;
  rawInputSchema?: string; // json.RawMessage as raw JSON string
  outputSchema?: ToolOutputSchema;
  rawOutputSchema?: string; // json.RawMessage as raw JSON string
  annotations?: ToolAnnotation;
};

//* NOTE: These types are taken from Bifrost `tools.go` and converted to TypeScript types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProgressToken = any;

type Meta = {
  progressToken?: ProgressToken;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // AdditionalFields
};

type ToolArgumentsSchema = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $defs?: Record<string, any>;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>;
  required?: string[];
};

type ToolInputSchema = ToolArgumentsSchema;
type ToolOutputSchema = ToolArgumentsSchema;

type ToolAnnotation = {
  title?: string;
  readOnlyHint?: boolean | null;
  destructiveHint?: boolean | null;
  idempotentHint?: boolean | null;
  openWorldHint?: boolean | null;
};
