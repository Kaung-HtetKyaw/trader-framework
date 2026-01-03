import NodePlaceholder from '@/components/visualization/ClusterVisualizationDiagram/reactflow/placeholders/NodePlaceholder';

const PodPlaceholder = () => {
  return (
    <div style={{ width: 220, height: 80 }} className=" rounded-sm flex items-center px-[30px] ">
      <NodePlaceholder />
    </div>
  );
};

export default PodPlaceholder;
