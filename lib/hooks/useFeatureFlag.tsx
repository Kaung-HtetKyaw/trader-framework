import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FeatureFlagEnum, features } from '@/constants/features';
import { useCallback } from 'react';
import _ from 'lodash';

export type IsFeatureEnabled = (
  featureKey: FeatureFlagEnum,
  enabled?: boolean | ((defaultValue: boolean) => boolean)
) => boolean;

/**
 * Hook for managing feature flags based on the current environment.
 *
 * @example
 * // Basic usage with default value
 * const { isFeatureEnabled } = useFeatureFlag();
 * if (isFeatureEnabled('FEATURE_NAME')) {
 *   // Feature is enabled
 * }
 *
 * @example
 * // Override with boolean
 * isFeatureEnabled('FEATURE_KEY', false); // Force disable
 * isFeatureEnabled('FEATURE_KEY', true);  // Enable only if default is enabled
 *
 * @example
 * // Use function to transform default value
 * isFeatureEnabled('FEATURE_KEY', (defaultValue) => defaultValue && someCondition);
 *
 * @example
 * // Nested feature flags
 * isFeatureEnabled('FEATURE_KEY.NESTED_FEATURE_KEY');
 *
 * @returns {{ isFeatureEnabled: (feature: FeatureFlagEnum, enabled?: boolean | ((defaultValue: boolean) => boolean)) => boolean }}
 * An object containing the isFeatureEnabled function that checks if a feature is enabled.
 * The function accepts:
 * - feature: The feature flag to check
 * - enabled: Optional parameter that can be:
 *   - boolean: AND with default value
 *   - function: Custom logic using default value
 *   - undefined: Use default value from config
 */
const useFeatureFlag = () => {
  const environment = useSelector((state: RootState) => state.appSettings.environment);

  const isFeatureEnabled: IsFeatureEnabled = useCallback(
    (featureKey, enabled) => {
      const feature = _.get(features[environment], featureKey) as { enabled: boolean } | undefined;

      const defaultEnabled = !!(typeof feature === 'boolean' ? feature : feature?.enabled);

      if (typeof enabled === 'function') {
        return defaultEnabled && enabled(defaultEnabled);
      }

      if (typeof enabled === 'boolean') {
        return defaultEnabled && enabled;
      }

      return defaultEnabled;
    },
    [environment]
  );

  return { isFeatureEnabled };
};

export default useFeatureFlag;
