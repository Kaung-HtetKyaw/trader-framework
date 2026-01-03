import { Input } from '@/components/ui/input';
import DebounceSearchInput from '@/components/DebouncedInput';
import { PodListFilterParams } from '@/types/pod/list';
import AccumulatedSelectedItemsCounter from '@/components/ClusterInfo/AccumulatedSelectedItemsCounter';
import { useSignals } from '@preact/signals-react/runtime';
import { getSelectedObjectsCount } from '@/signals/tables/selection';

export type NodeListFilterBarProps = {
  params: PodListFilterParams;
  onSearchChange: (value: string) => void;
};

const NodeListFilterBar = (props: NodeListFilterBarProps) => {
  useSignals();
  const { params, onSearchChange } = props;
  const totalSelectedCount = getSelectedObjectsCount();

  return (
    <div className="bg-white flex w-full flex-row items-center justify-between gap-3 ">
      <div className="flex w-full flex-row items-center gap-3">
        <DebounceSearchInput debounce={500} setState={onSearchChange} defaultValue={params.search}>
          {(setValue, value) => (
            <Input
              required
              type="text"
              placeholder="Search keywords"
              className={'border-text-200 w-full rounded-sm focus-visible:ring-0'}
              onChange={e => setValue(e.target.value)}
              value={value}
            />
          )}
        </DebounceSearchInput>
      </div>

      {totalSelectedCount > 0 && (
        <div className="flex flex-row items-center gap-3">
          <AccumulatedSelectedItemsCounter />
        </div>
      )}
    </div>
  );
};

export default NodeListFilterBar;
