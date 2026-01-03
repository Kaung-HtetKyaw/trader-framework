import { getContainerID } from '@/lib/utils/objects';
import { EntityNode, K8sContextObject, HealthStatus } from '@/types/visualization';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { VisualizationLayoutTypeEnum, VisualizationLayoutTypes } from '@/types/visualization/react-flow';

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

const NON_WORKLOAD_CONTROLLER_OBJECTS: K8sObjectTypeEnum[] = [
  K8sObjectTypes.ReplicaSet,
  K8sObjectTypes.Pod,
  K8sObjectTypes.Container,
];

const POD_MANAGING_OBJECTS: K8sObjectTypeEnum[] = [
  K8sObjectTypes.ReplicaSet,
  K8sObjectTypes.StatefulSet,
  K8sObjectTypes.DaemonSet,
  K8sObjectTypes.Job,
  K8sObjectTypes.CronJob,
];

export const getNamespacedObjects = ({
  objects,
  layoutType,
  idMap,
}: {
  objects: K8sContextObject[];
  layoutType: VisualizationLayoutTypeEnum;
  idMap: Record<string, string>;
}) => {
  switch (layoutType) {
    case VisualizationLayoutTypes.matrix:
      return getNamespacedMatrixObjects(objects, idMap);
    case VisualizationLayoutTypes.hierarchy:
      return getNamespacedHierarchyObjects(objects, idMap);
    default:
      return [];
  }
};

export const getNamespacedMatrixObjects = (objects: K8sContextObject[], idMap: Record<string, string>) => {
  const nonGroupNamespacedObjects = objects
    .filter(el => el.kind !== K8sObjectTypes.Pod)
    .map(el => {
      return {
        id: el.id,
        name: el.name,
        namespace: el.namespace,
        kind: el.kind,
        parent: el.namespace ? idMap[el.namespace] : undefined,
        healthStatus: el.healthStatus,
        children: [],
        apiVersions: el.apiVersion ? [el.apiVersion] : [],
      };
    });

  const groupNamespacedObjects = objects
    .filter(el => el.kind === K8sObjectTypes.Pod)
    .map(el => {
      return {
        id: el.id,
        name: el.name,
        kind: el.kind,
        parent: el.namespace ? idMap[el.namespace] : undefined,
        healthStatus: el.healthStatus,
        children:
          el?.spec?.containers?.map(container => ({
            id: getContainerID(el.id, container.name),
            name: container.name,
            kind: K8sObjectTypes.Container,
            namespace: el.namespace,
            parent: el.id,
            healthStatus: el.healthStatus,
            apiVersions: el.apiVersion ? [el.apiVersion] : [],
            children: [],
          })) || [],
        apiVersions: el.apiVersion ? [el.apiVersion] : [],
      };
    });

  return [...nonGroupNamespacedObjects, ...groupNamespacedObjects];
};

export const getNamespacedHierarchyObjects = (
  objects: K8sContextObject[],
  idMap: Record<string, string>
): EntityNode[] => {
  return Object.entries(idMap)
    .map(([name]) => {
      const namespacedObjects = objects.filter(el => el.namespace === name);
      const alreadyManagedObjects = new Set<string>();

      if (!namespacedObjects.length) return undefined;

      // REPLICA SETS, PODS, CONTAINERS, etc.
      const nonWorkloadControllers = namespacedObjects.filter(el => NON_WORKLOAD_CONTROLLER_OBJECTS.includes(el.kind));
      // EVERYTHING else except for replica sets, pods, and containers
      const workLoadControllers = namespacedObjects.filter(el => !NON_WORKLOAD_CONTROLLER_OBJECTS.includes(el.kind));

      const staticPodObjects = getStaticPodObjects(
        workLoadControllers,
        nonWorkloadControllers,
        idMap,
        alreadyManagedObjects
      );

      const workloadControllersWithoutStaticPods = namespacedObjects.filter(
        el => !NON_WORKLOAD_CONTROLLER_OBJECTS.includes(el.kind) || !staticPodObjects.some(pod => pod.id === el.id)
      );

      const workloadControllerObjects = getWorkLoadControllerObjects(
        workloadControllersWithoutStaticPods,
        nonWorkloadControllers,
        idMap,
        alreadyManagedObjects
      );

      return [...workloadControllerObjects, ...staticPodObjects];
    })
    .filter(el => !!el)
    .flat();
};

/**
 *  NOTE: In a namespace, we will consider everything that is not replica set, pod, and container as workload controller objects (eg. deployment, daemonset, statefulset, job, cronjob, etc.) for now
 * But this will change to more sophisticated connection logic later in the future
 */
const getWorkLoadControllerObjects = (
  workloadControllers: K8sContextObject[],
  nonWorkloadControllers: K8sContextObject[],
  idMap: Record<string, string>,
  alreadyManagedObjects: Set<string>
): EntityNode[] => {
  const replicaManagingControllers = getReplicaManagingControllerObjects(
    workloadControllers,
    nonWorkloadControllers,
    idMap,
    alreadyManagedObjects
  );
  const directPodManagingControllers = getDirectPodManagingControllerObjects(
    workloadControllers,
    nonWorkloadControllers,
    idMap,
    alreadyManagedObjects
  );

  return [...replicaManagingControllers, ...directPodManagingControllers];
};

