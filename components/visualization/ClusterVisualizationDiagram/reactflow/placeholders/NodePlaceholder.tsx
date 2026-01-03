import { DEFAULT_VISUALIZATION_DIMENSIONS } from '@/lib/visualization';

const NodePlaceholder = () => {
  return (
    <div
      style={{ width: DEFAULT_VISUALIZATION_DIMENSIONS.container.width }}
      className="h-6 flex items-center justify-center"
    >
      <div className="bg-text-100 h-[20px] w-full "></div>
    </div>
  );
};

export default NodePlaceholder;
