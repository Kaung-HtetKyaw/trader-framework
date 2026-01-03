import { RFVisualizationEdgeTypes, VisualizationLayoutTypeEnum } from '@/types/visualization/react-flow';
import { VisualizationLayoutTypes } from '@/types/visualization/react-flow';

export const getVisualizationEdgeType = (layoutType: VisualizationLayoutTypeEnum) => {
  if (layoutType === VisualizationLayoutTypes.hierarchy) {
    return RFVisualizationEdgeTypes.smoothstep;
  }

  return RFVisualizationEdgeTypes.default;
};
