import { DropdownOption } from '@/components/Dropdown';
import { useCallback, useMemo } from 'react';
import useStateFromProps from '../useStateFromProps';

/**
 * Configuration for a single filter in the interdependent filter system
 * @template T - The type of nodes being filtered
 */
export type FilterConfig<T> = {
  /** Available options for the filter */
  options: DropdownOption[];
  /** Function to extract the filter value(s) from a node */
  getter: (node: T) => string | string[];
};

/**
 * Props for the useInterdependentFilters hook
 * @template T - The type of nodes being filtered
 * @template Params - The type of filter parameters
 */
export type UseInterdependentFiltersProps<T, Params> = {
  /** Initial set of nodes to be filtered */
  initialNodes: T[];
  /** Current filter parameters */
  params: Params;
  /** Configuration for each filter */
  filters: Record<keyof Params, FilterConfig<T>>;
  /** Callback when filters are applied */
  onApplyFilters: (key: keyof Params, value: string | string[]) => void;
  /** Callback when filters are cleared */
  onClearFilters: () => void;
  /** Transform label for the filter */
  transformLabel?: (label: string) => string;
};

/**
 * Options for an interdependent filter dropdown
 */
export type InterdependentFilterDropdownOptions = {
  /** Display label for the option */
  label: string;
  /** Value of the option */
  value: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Count of items matching this option */
  count?: number;
  /** Whether the option is checked */
  checked?: boolean;
  /** Name of the option */
  name?: string;
};

/**
 * A hook for managing interdependent filters in a UI
 *
 * This hook provides functionality for managing multiple filters where the available options
 * in one filter depend on the selections made in other filters. It handles:
 * - Filter state management
 * - Filter option availability based on other selections
 * - Filter application and clearing
 * - Filter summary generation
 *
 * @template T - The type of nodes being filtered
 * @template Params - The type of filter parameters
 * @template K - Optional type for the filter state, defaults to Record<keyof Params, string[]>
 *
 * @param {UseInterdependentFiltersProps<T, Params>} props - Configuration for the interdependent filters
 *
 * @returns {Object} An object containing filter management functions and state
 * @property {function} getFilterSummary - Gets a summary string for the current filter state
 * @property {function} getFilterState - Gets the current state of a specific filter
 * @property {function} applyFilter - Applies the current temporary filter state
 * @property {function} toggleFilter - Toggles a specific filter value
 * @property {boolean} showClearFilters - Whether clear filters button should be shown
 * @property {function} onClearFilters - Clears all filters
 * @property {function} getAvailableValuesForFilter - Gets available options for a filter based on other selections
 */
