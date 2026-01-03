import { DropdownOption } from '../Dropdown';
import SimpleMultiSelectFilterDropdown, {
  SimpleMultiSelectFilterDropdownProps as SimpleMultiSelectFilterDropdownPropsType,
} from './SimpleMultiSelectFilterDropdown';
import InterdependentMultiSelectFilterDropdown, {
  InterdependentMultiSelectFilterDropdownProps as InterdependentMultiSelectFilterDropdownPropsType,
} from './InterdependentMultiSelectFilterDropdown';
import { omit } from 'lodash/fp';

/**
 * Base props shared by all multi-select filter dropdown implementations
 */
export type BaseMultiSelectFilterDropdownProps = {
  /** Available options for the dropdown */
  options: DropdownOption[];
  /** Currently selected values */
  selectedValues: string[];
  /** Whether all options are selected */
  isAllSelected?: boolean;
  /** Callback when filters are applied */
  onApplyFilters: (filters: DropdownOption[]) => void;
  /** Label for the dropdown */
  label: string;
};

/**
 * Props for the simple multi-select filter dropdown implementation
 */
type SimpleMultiSelectFilterDropdownProps = SimpleMultiSelectFilterDropdownPropsType & {
  /** Type discriminator for the simple implementation */
  type: 'base';
};

/**
 * Props for the interdependent multi-select filter dropdown implementation
 */
type InterdependentMultiSelectFilterDropdownProps = InterdependentMultiSelectFilterDropdownPropsType & {
  /** Type discriminator for the interdependent implementation */
  type: 'interdependent';
};

/**
 * Union type of all possible multi-select filter dropdown props
 */
export type MultiSelectFilterDropdownProps =
  | SimpleMultiSelectFilterDropdownProps
  | InterdependentMultiSelectFilterDropdownProps;

/**
 * An Adapter component that provides a unified interface
 * for different types of multi-select filter dropdowns.
 *
 * This component acts as an adapter between two different filter implementations:
 * - SimpleMultiSelectFilterDropdown: Basic multi-select functionality
 * - InterdependentMultiSelectFilterDropdown: Advanced filtering with interdependent options
 *
 *
 * @example
 * ```tsx
 * // Simple implementation
 * <MultiSelectFilterDropdown
 *   type="base"
 *   options={options}
 *   selectedValues={values}
 *   onApplyFilters={handleApply}
 *   label="Filter"
 * />
 *
 * // Interdependent implementation
 * <MultiSelectFilterDropdown
 *   type="interdependent"
 *   availableOptions={availableOptions}
 *   onApplyFilters={handleApply}
 *   filterSummary={filterSummary}
 *   onToggleFilter={handleToggle}
 *   label="Filter"
 * />
 * ```
 *
 * @param {MultiSelectFilterDropdownProps} props - The props for the filter dropdown
 * @returns {JSX.Element} The appropriate filter dropdown implementation
 */
const MultiSelectFilterDropdown = (props: MultiSelectFilterDropdownProps) => {
  const { type } = props;

  // TODO: both dropdowns have duplicated UI, make shared UI components later
  switch (type) {
    case 'base':
      return <SimpleMultiSelectFilterDropdown {...omit(['type'], props)} />;
    case 'interdependent':
      return <InterdependentMultiSelectFilterDropdown {...omit(['type'], props)} />;
  }
};

export default MultiSelectFilterDropdown;
