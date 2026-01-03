import { EntityNode, HealthStatus } from '@/types/visualization';
import { K8sObjectTypeEnum } from '@/types/visualization/k8sObjects';
import { RFVisualizationNode } from '@/types/visualization/react-flow';

// TODO: refactor this into proper scalable hierarchy instead of a simple function
export const getRelevantNodes = (nodes: RFVisualizationNode[], type: K8sObjectTypeEnum) => {
  return nodes.filter(node => {
    if (type === 'Pod') {
      return node.data.type !== 'Namespace' && node.data.type !== 'Cluster';
    }

    if (type === 'Namespace') {
      return node.data.type !== 'Cluster';
    }

    if (type === 'Container') {
      return node.data.type !== 'Pod' && node.data.type !== 'Namespace' && node.data.type !== 'Cluster';
    }

    return node.data.type === type;
  });
};

export const getAggregatedNamespaceHealthStatus = (children: EntityNode[]): HealthStatus => {
  if (!children.length) return HealthStatus.Unknown;

  // Recursively collect all health statuses from children and nested children
  const collectAllHealthStatuses = (nodes: EntityNode[]): HealthStatus[] => {
    const statuses: HealthStatus[] = [];
    nodes.forEach(node => {
      statuses.push(node.healthStatus);
      if (node.children && node.children.length > 0) {
        statuses.push(...collectAllHealthStatuses(node.children));
      }
    });
    return statuses;
  };

  const allStatuses = collectAllHealthStatuses(children);

  if (allStatuses.some(status => status === HealthStatus.Broken)) {
    return HealthStatus.Broken;
  }

  if (allStatuses.some(status => status === HealthStatus.Warning)) {
    return HealthStatus.Warning;
  }

  if (allStatuses.every(status => status === HealthStatus.Healthy)) {
    return HealthStatus.Healthy;
  }

  return HealthStatus.Unknown;
};
