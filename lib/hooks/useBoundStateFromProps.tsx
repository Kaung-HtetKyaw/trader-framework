import { getBoundType, getGapPointsByHorizontalCenter } from '@/lib/visualization/edges/gapPoints';
import { BoundTypes } from '@/types/visualization';
import { RFVisualizationNode, RFVisualizationNodeBounds } from '@/types/visualization/react-flow';
import { XYPosition } from '@xyflow/react';
import { useMemo } from 'react';

export type UseBoundStateFromProps = {
  nodes: RFVisualizationNode[];
};

const useBoundStateFromProps = (props: UseBoundStateFromProps) => {
  const { nodes: nodesProp } = props;

  const boundsMap = useMemo(() => {
    const map = new Map<string, RFVisualizationNodeBounds[]>();

    Object.values(BoundTypes).forEach(boundType => {
      const bounds = nodesProp
        .filter(node => getBoundType(node.data.type) === boundType)
        .map(node => node.data.bounds)
        .filter(el => !!el);
      map.set(boundType, bounds);
    });

    return map;
  }, [nodesProp]);

  const gapPointsMap = useMemo(() => {
    const map = new Map<string, XYPosition[]>();
    Object.values(BoundTypes).forEach(sourceType => {
      const gapPoints = getGapPointsByHorizontalCenter(boundsMap.get(sourceType) || []);
      map.set(sourceType, gapPoints);
    });
    return map;
  }, [boundsMap]);

  return {
    bounds: boundsMap,
    gapPoints: gapPointsMap,
  };
};

export default useBoundStateFromProps;
