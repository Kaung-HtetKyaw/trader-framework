import { ClusterStatusEnum } from '@/types/cluster';
export * from './list';
import tailwindConfig from '@/tailwind.config';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Helper function for custom boolean parsing
const booleanSchema = (defaultValue: boolean = false) => {
  return z
    .string()
    .optional()
    .transform(val => {
      if (!val) return defaultValue;
      return val === 'true';
    })
    .default('');
};

const skipEnvValidation = process.env.SKIP_ENV_VALIDATION?.toLowerCase?.() === 'true';

export const CLUSTER_STATUSES = {
  HEALTHY: 'HEALTHY',
  UNHEALTHY: 'UNHEALTHY',
  AT_RISK: 'AT_RISK',
} as const;

export type ColorOptions = {
  color: string;
  hover: string;
  light: string;
  lightHover: string;
  medium: string;
  mediumHover: string;
  dark: string;
  darkHover: string;
  polygon: {
    image: string;
    color: string;
  };
  chart: string;
  chartHover: string;
};

export const CLUSTER_STATUS_COLORS: Record<ClusterStatusEnum, ColorOptions> = {
  HEALTHY: {
    color: tailwindConfig.theme.extend.colors.secondary[100],
    hover: tailwindConfig.theme.extend.colors.secondary[200],
    dark: tailwindConfig.theme.extend.colors.secondary[900],
    darkHover: tailwindConfig.theme.extend.colors.secondary[800],
    light: tailwindConfig.theme.extend.colors.text[50],
    lightHover: tailwindConfig.theme.extend.colors.text[100],
    medium: tailwindConfig.theme.extend.colors.secondary[500],
    mediumHover: tailwindConfig.theme.extend.colors.secondary[600],
    polygon: {
      image: '/icons/polygon-healthy.svg',
      color: tailwindConfig.theme.extend.colors.essence[700],
    },
    chart: tailwindConfig.theme.extend.colors.success[600],
    chartHover: tailwindConfig.theme.extend.colors.success[700],
  },
  AT_RISK: {
    color: tailwindConfig.theme.extend.colors.warning[400],
    hover: tailwindConfig.theme.extend.colors.warning[200],
    dark: tailwindConfig.theme.extend.colors.warning[500],
    darkHover: tailwindConfig.theme.extend.colors.warning[600],
    light: tailwindConfig.theme.extend.colors.warning[50],
    lightHover: tailwindConfig.theme.extend.colors.warning[100],
    medium: tailwindConfig.theme.extend.colors.warning[500],
    mediumHover: tailwindConfig.theme.extend.colors.warning[600],
    polygon: {
      image: '/icons/polygon-unhealthy.svg',
      color: '#fff',
    },
    chart: tailwindConfig.theme.extend.colors.warning[400],
    chartHover: tailwindConfig.theme.extend.colors.warning[200],
  },
  UNHEALTHY: {
    color: tailwindConfig.theme.extend.colors.warningAction[400],
    hover: tailwindConfig.theme.extend.colors.warningAction[300],
    dark: tailwindConfig.theme.extend.colors.warningAction[400],
    darkHover: tailwindConfig.theme.extend.colors.warningAction[500],
    light: tailwindConfig.theme.extend.colors.error[50],
    lightHover: tailwindConfig.theme.extend.colors.error[100],
    medium: tailwindConfig.theme.extend.colors.warningAction[400],
    mediumHover: tailwindConfig.theme.extend.colors.warningAction[500],
    polygon: {
      image: '/icons/polygon-at-risk.svg',
      color: '#fff',
    },
    chart: tailwindConfig.theme.extend.colors.warningAction[400],
    chartHover: tailwindConfig.theme.extend.colors.warningAction[300],
  },
};

export const CLUSTER_STATUS_BADGE_UI: Record<
  ClusterStatusEnum,
  {
    label: string;
    imageSrc: string;
    bgClass: string;
  }
> = {
  HEALTHY: {
    label: 'Healthy',
    imageSrc: '/icons/polygon-healthy.svg',
    bgClass: tailwindConfig.theme.extend.colors.essence[50],
  },
  UNHEALTHY: {
    label: 'Unhealthy',
    imageSrc: '/icons/polygon-unhealthy.svg',
    bgClass: tailwindConfig.theme.extend.colors.warning[50],
  },
  AT_RISK: {
    label: 'At Risk',
    imageSrc: '/icons/polygon-at-risk.svg',
    bgClass: tailwindConfig.theme.extend.colors.error[50],
  },
};

/**
 * Motivation: https://env.t3.gg/docs/introduction#support-for-multiple-environments
 */
