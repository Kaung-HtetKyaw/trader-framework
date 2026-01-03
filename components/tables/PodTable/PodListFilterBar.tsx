import { Input } from '@/components/ui/input';
import DebounceSearchInput from '@/components/DebouncedInput';
import { PodListFilterParams, PodListParams } from '@/types/pod/list';
import { DropdownOption } from '@/components/Dropdown';
import MultiSelectFilterDropdown from '@/components/MultiSelectFilterDropdown';
import useInterdependentFilters from '@/lib/hooks/useInterdependentFilters';
import { Pod } from '@/types/pod';
import { capitalize, omit } from 'lodash/fp';
import { BaseButton } from '@/components/ui/base-button';
import { X } from 'lucide-react';
import AccumulatedSelectedItemsCounter from '@/components/ClusterInfo/AccumulatedSelectedItemsCounter';
import { useSignals } from '@preact/signals-react/runtime';
import { getSelectedObjectsCount } from '@/signals/tables/selection';

export type PodListFilterBarProps = {
  params: PodListFilterParams;
  namespaceOptions: DropdownOption[];
  initialData: Pod[];
  onSearchChange: (value: string) => void;
  changeParam: (key: keyof PodListParams, value: string | string[]) => void;
  resetParams: () => void;
};

const PodListFilterBar = (props: PodListFilterBarProps) => {
  useSignals();
  const {
    params,
    onSearchChange,
    namespaceOptions: namespaceOptionsProp,
    changeParam,
    initialData,
    resetParams,
  } = props;
  const totalSelectedCount = getSelectedObjectsCount();

  const { getFilterSummary, getAvailableValuesForFilter, applyFilter, toggleFilter, showClearFilters, onClearFilters } =
    useInterdependentFilters({
      initialNodes: initialData,
      params: omit(['search'], params),
      filters: {
        namespace: {
          options: namespaceOptionsProp,
          getter: node => node.namespace,
        },
      },
      onApplyFilters: changeParam,
      onClearFilters: resetParams,
      transformLabel: (label: string) => capitalize(label).split('_').join(' '),
    });

  return (
    <div className="bg-white flex flex-row items-center justify-between w-full gap-3 ">
      <div className="flex flex-row items-center gap-3 w-full">
        <MultiSelectFilterDropdown
          onApplyFilters={() => applyFilter('namespace')}
          label={'Namespace'}
          type="interdependent"
          filterSummary={getFilterSummary('namespace')}
          availableOptions={getAvailableValuesForFilter('namespace')}
          onToggleFilter={value => toggleFilter('namespace', value)}
          maxMenuHeight={300}
          enableSearch
        />

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

        {showClearFilters && (
          <BaseButton className="text-text-950 body-1 font-normal" variant="text" onClick={onClearFilters}>
            <X size={18} />
            <span>Clear Filters</span>
          </BaseButton>
        )}
      </div>

      {totalSelectedCount > 0 && (
        <div className="flex flex-row items-center gap-3">
          <AccumulatedSelectedItemsCounter />
        </div>
      )}
    </div>
  );
};

export default PodListFilterBar;
