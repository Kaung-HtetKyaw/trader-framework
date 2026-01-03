import { DropdownOption } from '../Dropdown';
import { omit } from 'lodash/fp';
import InterdependentSingleSelectFilterDropdown, {
  InterdependentSingleSelectFilterDropdownProps as InterdependentSingleSelectFilterDropdownPropsType,
} from './InterdependentSingleSelectFilterDropdown';

/**
 * Base props shared by all multi-select filter dropdown implementations
 */
export type BaseMultiSelectFilterDropdownProps<T extends DropdownOption> = {
  /** Available options for the dropdown */
  options: T[];
  /** Currently selected values */
  selectedValues: string[];
  /** Whether all options are selected */
  isAllSelected?: boolean;
  /** Callback when filters are applied */
  onApplyFilters: (filters: T[]) => void;
  /** Label for the dropdown */
  label: string;
};

/**
 * Props for the interdependent multi-select filter dropdown implementation
 */
type InterdependentSingleSelectFilterDropdownProps = InterdependentSingleSelectFilterDropdownPropsType & {
  /** Type discriminator for the interdependent implementation */
  type: 'interdependent';
};

/**
 * Union type of all possible multi-select filter dropdown props
 */
export type SingleSelectFilterDropdownProps = InterdependentSingleSelectFilterDropdownProps;

const SingleSelectFilterDropdown = (props: SingleSelectFilterDropdownProps) => {
  const { type } = props;

  // TODO: both dropdowns have duplicated UI, make shared UI components later
  switch (type) {
    case 'interdependent':
      return <InterdependentSingleSelectFilterDropdown {...omit(['type'], props)} />;
  }
};

export default SingleSelectFilterDropdown;
