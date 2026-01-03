import { Check } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DropdownOption } from '.';
import BaseDropdown, { RenderOptionItemProps } from './BaseDropdown';
import useStateFromProps from '@/lib/hooks/useStateFromProps';

/**
 * Props for rendering individual items in the SingleSelectDropdown
 */
export type SingleSelectDropdownItemProps<T extends DropdownOption<string>> = RenderOptionItemProps<T> & {
  /** Callback when an option is selected */
  onSelect: () => void;
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Function to close the dropdown */
  closeDropdown: () => void;
  /** Whether to close the dropdown when an option is selected */
  closeOnSelect?: boolean;
};

const SingleSelectDropdownItem = <T extends DropdownOption<string>>(props: SingleSelectDropdownItemProps<T>) => {
  const { option, isSelected, onSelect, closeOnSelect = true, closeDropdown } = props;

  const onClick = () => {
    onSelect();
    if (closeOnSelect) {
      closeDropdown();
    }
  };

  return (
    <span onClick={onClick} className="flex items-center justify-between  w-full gap-2">
      {option.label}
      <Check className={cn('ml-auto', isSelected ? 'opacity-100' : 'opacity-0')} />
    </span>
  );
};

/**
 * SingleSelectDropdown component that allows users to select a single option from a list.
 * Built on top of BaseDropdown with single-selection specific functionality.
 *
 * @example
 * ```tsx
 * <SingleSelectDropdown
 *   options={[
 *     { label: "Option 1", value: "1" },
 *     { label: "Option 2", value: "2" }
 *   ]}
 *   onChange={(selected) => console.log(selected)}
 *   placeholder="Select an option"
 * />
 * ```
 */
export type SingleSelectDropdownProps<T extends DropdownOption<string>> = {
  /** Array of options to display in the dropdown */
  options: T[];
  /** Callback when an option is selected */
  onChange: (selectedOption: T) => void;
  /** Error message to display */
  error?: string;
  /** Whether to close the dropdown when an option is selected */
  closeOnSelect?: boolean;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Message to display when no options match the search */
  notFoundMessage?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Whether to enable search functionality */
  enableSearch?: boolean;
};

const SingleSelectDropdown = <T extends DropdownOption<string>>(props: SingleSelectDropdownProps<T>) => {
  const {
    options,
    onChange: onChangeProp,
    error,
    closeOnSelect,
    placeholder,
    notFoundMessage,
    searchPlaceholder,
    enableSearch,
  } = props;

  const [selectedItem, setSelectedItem] = useStateFromProps(options[0]);

  useEffect(() => {
    // set the first item as the selected item by default
    setSelectedItem(options[0]);
    onChangeProp(options[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (selectedOption: T) => {
    setSelectedItem(selectedOption);
    onChangeProp(selectedOption);
  };

  return (
    <BaseDropdown
      options={options}
      error={error}
      placeholder={placeholder}
      notFoundMessage={notFoundMessage}
      searchPlaceholder={searchPlaceholder}
      enableSearch={enableSearch}
      renderTriggerContent={() =>
        selectedItem ? (
          <span className="text-text-950">{selectedItem.label}</span>
        ) : (
          <span className="text-text-500">Select a key</span>
        )
      }
      renderOptionItem={renderOptionItemProps => (
        <SingleSelectDropdownItem
          {...renderOptionItemProps}
          onSelect={() => onChange(renderOptionItemProps.option)}
          isSelected={selectedItem?.value === renderOptionItemProps.option.value}
          closeOnSelect={closeOnSelect}
        />
      )}
    />
  );
};

export default SingleSelectDropdown;
