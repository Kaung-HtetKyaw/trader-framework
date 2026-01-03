import { CircularCloseIcon } from '@/components/svgs/CircularCloseIcon';
import { clearSelections, getSelectedObjectsCount } from '@/signals/tables/selection';
import { useSignals } from '@preact/signals-react/runtime';

const AccumulatedSelectedItemsCounter = () => {
  useSignals();
  const totalSelectedCount = getSelectedObjectsCount();

  const handleClearAll = () => {
    clearSelections();
  };

  if (totalSelectedCount === 0) return null;

  return (
    <div className="flex items-center rounded-2xl bg-white gap-2">
      <div className="flex items-center bg-white rounded-lg border border-text-200 px-4 py-2 gap-2 min-w-[120px] justify-between">
        <span className="font-inter text-[12px] font-semibold leading-[130%]">{totalSelectedCount}</span>
        <span className="font-inter text-[12px] font-normal leading-[130%]">selected</span>

        <button
          onClick={handleClearAll}
          className="text-text-500 hover:text-text-500 transition-colors"
          aria-label="Deselect all"
        >
          <CircularCloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AccumulatedSelectedItemsCounter;
