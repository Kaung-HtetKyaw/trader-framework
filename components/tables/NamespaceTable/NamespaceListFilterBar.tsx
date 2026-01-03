import { DropdownOption } from '@/components/Dropdown';
import { BaseButton } from '@/components/ui/base-button';
import { X } from 'lucide-react';
import useInterdependentFilters from '@/lib/hooks/useInterdependentFilters';
import MultiSelectFilterDropdown from '@/components/MultiSelectFilterDropdown';
import { capitalize, omit } from 'lodash/fp';
import { NamespaceListFilterParams, NamespaceListParams } from '@/types/namespace/list';
import { Namespace } from '@/types/namespace';
import { Input } from '@/components/ui/input';
import DebounceSearchInput from '@/components/DebouncedInput';
import AccumulatedSelectedItemsCounter from '@/components/ClusterInfo/AccumulatedSelectedItemsCounter';
import { useSignals } from '@preact/signals-react/runtime';
import { getSelectedObjectsCount } from '@/signals/tables/selection';

export type NamespaceListFilterBarProps = {
  initialData: Namespace[];
  params: NamespaceListFilterParams;
  labelOptions: DropdownOption[];
  changeParam: (key: keyof NamespaceListParams, value: string | string[]) => void;
  resetParams: () => void;
  onSearchChange: (value: string) => void;
};

const NamespaceListFilterBar = (props: NamespaceListFilterBarProps) => {
  useSignals();

  const { changeParam, resetParams, initialData, labelOptions, params, onSearchChange } = props;
  const totalSelectedCount = getSelectedObjectsCount();

  const { getFilterSummary, getAvailableValuesForFilter, applyFilter, toggleFilter, showClearFilters, onClearFilters } =
    useInterdependentFilters({
      initialNodes: initialData,
      params: omit(['search'], params),
      filters: {
        label: {
          options: labelOptions,
          getter: (node: Namespace) => node.labels.map(el => el.value),
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
          onApplyFilters={() => applyFilter('label')}
          label={'Labels'}
          type="interdependent"
          filterSummary={getFilterSummary('label')}
          availableOptions={getAvailableValuesForFilter('label')}
          onToggleFilter={value => toggleFilter('label', value)}
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
      </div>

      {totalSelectedCount > 0 && (
        <div className="flex flex-row items-center gap-3">
          <AccumulatedSelectedItemsCounter />

          {showClearFilters && (
            <BaseButton className="text-text-950 body-1 font-normal" variant="text" onClick={onClearFilters}>
              <X size={18} />
              <span>Clear Filters</span>
            </BaseButton>
          )}
        </div>
      )}
    </div>
  );
};

export default NamespaceListFilterBar;
