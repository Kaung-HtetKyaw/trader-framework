import { DropdownOption } from '@/components/Dropdown';
import { EntityNode } from '@/types/visualization';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { VisualizationListFilterParams } from '@/types/visualization/list';
import { RFVisualizationNode } from '@/types/visualization/react-flow';

export const getInitialSelectedObjectKinds = (options: DropdownOption[], params: VisualizationListFilterParams) => {
  if (typeof params.kind === 'undefined' && typeof params.excludedKind === 'undefined') {
    return options.map(opt => opt.value);
  }

  if (!!params.allKinds) {
    return options.map(opt => opt.value);
  }

  if (!!params.excludedKind) {
    return options.filter(opt => !params.excludedKind?.includes(opt.value)).map(opt => opt.value);
  }

  return params.kind || [];
};

export const getInitialSelectedNamespaces = (options: DropdownOption[], params: VisualizationListFilterParams) => {
  if (typeof params.namespace === 'undefined' && typeof params.excludedNamespace === 'undefined') {
    return options.map(opt => opt.value);
  }

  if (!!params.excludedNamespace) {
    return options.filter(opt => !params.excludedNamespace?.includes(opt.value)).map(opt => opt.value);
  }

  return params.namespace || [];
};

export const getInitialSelectedClusterWideObjects = (
  options: DropdownOption[],
  params: VisualizationListFilterParams
) => {
  const hasCWOFilter =
    !!params.clusterWideObject || !!params.excludedClusterWideObject || !!params.allClusterWideObjects;
  const hasNamespaceFilter = !!params.namespace || !!params.excludedNamespace;
  const hasObjectKindFilter = !!params.kind || !!params.excludedKind || !!params.allKinds;
  const namespaceFilterCleared =
    params.namespace &&
    params.namespace.length === 0 &&
    params.excludedNamespace &&
    params.excludedNamespace.length === 0;

  if (!hasCWOFilter) {
    return [];
  }

  // both cwo and ns filters are not selected (default)
  if (!hasNamespaceFilter && !hasObjectKindFilter) {
    return [];
  }

  if (!hasNamespaceFilter && !!hasObjectKindFilter) {
    return options.map(opt => opt.value);
  }

  if (!!params.allClusterWideObjects) {
    return options.map(opt => opt.value);
  }

  if (namespaceFilterCleared) {
    return options.map(opt => opt.value);
  }

  if (!!params.excludedClusterWideObject) {
    return options.filter(opt => !params.excludedClusterWideObject?.includes(opt.value)).map(opt => opt.value);
  }

  return params.clusterWideObject || [];
};

export const getFilteredClusterChildrenByParams = (clusterData: EntityNode, params: VisualizationListFilterParams) => {
  const hasCWOFilter =
    !!params.clusterWideObject || !!params.excludedClusterWideObject || !!params.allClusterWideObjects;
  const hasNamespaceFilter = !!params.namespace || !!params.excludedNamespace || !!params.allNamespaces;
  const cwoFilterCleared = params.clusterWideObject && params.clusterWideObject.length === 0;
  const excludedCWOSet = params.excludedClusterWideObject
    ? new Set(getParamsValue(params.excludedClusterWideObject))
    : new Set();
  const cwoSet = params.clusterWideObject ? new Set(getParamsValue(params.clusterWideObject)) : new Set();
  const excludedNamespaceSet = params.excludedNamespace ? new Set(getParamsValue(params.excludedNamespace)) : new Set();
  const namespaceSet = params.namespace ? new Set(getParamsValue(params.namespace)) : new Set();
  const excludedKindSet = params.excludedKind ? new Set(getParamsValue(params.excludedKind)) : new Set();
  const kindSet = params.kind ? new Set(getParamsValue(params.kind)) : new Set();

  const cwoGroups = clusterData.children
    .filter(el => {
      if (
        !hasCWOFilter ||
        params.clusterWideObject?.length === 0 ||
        el.kind === K8sObjectTypes.Namespace ||
        el.kind === K8sObjectTypes.PlaceHolderNamespaceGroup
      ) {
        return false;
      }

      if (!!params.excludedClusterWideObject) {
        const children = el.children.filter(child => !excludedCWOSet.has(child.id));
        return children.length > 0;
      }

      if (!!params.clusterWideObject) {
        const children = el.children.filter(child => cwoSet.has(child.id));
        return children.length > 0;
      }

      return true;
    })

    .map(el => {
      const children = el.children.filter(child => {
        if (!hasCWOFilter) {
          return false;
        }

        if (cwoFilterCleared) {
          return false;
        }

        if (params.allClusterWideObjects) {
          return true;
        }

        if (!!params.excludedClusterWideObject) {
          return !excludedCWOSet.has(child.id);
        }

        return cwoSet.has(child.id);
      });

      // If the number of children is the same as the original children, return the original object (do not spread and create new object)
      if (children.length === el.children.length) {
        return el;
      }

      return { ...el, children };
    });

  const namespaceChildren =
    clusterData.children?.filter(el => {
      const isNamespace = el.kind === K8sObjectTypes.Namespace || el.kind === K8sObjectTypes.PlaceHolderNamespaceGroup;

      if (!isNamespace) {
        return false;
      }

      if (!hasNamespaceFilter) {
        return true;
      }

      if (params.allNamespaces) {
        return true;
      }

      if (!!params.excludedNamespace) {
        return excludedNamespaceSet.has(el.name);
      }

      return namespaceSet.has(el.name);
    }) || [];

  const children = cwoGroups.concat(namespaceChildren);

  const childrenFilteredByKind = children.filter(el => {
    const hasKindFilter = !!params.kind || !!params.excludedKind || !!params.allKinds;

    if (!hasKindFilter) {
      return true;
    }

    if (params.allKinds) {
      return true;
    }

    const kind = getKindByPlaceholderType(el);

    if (!!params.excludedKind) {
      return !excludedKindSet.has(kind);
    }

    return kindSet.has(kind);
  });

  return {
    ...clusterData,
    children: childrenFilteredByKind,
  };
};

