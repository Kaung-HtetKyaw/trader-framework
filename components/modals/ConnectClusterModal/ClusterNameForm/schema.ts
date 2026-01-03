import { z } from 'zod';

export const clusterNameFormSchema = z.object({
  clusterName: z
    .string()
    .min(1, 'Please enter a cluster name.')
    .max(253, 'Cluster name must be 253 characters or less.')
    .regex(
      /^[a-zA-Z0-9]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/,
      'Cluster name must contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.'
    ),
});

export type ClusterNameFormData = z.infer<typeof clusterNameFormSchema>;