export const env = createEnv({
  server: {
    HOSTNAME: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    INTERCOM_SECRET_KEY: z.string().default(''),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_BIFROST_API_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.coerce.number().min(1).default(20),
    NEXT_PUBLIC_ENVIRONMENT: z.enum(['default', 'sandbox']),
    NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_DRAGGABLE: booleanSchema(),
    NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE: booleanSchema(),
    NEXT_PUBLIC_VISUALIZATION_ENABLE_ZOOM_PLACEHOLDER: booleanSchema(),
    NEXT_PUBLIC_CLUSTER_VISUALIZATION_MOCK_CONNECTION: booleanSchema(),
    NEXT_PUBLIC_VISUALIZATION_LAYOUT_TYPE: z.enum(['hierarchy', 'matrix']).default('hierarchy'),
    NEXT_PUBLIC_GITHUB_TOKEN_NAME: z.string().min(1).default('Github PAT'),
    NEXT_PUBLIC_AZURE_DEVOPS_TOKEN_NAME: z.string().min(1).default('Azure DevOps PAT'),
    NEXT_PUBLIC_OBJECT_SELECTION_LIMIT: z.coerce.number().min(1).default(50),

    // Third party integrations
    // Posthog
    NEXT_PUBLIC_POSTHOG_ENABLE: booleanSchema(true),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    // Reo
    NEXT_PUBLIC_REO_ENABLE: booleanSchema(true),
    NEXT_PUBLIC_REO_CLIENT_ID: z.string().min(1),
    // Messengers - intercom(default) | klinkcloud
    NEXT_PUBLIC_MESSENGER_TYPE: z.enum(['intercom', 'klinkcloud']).default('intercom'),
    NEXT_PUBLIC_INTERCOM_APP_ID: z.string().default(''),
    // Pendo
    NEXT_PUBLIC_PENDO_API_KEY: z.string().default(''),

    // debug
    NEXT_PUBLIC_ENABLE_DEBUG: booleanSchema(),
  },
  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   *
   * @see https://github.com/t3-oss/t3-env
   */
  runtimeEnv: {
    HOSTNAME: process.env.HOSTNAME,
    NEXT_PUBLIC_BIFROST_API_BASE_URL: process.env.NEXT_PUBLIC_BIFROST_API_BASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,

    NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_DRAGGABLE: process.env.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_DRAGGABLE,
    NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE: process.env.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE,
    NEXT_PUBLIC_CLUSTER_VISUALIZATION_MOCK_CONNECTION: process.env.NEXT_PUBLIC_CLUSTER_VISUALIZATION_MOCK_CONNECTION,
    NEXT_PUBLIC_VISUALIZATION_ENABLE_ZOOM_PLACEHOLDER: process.env.NEXT_PUBLIC_VISUALIZATION_ENABLE_ZOOM_PLACEHOLDER,
    NEXT_PUBLIC_VISUALIZATION_LAYOUT_TYPE: process.env.NEXT_PUBLIC_VISUALIZATION_LAYOUT_TYPE,
    NEXT_PUBLIC_GITHUB_TOKEN_NAME: process.env.NEXT_PUBLIC_GITHUB_TOKEN_NAME,
    NEXT_PUBLIC_AZURE_DEVOPS_TOKEN_NAME: process.env.NEXT_PUBLIC_AZURE_DEVOPS_TOKEN_NAME,
    NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
    NEXT_PUBLIC_OBJECT_SELECTION_LIMIT: process.env.NEXT_PUBLIC_OBJECT_SELECTION_LIMIT,

    // Third party integrations
    // Posthog
    NEXT_PUBLIC_POSTHOG_ENABLE: process.env.NEXT_PUBLIC_POSTHOG_ENABLE,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Reo
    NEXT_PUBLIC_REO_ENABLE: process.env.NEXT_PUBLIC_REO_ENABLE,
    NEXT_PUBLIC_REO_CLIENT_ID: process.env.NEXT_PUBLIC_REO_CLIENT_ID,
    // Messengers - intercom(default) | klinkcloud
    NEXT_PUBLIC_MESSENGER_TYPE: process.env.NEXT_PUBLIC_MESSENGER_TYPE,
    INTERCOM_SECRET_KEY: process.env.INTERCOM_SECRET_KEY,
    NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
    // Pendo
    NEXT_PUBLIC_PENDO_API_KEY: process.env.NEXT_PUBLIC_PENDO_API_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: skipEnvValidation,
});

const config = {
  ...env,
  CLUSTER_STATUSES,
  CLUSTER_STATUS_COLORS,
  CLUSTER_STATUS_BADGE_UI,
};

export default config;
