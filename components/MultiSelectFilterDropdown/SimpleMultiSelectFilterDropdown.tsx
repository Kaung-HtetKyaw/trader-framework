import { useCallback, useMemo, useRef, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { DropdownOption } from '../Dropdown';
import { BaseButton } from '../ui/base-button';
import DebounceSearchInput from '../DebouncedInput';
import { Input } from '../ui/input';
import { capitalize } from 'lodash/fp';
import HighlightedText from '../HighlightedText';

export const SimpleMultiSelectFilterDropdownSubmitTypes = { reactive: 'reactive', apply: 'apply' } as const;
export type SimpleMultiSelectFilterDropdownSubmitTypeEnum = keyof typeof SimpleMultiSelectFilterDropdownSubmitTypes;

export type SimpleMultiSelectFilterDropdownProps = {
  options: DropdownOption[];
  selectedValues: string[];
  submitType: SimpleMultiSelectFilterDropdownSubmitTypeEnum;
  onApplyFilters?: (closeDropdown: () => void) => void;
  onChange?: (values: string[]) => void;
  onOpenChange?: (open: boolean) => void;
  label: string;
  showCounts?: boolean;
  disabled?: boolean;
  applyDisabled?: boolean;
  maxLabelLength?: number;
};

const DropdownOptionItems = (props: {
  options: DropdownOption[];
  selectedValues: string[];
  toggleFilter: (value: string) => void;
  showCounts: boolean;
  search: string;
  maxLabelLength?: number;
}) => {
  const { options, selectedValues, toggleFilter, showCounts, search, maxLabelLength } = props;
  return (
    <div className="flex flex-col">
      {options.length === 0 ? (
        <div className="text-xs text-text-400 px-2 py-4 text-center">No result!</div>
      ) : (
        options.map(option => (
          <OptionItem
            key={option.value}
            option={option}
            checked={selectedValues.includes(option.value)}
            showCounts={showCounts}
            toggleFilter={toggleFilter}
            search={search}
            maxLabelLength={maxLabelLength}
          />
        ))
      )}
    </div>
  );
};

const OptionItem = (props: {
  option: DropdownOption;
  checked: boolean;
  showCounts: boolean;
  toggleFilter: (value: string) => void;
  search: string;
  maxLabelLength?: number;
}) => {
  const { option, checked, showCounts, toggleFilter, search, maxLabelLength } = props;

  return (
    <div
      key={option.value}
      className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
    >
      <Checkbox
        id={`cluster-${option.value.toLowerCase()}`}
        checked={checked}
        onCheckedChange={() => toggleFilter(option.value)}
        className="w-[1.125rem] h-[1.125rem] border border-text-200 rounded-[4px] data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50 shadow-none focus:shadow-none"
      />
      <label
        htmlFor={`cluster-${option.value.toLowerCase()}`}
        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
        title={maxLabelLength && option.label.length > maxLabelLength ? option.label : undefined}
      >
        <span className={`body-1 capitalize text-text-950'}`}>
          <HighlightedText text={option.label} search={search} maxLength={maxLabelLength} />
          {showCounts && ` (${option.count || 0})`}
        </span>
      </label>
    </div>
  );
};

const SimpleMultiSelectFilterDropdown = ({
  options,
  submitType,
  onChange,
  onOpenChange: onOpenChangeProp,
  onApplyFilters: onApplyFiltersProp,
  selectedValues,
  label,
  maxLabelLength,
  showCounts = false,
  disabled = false,
  applyDisabled = false,
}: SimpleMultiSelectFilterDropdownProps) => {
  const [width, setWidth] = useState(250);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter(option => option.label.toLowerCase().includes(search.trim().toLowerCase()));
  }, [search, options]);

  const selectedOptions = useMemo(
    () => options.filter(option => selectedValues.includes(option.value)),
    [selectedValues, options]
  );

  const getValues = useMemo(() => (opts: DropdownOption[]) => opts.map(opt => opt.value), []);

  const handleSelectAll = useMemo(
    () => () => {
      if (onChange) onChange(getValues(filteredOptions));
    },
    [filteredOptions, onChange, getValues]
  );

  const handleClearSelection = useMemo(
    () => () => {
      if (onChange) onChange([]);
    },
    [onChange]
  );

  const toggleFilter = useMemo(
    () => (filter: string) => {
      const isSelected = selectedValues.includes(filter);
      const updatedValues = isSelected ? selectedValues.filter(value => value !== filter) : [...selectedValues, filter];
      if (onChange) onChange(updatedValues);
    },
    [selectedValues, onChange]
  );

  const getFilterSummary = useMemo(
    () => (filters: DropdownOption[], allCount: number) => {
      if (filters.length === allCount) return 'All';
      if (filters.length === 0) return 'None';
      if (filters.length === 1) return filters[0].label;
      if (filters.length <= 3) return `${filters.length} selected`;
      return `${filters.length} selected`;
    },
    []
  );

  const onApplyFilters = useCallback(() => {
    if (!onApplyFiltersProp) return;
    onApplyFiltersProp(() => setIsOpen(false));
  }, [onApplyFiltersProp]);

  const onOpenChange = (open: boolean) => {
    if (disabled) return;
    setIsOpen(open);
    if (open) {
      setWidth(triggerRef.current?.offsetWidth || 250);
    }

    if (onOpenChangeProp) {
      onOpenChangeProp(open);
    }
  };

  if (disabled) {
    return (
      <div className="min-w-[auto] justify-between rounded-sm border-text-200 h-9 px-4 flex items-center gap-1 bg-text-50 text-text-400 cursor-not-allowed select-none">
        <div className="flex items-center gap-1">
          <span className="text-text-400 flex items-center gap-1 font-semibold truncate max-w-full">{label}</span>
          <span className="text-text-400">:</span>
          <span className="text-text-400 truncate max-w-full">{getFilterSummary(selectedOptions, options.length)}</span>
        </div>
        <ChevronDown size={14} className="text-text-400 ml-1" />
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <BaseButton
          ref={triggerRef}
          variant="outlined"
          className={`border min-w-[200px] justify-between rounded-sm border-text-200 hover:bg-transparent h-9 px-4 flex items-center gap-2 bg-white `}
        >
          <div className="flex flex-row items-center gap-1">
            <span className={'text-secondary-500 truncate max-w-full'}>{label}:</span>
          </div>
          <div className="flex flex-row items-center gap-[10px]">
            <span className={`body-1 capitalize text-text-950 truncate max-w-full`}>
              {getFilterSummary(selectedOptions, options.length)}
            </span>
            <ChevronDown size={14} className="text-text-400" />
          </div>
        </BaseButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{ minWidth: `${width}px`, width: 'auto' }}
        className="bg-white p-3 mt-2"
      >
        <div className="flex flex-col gap-2">
          <DebounceSearchInput defaultValue={search} setState={setSearch}>
            {(setValue, value) => (
              <Input
                type="text"
                placeholder={`Search ${capitalize(label)}`}
                className={'border-text-200 w-full h-8 text-xs rounded-sm focus-visible:ring-0'}
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            )}
          </DebounceSearchInput>

          <div className="flex flex-row justify-between items-center mb-2 px-1">
            <button
              type="button"
              className="text-xs text-text-400 font-normal focus:outline-none"
              onClick={handleSelectAll}
              tabIndex={-1}
            >
              Select All
            </button>
            <button
              type="button"
              className="text-xs text-text-400 focus:outline-none"
              onClick={handleClearSelection}
              tabIndex={-1}
            >
              Clear
            </button>
          </div>
          <ScrollArea className="pr-2 max-h-[248px] overflow-y-auto scroll-container">
            <div className="flex flex-col gap-3">
              <DropdownOptionItems
                options={filteredOptions}
                selectedValues={selectedValues}
                toggleFilter={toggleFilter}
                showCounts={showCounts}
                search={search}
                maxLabelLength={maxLabelLength}
              />
            </div>
          </ScrollArea>
          {!!filteredOptions.length &&
            !!onApplyFilters &&
            submitType === SimpleMultiSelectFilterDropdownSubmitTypes.apply && (
              <BaseButton
                variant="contained"
                className="w-full mt-2 bg-primary-950 text-white hover:bg-primary-900"
                onClick={onApplyFilters}
                disabled={applyDisabled}
              >
                Apply
              </BaseButton>
            )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SimpleMultiSelectFilterDropdown;