const useInterdependentFilters = <T, Params extends Record<string, unknown>, K extends Record<keyof Params, string[]>>(
  props: UseInterdependentFiltersProps<T, Params>
) => {
  const {
    params,
    onApplyFilters: onApplyFiltersProp,
    onClearFilters: onClearFiltersProp,
    initialNodes,
    filters: filtersProp,
    transformLabel = (label: string) => label,
  } = props;

  const [filters, setFilters] = useStateFromProps(
    Object.entries(filtersProp).reduce((acc, cur) => {
      const [key, filterConfig] = cur;

      return {
        ...acc,
        [key]: params[key] || filterConfig.options.map(option => option.value),
      };
    }, {} as K)
  );

  const [tempFilters, setTempFilters] = useStateFromProps(filters);

  const changeFilter = useCallback(
    (type: keyof Params, values: string[]) => {
      setFilters(prev => ({
        ...prev,
        [type]: values,
      }));
    },
    [setFilters]
  );

  const changeTempFilter = useCallback(
    (type: keyof Params, values: string[]) => {
      setTempFilters(prev => {
        return {
          ...prev,
          [type]: values,
        };
      });
    },
    [setTempFilters]
  );

  // Get filter state by type
  const getFilterState = useCallback(
    (type: keyof Params) => {
      return filters[type];
    },
    [filters]
  );

  // Get temp filter state by type
  const getTempFilterState = useCallback(
    (type: keyof Params) => {
      return tempFilters[type];
    },
    [tempFilters]
  );

  // Apply filters
  const applyFilter = (type: keyof Params) => {
    const tempState = getTempFilterState(type);

    if (tempState.length === 0) {
      const allOptions = filtersProp[type].options.map(option => option.value);

      changeFilter(type, allOptions);
      changeTempFilter(type, allOptions);
      onApplyFiltersProp(type, allOptions);

      return;
    }

    changeFilter(type, tempState);
    changeTempFilter(type, tempState);
    onApplyFiltersProp(type, tempState);
  };

  const applySingleFilter = (type: keyof Params, value: string) => {
    changeFilter(type, [value]);
    changeTempFilter(type, [value]);
    onApplyFiltersProp(type, [value]);
  };

  // Toggle filter selection
  const toggleFilter = (type: keyof Params, value: string) => {
    const currentState = getTempFilterState(type);

    changeTempFilter(
      type,
      currentState.includes(value) ? currentState.filter(v => v !== value) : [...currentState, value]
    );
  };

  // TODO: hard to understand, refactor this later
  // Get filtered nodes considering all filters except the current one
  const getNodesFilteredByAllExcept = useCallback(
    (excludeFilterType: keyof Params) => {
      let result = [...initialNodes];

      // Apply all filters except the excluded one
      for (const filterType of Object.keys(filtersProp)) {
        if (filterType !== excludeFilterType) {
          const selectedValues = getFilterState(filterType);
          if (selectedValues.length > 0) {
            // TODO: refactor
            result = result.filter(node => {
              const nodeValue = filtersProp[filterType].getter(node);

              if (!nodeValue) return false;

              if (typeof nodeValue === 'string') {
                return selectedValues.includes(nodeValue);
              } else {
                return selectedValues.some(value => nodeValue.includes(value));
              }
            });
          }
        }
      }

      return result;
    },
    [initialNodes, getFilterState, filtersProp]
  );

  const getAllOptionsByFilterType = useCallback(
    (filterType: keyof Params) => {
      return filtersProp[filterType].options.map(el => el.value);
    },
    [filtersProp]
  );

  // Count nodes for each filter value considering all other applied filters
  const getCountForFilterValue = useCallback(
    (filterType: keyof Params, value: string): number => {
      // Get nodes filtered by all other filters
      const filteredByOthers = getNodesFilteredByAllExcept(filterType);

      // Count nodes that match this value
      return filteredByOthers.filter(node => {
        const nodeValue = filtersProp[filterType].getter(node);

        if (!nodeValue) return false;

        if (typeof nodeValue === 'string') {
          return nodeValue === value;
        } else {
          return nodeValue.includes(value);
        }
      }).length;
    },
    [getNodesFilteredByAllExcept, filtersProp]
  );

  // Get available values for a filter type based on all other applied filters
  const getAvailableValuesForFilter = useCallback(
    (filterType: keyof Params): InterdependentFilterDropdownOptions[] => {
      // Get nodes filtered by all other filters
      const filteredByOthers = getNodesFilteredByAllExcept(filterType);

      // TODO: refactor
      const filters = filteredByOthers.map(node => filtersProp[filterType].getter(node) || '');

      const flattenFilters = typeof filters[0] === 'string' ? (filters as string[]) : filters.flat();

      const allFilters = getAllOptionsByFilterType(filterType);

      const filtersWithZeroCount = allFilters.filter(el => !flattenFilters.includes(el));
      // Get unique values for this filter type from the filtered nodes
      const uniqueValues = new Set([...flattenFilters, ...filtersWithZeroCount]);

      return Array.from(uniqueValues)
        .map(el => {
          const matchedOption = filtersProp[filterType].options.find(option => option.value === el);

          return {
            label: transformLabel(matchedOption?.label || '') || transformLabel(el),
            value: el,
            disabled: !flattenFilters.includes(el),
            count: getCountForFilterValue(filterType, el),
            checked: flattenFilters.includes(el) && getTempFilterState(filterType).includes(el),
          };
        })
        .sort((a, b) => b.count - a.count);
    },
    [
      getNodesFilteredByAllExcept,
      transformLabel,
      getTempFilterState,
      getAllOptionsByFilterType,
      getCountForFilterValue,
      filtersProp,
    ]
  );

  // Helper function to get a summary of selected filters
  const getFilterSummary = (filterType: keyof Params) => {
    const selectedValues = getFilterState(filterType);
    const availableValues = getAvailableValuesForFilter(filterType);

    const selectedOptions = selectedValues
      .map(value => availableValues.find(option => option.value === value))
      .filter(Boolean)
      .filter(el => el?.count);

    if (selectedOptions.length === 0) return 'All';
    if (selectedOptions.length === availableValues.length) return 'All';
    if (selectedOptions.length === 1) return selectedOptions[0]?.label || 'N/A';
    if (selectedOptions.length === 2) return selectedOptions.map(option => option?.label).join(', ');

    return `${selectedOptions.length} selected`;
  };

  const showClearFilters = useMemo(() => {
    return Object.values(params).some(value => value !== null);
  }, [params]);

  const onClearFilters = () => {
    setFilters(prev => {
      return Object.entries(prev).reduce((acc, cur) => {
        const [key] = cur;
        return { ...acc, [key]: filtersProp[key].options.map(option => option.value) };
      }, {} as K);
    });

    setTempFilters(prev => {
      return Object.entries(prev).reduce((acc, cur) => {
        const [key] = cur;
        return { ...acc, [key]: filtersProp[key].options.map(option => option.value) };
      }, {} as K);
    });

    onClearFiltersProp();
  };

  return {
    getFilterSummary,
    getFilterState,
    applyFilter,
    applySingleFilter,
    toggleFilter,
    showClearFilters,
    onClearFilters,
    getAvailableValuesForFilter,
    filterKeys: Object.keys(filtersProp) as (keyof Params)[],
    getCountForFilterValue,
  };
};

export default useInterdependentFilters;
