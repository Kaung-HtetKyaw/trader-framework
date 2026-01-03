import { EnvironmentTypeEnum } from '@/types/environment';

export type FeatureFlags = typeof defaultFeatures;

export type FeatureFlagEnum = FeatureFlagPaths<FeatureFlags>;

// Helper type to get all possible paths in a feature flag object
type FeatureFlagPaths<T> = T extends string
  ? ''
  : {
      [K in keyof T]: K extends string
        ? T[K] extends { enabled: boolean }
          ? K | `${K}.${FeatureFlagPaths<Omit<T[K], 'enabled'>>}`
          : T[K] extends boolean
            ? K
            : never
        : never;
    }[keyof T];

const defaultFeatures = {
  clusters: {
    enabled: true,
  },
  notifications: false,
  dashboard: {
    enabled: true,
    clusterGroupMenu: {
      enabled: true,
    },
    createNewGroup: {
      enabled: true,
    },
  },
  banner: {
    enabled: false,
    syntheticDataNotice: {
      enabled: false,
    },
  },
  settings: {
    organization: {
      enabled: true,
      apiKey: {
        enabled: true,
      },
      clusterGroup: {
        enabled: true,
      },
      organizationMembers: {
        enabled: true,
      },
      gitopsIntegration: {
        enabled: true,
      },
      azureDevopsIntegration: {
        enabled: true,
      },
    },
    createClusterToken: {
      enabled: true,
    },
    enabled: true,
  },
};

/**
 * Override default features for sandbox environment.
 */
const sandboxFeatures: FeatureFlags = {
  clusters: {
    enabled: true,
  },
  notifications: false,
  dashboard: {
    enabled: true,
    clusterGroupMenu: {
      enabled: false,
    },
    createNewGroup: {
      enabled: true,
    },
  },
  banner: {
    enabled: true,
    syntheticDataNotice: {
      enabled: true,
    },
  },
  settings: {
    organization: {
      enabled: true,
      apiKey: {
        enabled: false,
      },
      clusterGroup: {
        enabled: true,
      },
      organizationMembers: {
        enabled: false,
      },
      gitopsIntegration: {
        enabled: false,
      },
      azureDevopsIntegration: {
        enabled: false,
      },
    },
    createClusterToken: {
      enabled: false,
    },
    enabled: true,
  },
};

export const features: Record<EnvironmentTypeEnum, FeatureFlags> = {
  default: defaultFeatures,
  sandbox: sandboxFeatures,
};