const getKindByPlaceholderType = (node: EntityNode) => {
  if (node.kind === K8sObjectTypes.PlaceHolderNamespaceGroup) {
    return K8sObjectTypes.Namespace;
  }

  if (node.kind === K8sObjectTypes.PlaceHolderCWOGroup || node.kind === K8sObjectTypes.CWOGroup) {
    return node.id;
  }

  return node.kind;
};

export const getFilteredNodesByParams = (nodes: RFVisualizationNode[], params: VisualizationListFilterParams) => {
  const clusterWideChildren =
    nodes.filter(el => {
      const hasCWOFilter = !!params.clusterWideObject || !!params.excludedClusterWideObject;
      const isCWOFilterSelectedAll = !!params.allClusterWideObjects;
      const hasNamespaceFilter = !!params.namespace || !!params.excludedNamespace;
      const isNamespaceFilterSelectedAll = !!params.allNamespaces;
      const cwoFilterCleared = params.clusterWideObject && params.clusterWideObject.length === 0;
      const namespaceFilterCleared =
        params.namespace &&
        params.namespace.length === 0 &&
        params.excludedNamespace &&
        params.excludedNamespace.length === 0;
      const isNamespace = el.data.type === K8sObjectTypes.Namespace;

      if (isNamespace || cwoFilterCleared) {
        return false;
      }

      if (!hasCWOFilter && !isCWOFilterSelectedAll && !hasNamespaceFilter && !isNamespaceFilterSelectedAll) {
        return true;
      }

      if (!hasCWOFilter && namespaceFilterCleared) {
        return true;
      }

      if (!hasCWOFilter && isNamespaceFilterSelectedAll) {
        return true;
      }

      if (params.allClusterWideObjects) {
        return true;
      }

      if (!!params.excludedClusterWideObject) {
        return !params.excludedClusterWideObject?.includes(el.id);
      }

      return params.clusterWideObject?.includes(el.id);
    }) || [];

  const namespaceChildren =
    nodes.filter(el => {
      const hasNamespaceFilter = !!params.namespace || !!params.excludedNamespace;
      const isNamespace = el.data.type === K8sObjectTypes.Namespace;

      if (!isNamespace) {
        return false;
      }

      if (!hasNamespaceFilter) {
        return true;
      }

      if (params.allNamespaces) {
        return true;
      }

      if (!!params.excludedNamespace) {
        return !params.excludedNamespace?.includes(el.data.label);
      }

      return params.namespace?.includes(el.data.label);
    }) || [];

  const children = clusterWideChildren.concat(namespaceChildren);

  return children.filter(el => {
    const hasKindFilter = !!params.kind || !!params.excludedKind;

    if (!hasKindFilter) {
      return true;
    }

    if (params.allKinds) {
      return true;
    }

    if (!!params.excludedKind) {
      return !params.excludedKind?.includes(el.data.type);
    }

    return params.kind?.includes(el.data.type);
  });
};

const getParamsValue = (value: string | string[]) => {
  if (Array.isArray(value)) {
    return new Set(value);
  }

  return new Set(value.split(','));
};
