import { signal } from '@preact/signals-react';
import { deepSignal } from '@preact-signals/utils';
import { K8sObjectTypeEnum } from '@/types/visualization/k8sObjects';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';

export type SelectedObject = {
  id: string;
  name: string;
  kind: K8sObjectTypeEnum;
  namespace?: string;
  podID?: string;
};

export type AvailableObjectMap = {
  namespace: SelectedObject[];
  pod: SelectedObject[];
  container: SelectedObject[];
  node: SelectedObject[];
};
const availableObjects = signal<AvailableObjectMap>({ namespace: [], pod: [], container: [], node: [] });
const selectedObjects = deepSignal(new Set<string>());

const getAvailableObjects = () => {
  return Object.values(availableObjects.value).flat();
};

const initAvailableObjects = (kind: K8sObjectTypeEnum, objects: SelectedObject[]) => {
  availableObjects.value = {
    ...availableObjects.value,
    [kind]: objects,
  };
};

const initSelectedObjects = (id: string[]) => {
  selectedObjects.value = new Set(id);
};

const getSelectedObjectIds = () => {
  return Array.from(selectedObjects.value);
};

const getSelectedObjects = () => {
  return getAvailableObjects().filter(object => {
    return selectedObjects.value.has(object.id);
  });
};

const getSelectedObjectsCount = () => {
  return selectedObjects.value.size;
};

const getSelectedNamespaceObjects = () => {
  const objects = getAvailableObjects();
  return objects
    .filter(object => object.kind === K8sObjectTypes.Namespace && selectedObjects.value.has(object.id))
    .map(el => el.id);
};

const getSelectedPodObjects = () => {
  const objects = getAvailableObjects();
  return objects
    .filter(object => object.kind === K8sObjectTypes.Pod && selectedObjects.value.has(object.id))
    .map(el => el.id);
};

const getSelectedContainerObjects = () => {
  const objects = getAvailableObjects();
  return objects
    .filter(object => object.kind === K8sObjectTypes.Container && selectedObjects.value.has(object.id))
    .map(el => el.id);
};

const getSelectedNodeObjects = () => {
  const objects = getAvailableObjects();
  return objects
    .filter(object => object.kind === K8sObjectTypes.Node && selectedObjects.value.has(object.id))
    .map(el => el.id);
};

const getSelectedObjectsByKind = (kind: K8sObjectTypeEnum) => {
  switch (kind) {
    case K8sObjectTypes.Namespace:
      return getSelectedNamespaceObjects();
    case K8sObjectTypes.Pod:
      return getSelectedPodObjects();
    case K8sObjectTypes.Container:
      return getSelectedContainerObjects();
    case K8sObjectTypes.Node:
      return getSelectedNodeObjects();
    default:
      return [];
  }
};

const isRowSelected = (id: string) => {
  return selectedObjects.value.has(id);
};

const addToSelectedObjects = (id: string) => {
  selectedObjects.value.add(id);
};

const removeFromSelectedObjects = (id: string) => {
  selectedObjects.value.delete(id);
};

const toggleSelection = (id: string) => {
  if (isRowSelected(id)) {
    removeFromSelectedObjects(id);
  } else {
    addToSelectedObjects(id);
  }
};

const clearSelections = () => {
  selectedObjects.value = new Set();
};

export {
  initAvailableObjects,
  isRowSelected,
  addToSelectedObjects,
  removeFromSelectedObjects,
  clearSelections,
  getSelectedObjects,
  getAvailableObjects,
  getSelectedPodObjects,
  getSelectedNamespaceObjects,
  getSelectedContainerObjects,
  getSelectedNodeObjects,
  getSelectedObjectsCount,
  toggleSelection,
  initSelectedObjects,
  getSelectedObjectIds,
  getSelectedObjectsByKind,
};
