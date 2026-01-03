import { z, ZodType } from 'zod';

export const RequestedFeatures = {
  Rightsizing: 'Rightsizing',
  Monitoring: 'Monitoring',
  Security: 'Security',
  Compliance: 'Compliance',
  ['AI Assistant']: 'AI Assistant',
} as const;
export type RequestedFeatureEnum = keyof typeof RequestedFeatures;

export type GenerateNewClusterTokenFormData = {
  name: string;
};

export const generateNewClusterTokenFormDefaultValues: GenerateNewClusterTokenFormData = {
  name: '',
};

export const MAX_CLUSTER_TOKEN_NAME_LENGTH = 50;
export const generateNewClusterTokenFormSchema: ZodType<GenerateNewClusterTokenFormData> = z.object({
  name: z
    .string()
    .min(1, 'Please enter a key name.')
    .max(MAX_CLUSTER_TOKEN_NAME_LENGTH, `Key name must be less than ${MAX_CLUSTER_TOKEN_NAME_LENGTH} characters.`),
});
