import tailwindConfig from '@/tailwind.config';
import { HealthStatus, HealthStatusColor } from '@/types/visualization';

export const getHealthStatusColor = ({
  status,
  isSelected,
}: {
  status: HealthStatus;
  isSelected?: boolean;
}): HealthStatusColor => {
  switch (status) {
    case HealthStatus.Healthy:
      return getHealthyHealthStatusColor(isSelected);
    case HealthStatus.Warning:
      return getWarningHealthStatusColor(isSelected);
    case HealthStatus.Broken:
      return getBrokenHealthStatusColor(isSelected);
    default:
      return getUnknownHealthStatusColor(isSelected);
  }
};

export const getHealthyHealthStatusColor = (isSelected?: boolean): HealthStatusColor => {
  if (isSelected) {
    return {
      background: tailwindConfig.theme.extend.colors.essence[50],
      color: tailwindConfig.theme.extend.colors.essence[600],
      border: tailwindConfig.theme.extend.colors.essence[500],
    };
  }

  return {
    background: tailwindConfig.theme.extend.colors.secondary[100],
    color: tailwindConfig.theme.extend.colors.essence[500],
    border: 'none',
  };
};

export const getWarningHealthStatusColor = (isSelected?: boolean): HealthStatusColor => {
  if (isSelected) {
    return {
      background: tailwindConfig.theme.extend.colors.warning[50],
      color: tailwindConfig.theme.extend.colors.warning[600],
      border: tailwindConfig.theme.extend.colors.warning[500],
    };
  }

  return {
    color: tailwindConfig.theme.extend.colors.warning[500],
    background: tailwindConfig.theme.extend.colors.secondary[100],
    border: 'none',
  };
};

export const getBrokenHealthStatusColor = (isSelected?: boolean): HealthStatusColor => {
  if (isSelected) {
    return {
      background: tailwindConfig.theme.extend.colors.error[50],
      color: tailwindConfig.theme.extend.colors.error[800],
      border: tailwindConfig.theme.extend.colors.error[600],
    };
  }

  return {
    color: tailwindConfig.theme.extend.colors.error[700],
    background: tailwindConfig.theme.extend.colors.secondary[100],
    border: 'none',
  };
};

export const getOrphanedHealthStatusColor = (isSelected?: boolean): HealthStatusColor => {
  if (isSelected) {
    return {
      background: tailwindConfig.theme.extend.colors.text[100],
      color: tailwindConfig.theme.extend.colors.text[900],
      border: tailwindConfig.theme.extend.colors.text[800],
    };
  }

  return {
    color: tailwindConfig.theme.extend.colors.text[700],
    background: tailwindConfig.theme.extend.colors.secondary[100],
    border: 'none',
  };
};

export const getStaleHealthStatusColor = (isSelected?: boolean): HealthStatusColor => {
  if (isSelected) {
    return {
      background: tailwindConfig.theme.extend.colors.text[50],
      color: tailwindConfig.theme.extend.colors.text[500],
      border: tailwindConfig.theme.extend.colors.text[500],
    };
  }

  return {
    color: tailwindConfig.theme.extend.colors.text[400],
    background: tailwindConfig.theme.extend.colors.secondary[100],
    border: 'none',
  };
};

export const getUnknownHealthStatusColor = (isSelected?: boolean): HealthStatusColor => {
  if (isSelected) {
    return {
      background: tailwindConfig.theme.extend.colors.secondary[50],
      color: tailwindConfig.theme.extend.colors.primary[950],
      border: tailwindConfig.theme.extend.colors.primary[500],
    };
  }

  return {
    color: tailwindConfig.theme.extend.colors.secondary[500],
    background: tailwindConfig.theme.extend.colors.secondary[100],
    border: 'none',
  };
};

export const getNamespaceHealthStatusLabelBackground = (status: HealthStatus): string => {
  switch (status) {
    case HealthStatus.Broken:
      return tailwindConfig.theme.extend.colors.error[100];
    case HealthStatus.Warning:
      return tailwindConfig.theme.extend.colors.warning[100];
    case HealthStatus.Healthy:
      return tailwindConfig.theme.extend.colors.secondary[100];
    default:
      return tailwindConfig.theme.extend.colors.secondary[100];
  }
};

