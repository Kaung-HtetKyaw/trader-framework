import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { omit } from 'lodash/fp';
import config from '@/lib/config';

export const getRFVisualizationNodes = (nodes: RFVisualizationNode[]) => {
  const result: RFVisualizationNode[] = [];

  nodes.forEach(node => {
    result.push(omit(['children'], node) as RFVisualizationNode);
    if (node.children) {
      result.push(...getRFVisualizationNodes(node.children));
    }
  });

  return result.map(el => ({
    ...el,
    draggable: config.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_DRAGGABLE,
    connectable: config.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE,
    selected: false,
    style: {
      ...(el.style || {}),
      borderRadius: '9px',
    },
  }));
};
