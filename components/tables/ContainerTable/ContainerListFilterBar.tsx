import { Input } from '@/components/ui/input';
import DebounceSearchInput from '@/components/DebouncedInput';
import { DropdownOption } from '@/components/Dropdown';
import { ContainerListFilterParams, ContainerListParams } from '@/types/container/list';
import useInterdependentFilters from '@/lib/hooks/useInterdependentFilters';
import { capitalize, omit } from 'lodash/fp';
import { ContainerDetails } from '@/types/container';
import MultiSelectFilterDropdown from '@/components/MultiSelectFilterDropdown';
import AccumulatedSelectedItemsCounter from '@/components/ClusterInfo/AccumulatedSelectedItemsCounter';
import { useSignals } from '@preact/signals-react/runtime';
import { getSelectedObjectsCount } from '@/signals/tables/selection';

export type ContainerListFilterBarProps = {
  params: ContainerListFilterParams;
  initialData: ContainerDetails[];
  namespaceOptions: DropdownOption[];
  podOptions: DropdownOption[];
  onSearchChange: (value: string) => void;
  changeParam: (key: keyof ContainerListParams, value: string | string[]) => void;
  resetParams: () => void;
  isFetching: boolean;
};

const ContainerListFilterBar = (props: ContainerListFilterBarProps) => {
  useSignals();
  const { params, onSearchChange, initialData, changeParam, namespaceOptions, podOptions, resetParams } = props;
  const totalSelectedCount = getSelectedObjectsCount();

  const { getFilterSummary, getAvailableValuesForFilter, applyFilter, toggleFilter } = useInterdependentFilters({
    initialNodes: initialData,
    params: omit(['search'], params),
    filters: {
      namespace: {
        options: namespaceOptions,
        getter: node => node.namespace,
      },

      pod: {
        options: podOptions,
        getter: node => node.podID,
      },
    },
    onApplyFilters: changeParam,
    onClearFilters: resetParams,
    transformLabel: (label: string) => capitalize(label).split('_').join(' '),
  });

  return (
    <div className="bg-white flex flex-row items-center gap-2">
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
      <MultiSelectFilterDropdown
        onApplyFilters={() => applyFilter('pod')}
        label={'Pod'}
        type="interdependent"
        filterSummary={getFilterSummary('pod')}
        availableOptions={getAvailableValuesForFilter('pod')}
        onToggleFilter={value => toggleFilter('pod', value)}
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

      {totalSelectedCount > 0 && (
        <div className="ml-auto">
          <AccumulatedSelectedItemsCounter />
        </div>
      )}
    </div>
  );
};

export default ContainerListFilterBar;