const getReplicaManagingControllerObjects = (
  workloadControllers: K8sContextObject[],
  nonWorkloadControllers: K8sContextObject[],
  idMap: Record<string, string>,
  alreadyManagedObjects: Set<string>
) => {
  const replicaManagingControllers = workloadControllers.filter(el => el.kind === K8sObjectTypes.Deployment);

  return replicaManagingControllers.map(el => {
    const children = nonWorkloadControllers.filter(c => isChildOfReplicaManagingController(c, el));

    const childrenObjects = getDirectPodManagingControllerObjects(
      children,
      nonWorkloadControllers.filter(nc => nc.kind === K8sObjectTypes.Pod),
      idMap,
      alreadyManagedObjects
    );

    return {
      id: el.id,
      name: el.name,
      kind: el.kind,
      namespace: el.namespace,
      parent: el.namespace ? idMap[el.namespace] : undefined,
      healthStatus: el.healthStatus,
      children: childrenObjects,
      apiVersions: el.apiVersion ? [el.apiVersion] : [],
    };
  });
};

const getDirectPodManagingControllerObjects = (
  parentObjects: K8sContextObject[],
  childrenObjects: K8sContextObject[],
  idMap: Record<string, string>,
  alreadyManagedObjects: Set<string>
) => {
  const podManagingControllers = parentObjects.filter(
    el =>
      el.kind === K8sObjectTypes.ReplicaSet ||
      (el.kind !== K8sObjectTypes.Deployment && !NON_WORKLOAD_CONTROLLER_OBJECTS.includes(el.kind))
  );

  return podManagingControllers
    .map(el => {
      if (alreadyManagedObjects.has(el.id)) return undefined;
      alreadyManagedObjects.add(el.id);

      const shouldManagePods = POD_MANAGING_OBJECTS.includes(el.kind);

      const replicaSetChildren = childrenObjects
        .filter(c => isChildOf(c, el))
        .map(pod => {
          if (alreadyManagedObjects.has(pod.id)) return undefined;
          alreadyManagedObjects.add(pod.id);

          const podChildren =
            pod?.spec?.containers
              ?.map(container => {
                return {
                  id: getContainerID(pod.id, container.name),
                  name: container.name,
                  kind: K8sObjectTypes.Container,
                  parent: pod.id,
                  namespace: pod.namespace,
                  healthStatus: pod.healthStatus,
                  children: [],
                  apiVersions: pod.apiVersion ? [pod.apiVersion] : [],
                };
              })
              .sort((a, b) => a.children.length - b.children.length) || [];

          return {
            id: pod.id,
            name: pod.name,
            kind: pod.kind,
            namespace: pod.namespace,
            parent: pod.namespace ? idMap[pod.namespace] : undefined,
            healthStatus: pod.healthStatus,
            children: podChildren,
            apiVersions: pod.apiVersion ? [pod.apiVersion] : [],
          };
        })
        .filter(el => !!el)
        .sort((a, b) => a.children.length - b.children.length);

      return {
        id: el.id,
        name: el.name,
        kind: el.kind,
        namespace: el.namespace,
        parent: el.namespace ? idMap[el.namespace] : undefined,
        healthStatus: el.healthStatus,
        children: shouldManagePods ? replicaSetChildren : [],
        apiVersions: el.apiVersion ? [el.apiVersion] : [],
      };
    })
    .filter(el => !!el)
    .sort((a, b) => b.children.length - a.children.length);
};

const getStaticPodObjects = (
  workLoadControllers: K8sContextObject[],
  nonWorkloadControllers: K8sContextObject[],
  idMap: Record<string, string>,
  alreadyManagedObjects: Set<string>
): EntityNode[] => {
  const podObjects = nonWorkloadControllers.filter(el => el.kind === K8sObjectTypes.Pod);
  const nonPodObjects = nonWorkloadControllers.filter(el => el.kind !== K8sObjectTypes.Pod);
  const podManagingControllers = [...workLoadControllers, ...nonPodObjects];

  const staticPods = podObjects.filter(el => {
    return !podManagingControllers.some(podManagingController => isChildOf(el, podManagingController));
  });

  const staticPodObjects = staticPods.map(el => {
    if (alreadyManagedObjects.has(el.id)) return undefined;

    alreadyManagedObjects.add(el.id);

    const children =
      el?.spec?.containers
        ?.map(container => {
          const containerId = getContainerID(el.id, container.name);
          if (alreadyManagedObjects.has(containerId)) return undefined;
          alreadyManagedObjects.add(containerId);

          return {
            id: containerId,
            name: container.name,
            namespace: el.namespace,
            kind: K8sObjectTypes.Container,
            parent: el.id,
            healthStatus: el.healthStatus,
            children: [],
            apiVersions: el.apiVersion ? [el.apiVersion] : [],
          };
        })
        .filter(el => !!el)
        .sort((a, b) => a.children.length - b.children.length) || [];

    return {
      id: el.id,
      name: el.name,
      namespace: el.namespace,
      kind: el.kind,
      parent: el.namespace ? idMap[el.namespace] : undefined,
      healthStatus: el.healthStatus,
      children: children.filter(child => !!child),
      apiVersions: el.apiVersion ? [el.apiVersion] : [],
    };
  });

  return staticPodObjects.filter(el => !!el).sort((a, b) => b.children.length - a.children.length);
};

const isChildOfReplicaManagingController = (obj: K8sContextObject, replicaManagingController: K8sContextObject) => {
  // For example. If the object name is "coredns-1234567890" and the replica managing controller name is "coredns", the result will be ["","-1234567890"]

  return obj.kind === K8sObjectTypes.ReplicaSet && isChildOf(obj, replicaManagingController);
};

const isChildOf = (obj: K8sContextObject, parent: K8sContextObject) => {
  const list = obj.name.split(parent.name);
  return list.length > 1 && list[0] === '' && !!list[1];
};

export const getClusterChildrenByKind = (nodes: EntityNode[], kind?: string[]) => {
  if (!kind) return nodes;

  return nodes.filter(el => kind.includes(el.kind));
};
