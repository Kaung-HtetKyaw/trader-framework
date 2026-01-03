import { signal } from '@preact/signals-react';
import { RFVisualizationEdge } from '@/types/visualization/react-flow';

const edges = signal<RFVisualizationEdge[]>([]);

const getEdges = () => {
  return edges.value;
};

const getVisibleEdges = () => {
  return edges.value.filter(edge => !edge.hidden);
};

const getHiddenEdges = () => {
  return edges.value.filter(edge => edge.hidden);
};

const initEdges = (data: RFVisualizationEdge[]) => {
  edges.value = data;
};

const resetEdgesSignal = () => {
  edges.value = [];
};

export { edges, getEdges, getVisibleEdges, getHiddenEdges, initEdges, resetEdgesSignal };
