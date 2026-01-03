import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { type NodeProps } from '@xyflow/react';
import RFClusterGroupNode from './RFClusterGroup';
import RFPodGroupNode from './RFPodGroup';
import RFNamespaceGroupNode from './RFNamespaceGroup';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import RFHierarchyGroupNode from './RFHierarchyGroup';
import { memo } from 'react';
import RFPlaceHolderNamespaceGroup from './RFPlaceHolderNamespaceGroup';
import RFPlaceholderCWOGroup from './RFPlaceholderCWOGroup';
import RFCWOGroupNode from './RFCWOGroup';

const RFGroupNode = (props: NodeProps<RFVisualizationNode>) => {
  switch (props.data.type) {
    case K8sObjectTypes.Cluster:
      return <RFClusterGroupNode {...props} />;
    case K8sObjectTypes.CWOGroup:
      return <RFCWOGroupNode {...props} />;
    case K8sObjectTypes.Namespace:
      return <RFNamespaceGroupNode {...props} />;
    case K8sObjectTypes.Pod:
      return <RFPodGroupNode {...props} />;
    case K8sObjectTypes.HierarchyGroup:
      return <RFHierarchyGroupNode {...props} />;
    case K8sObjectTypes.PlaceHolderNamespaceGroup:
      return <RFPlaceHolderNamespaceGroup {...props} />;
    case K8sObjectTypes.PlaceHolderCWOGroup:
      return <RFPlaceholderCWOGroup {...props} />;
  }
};

export default memo(RFGroupNode);
