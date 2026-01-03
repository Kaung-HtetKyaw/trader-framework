import { PromptNodeContext } from '@/types/chat';
import { SelectedObject, initAvailableObjects, initSelectedObjects } from '@/signals/tables/selection';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';

/**
 * Restores table selections from historical chat selected objects
 * Used when clicking on a recent chat to show what items were selected during that conversation
 */
export const restoreTableSelectionsFromContexts = (clusterId: string, contexts: PromptNodeContext[]) => {
  if (!clusterId) return;

  const namespaces: SelectedObject[] = contexts
    .filter(ctx => ctx.kind === 'Namespace')
    .map(ctx => ({
      id: ctx.id,
      name: ctx.name,
      kind: K8sObjectTypes.Namespace,
      namespace: undefined,
    }));

  const pods: SelectedObject[] = contexts
    .filter(ctx => ctx.kind === 'Pod')
    .map(ctx => ({
      id: ctx.id,
      name: ctx.name,
      namespace: ctx.namesapce || undefined,
      kind: K8sObjectTypes.Pod,
    }));

  const containers: SelectedObject[] = contexts
    .filter(ctx => ctx.kind === 'Container')
    .map(ctx => ({
      id: ctx.id,
      name: ctx.name,
      podName: '', // Not available in context
      namespace: ctx.namesapce || undefined,
      kind: K8sObjectTypes.Container,
    }));

  const nodes: SelectedObject[] = contexts
    .filter(ctx => ctx.kind === 'Node')
    .map(ctx => ({
      id: ctx.id,
      name: ctx.name,
      kind: K8sObjectTypes.Node,
      namespace: undefined,
    }));

  initAvailableObjects(K8sObjectTypes.Namespace, namespaces);
  initAvailableObjects(K8sObjectTypes.Pod, pods);
  initAvailableObjects(K8sObjectTypes.Container, containers);
  initAvailableObjects(K8sObjectTypes.Node, nodes);

  const allObjects = namespaces.concat(pods).concat(containers).concat(nodes);
  initSelectedObjects(allObjects.map(object => object.id));
};
