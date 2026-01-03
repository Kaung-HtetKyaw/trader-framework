export const EnvironmentTypes = {
  sandbox: 'sandbox',
  default: 'default',
} as const;

export type EnvironmentTypeEnum = keyof typeof EnvironmentTypes;
