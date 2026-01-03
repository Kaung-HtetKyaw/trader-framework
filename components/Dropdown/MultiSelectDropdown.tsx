import { Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DropdownOption } from '.';
import BaseDropdown, { RenderOptionItemProps } from './BaseDropdown';
import SelectedItemBadge from './SelectedItemBadge';

/**
 * Props for rendering individual items in the MultiSelectDropdown
 */
export type MultiSelectDropdownItemProps<T extends DropdownOption<string> = DropdownOption<string>> =
  RenderOptionItemProps<T> & {
    /** Callback when an option is selected */
    onSelect: () => void;
    /** Whether this option is currently selected */
    isSelected: boolean;
    /** Function to close the dropdown */
    closeDropdown: () => void;
    /** Whether to close the dropdown when an option is selected */
    closeOnSelect?: boolean;
  };

const MultiSelectDropdownItem = <T extends DropdownOption<string>>(props: MultiSelectDropdownItemProps<T>) => {
  const { option, isSelected, onSelect, closeDropdown, closeOnSelect = false } = props;

  const onClick = () => {
    onSelect();
    if (closeOnSelect) {
      closeDropdown();
    }
  };

  return (
    <span onClick={onClick} className="flex items-center justify-between w-full gap-2">
      {option.label}
      <Check className={cn('ml-auto', isSelected ? 'opacity-100' : 'opacity-0')} />
    </span>
  );
};

/**
 * Props for rendering the list of selected items
 */
export type SelectedItemListProps<T extends DropdownOption<string>> = {
  /** Array of currently selected items */
  selectedItems: T[];
  /** Placeholder text when no items are selected */
  placeholder?: string;
  /** Callback when an item is removed */
  onRemoveItem: (item: T) => void;
};

const SelectedItemList = <T extends DropdownOption<string>>(props: SelectedItemListProps<T>) => {
  const { selectedItems, onRemoveItem, placeholder } = props;

  if (selectedItems.length === 0) {
    return <span className="text-text-500">{placeholder}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {selectedItems.map(item => (
        <SelectedItemBadge key={item.value} item={item} onRemove={onRemoveItem} />
      ))}
    </div>
  );
};

/**
 * MultiSelectDropdown component that allows users to select multiple options from a list.
 * Built on top of BaseDropdown with multi-selection specific functionality.
 *
 * @example
 * ```tsx
 * <MultiSelectDropdown
 *   options={[
 *     { label: "Option 1", value: "1" },
 *     { label: "Option 2", value: "2" }
 *   ]}
 *   onChange={(selected) => console.log(selected)}
 *   maxSelections={3}
 *   placeholder="Select multiple options"
 * />
 * ```
 */
// TODO: replace some options and extend using BaseDropdownProps
export type MultiSelectDropdownProps<T extends DropdownOption<string>> = {
  /** Array of options to display in the dropdown */
  options: T[];
  /** Callback when options are selected/deselected */
  onChange: (selectedOption: T, allSelectedOptions: T[]) => void;
  /** Maximum number of items that can be selected */
  maxSelections?: number;
  /** Error message to display */
  error?: string;
  /** Whether to close the dropdown when an option is selected */
  closeOnSelect?: boolean;
  /** Placeholder text when no options are selected */
  placeholder?: string;
  /** Message to display when no options match the search */
  notFoundMessage?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
};

const MultiSelectDropdown = <T extends DropdownOption<string>>(props: MultiSelectDropdownProps<T>) => {
  const { options, onChange, maxSelections, error, closeOnSelect, placeholder, notFoundMessage, searchPlaceholder } =
    props;

  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const onSelectItem = (option: T) => {
    if (maxSelections && selectedItems.length >= maxSelections) {
      return;
    }

    setSelectedItems(prev => {
      if (prev.some(item => item.value === option.value)) {
        return prev.filter(item => item.value !== option.value);
      }

      return [...prev, option];
    });
    onChange(option, [...selectedItems, option]);
  };

  const onRemoveItem = (optionToRemove: T) => {
    setSelectedItems(prev => prev.filter(item => item !== optionToRemove));
    onChange(
      optionToRemove,
      selectedItems.filter(item => item.value !== optionToRemove.value)
    );
  };

  const isSelected = (option: T) => selectedItems.some(item => item.value === option.value);

  return (
    <BaseDropdown
      options={options}
      error={error}
      renderTriggerContent={() => (
        <SelectedItemList selectedItems={selectedItems} onRemoveItem={onRemoveItem} placeholder={placeholder} />
      )}
      renderOptionItem={renderOptionItemProps => (
        <MultiSelectDropdownItem
          {...renderOptionItemProps}
          onSelect={() => onSelectItem(renderOptionItemProps.option)}
          isSelected={isSelected(renderOptionItemProps.option)}
          closeOnSelect={closeOnSelect}
        />
      )}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      notFoundMessage={notFoundMessage}
    />
  );
};

export default MultiSelectDropdown;
