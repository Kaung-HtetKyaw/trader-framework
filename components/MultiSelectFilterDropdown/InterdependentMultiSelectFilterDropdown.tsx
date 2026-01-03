import { ReactNode, useMemo, useRef, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { BaseButton } from '../ui/base-button';
import { InterdependentFilterDropdownOptions } from '@/lib/hooks/useInterdependentFilters';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { capitalize } from 'lodash/fp';
import DebounceSearchInput from '../DebouncedInput';
import CustomEllipsis from '../CustomEllipsis';

export type InterdependentMultiSelectFilterDropdownProps = {
  onApplyFilters: (closeDropdown: () => void) => void;
  label: string;
  filterSummary: string;
  availableOptions: InterdependentFilterDropdownOptions[];
  onToggleFilter: (value: string) => void;
  icon?: ReactNode;
  enableSearch?: boolean;
  defaultSearchValue?: string;
  maxMenuHeight?: number;
  disabled?: boolean;
  maxLabelLength?: number;
  onOpenChange?: (open: boolean) => void;
};

const DropdownOptionItems = (props: {
  options: InterdependentFilterDropdownOptions[];
  onToggleFilter: (value: string) => void;
  maxLabelLength?: number;
  label: string;
}) => {
  const { options, onToggleFilter, maxLabelLength, label } = props;
  return options.length ? (
    options.map(option => (
      <OptionItem key={option.value} option={option} maxLabelLength={maxLabelLength} onToggleFilter={onToggleFilter} />
    ))
  ) : (
    <div className="flex items-center justify-center h-10 ">
      <p className="text-text-400 body-2 capitalize"> No {label ? capitalize(label) : 'options'} found</p>
    </div>
  );
};

const OptionItem = (props: {
  option: InterdependentFilterDropdownOptions;
  maxLabelLength?: number;
  onToggleFilter: (value: string) => void;
}) => {
  const { option, maxLabelLength, onToggleFilter } = props;

  return (
    <div
      key={option.value}
      className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
    >
      <Checkbox
        id={`cluster-${option.value.toLowerCase()}`}
        disabled={option.disabled}
        checked={option.checked}
        onCheckedChange={() => onToggleFilter(option.value)}
        className="w-[1.125rem] shadow-none h-[1.125rem] border border-text-200 rounded-[4px]  data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50"
      />

      <label
        htmlFor={`cluster-${option.value.toLowerCase()}`}
        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
      >
        <span className={`body-1 capitalize text-text-950'}`}>
          {maxLabelLength ? (
            <CustomEllipsis text={option.label} maxLength={maxLabelLength} />
          ) : (
            <>
              {option.label} ({option.count})
            </>
          )}
        </span>
      </label>
    </div>
  );
};

// * This component delegates the logic to the useInterdependentFilters hook, implementation details might change in the future
const InterdependentMultiSelectFilterDropdown = (props: InterdependentMultiSelectFilterDropdownProps) => {
  const {
    onApplyFilters: onApplyFiltersProp,
    label,
    icon,
    filterSummary,
    availableOptions,
    onToggleFilter,
    enableSearch,
    maxMenuHeight,
    defaultSearchValue = '',
    disabled = false,
    maxLabelLength,
    onOpenChange: onOpenChangeProp,
  } = props;

  const [width, setWidth] = useState(250);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(defaultSearchValue);

  const onApplyFilters = () => {
    if (!onApplyFiltersProp) return;
    onApplyFiltersProp(() => setOpen(false));
    setOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      setWidth(triggerRef.current?.offsetWidth || 250);
    }

    if (onOpenChangeProp) {
      onOpenChangeProp(open);
    }
  };

  const filteredOptions = useMemo(() => {
    return availableOptions.filter(option => {
      return (
        option.value.toLowerCase().includes(search.toLowerCase()) ||
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [availableOptions, search]);

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <BaseButton
          ref={triggerRef}
          variant="outlined"
          className={cn(
            'border min-w-[auto] justify-between rounded-sm border-text-200 hover:bg-transparent h-9 px-4  flex items-center gap-1 bg-white',
            disabled && 'bg-text-50'
          )}
        >
          <div className="flex items-center gap-1">
            <div className="flex flex-row items-center gap-1">
              {icon}

              <span className="text-secondary-500">{label}: </span>
            </div>

            <div className="flex flex-row items-center gap-[10px]">
              <CustomEllipsis maxLength={25} className="text-text-950 body-1 capitalize" text={filterSummary} />
            </div>
          </div>

          <ChevronDown size={14} className="text-text-400" />
        </BaseButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ minWidth: `${width}px`, width: 'auto' }}
        align="start"
        className={cn(' bg-white  p-3')}
      >
        {availableOptions.length ? (
          <div className="flex flex-col gap-2">
            {enableSearch && (
              <DebounceSearchInput defaultValue={search} setState={setSearch}>
                {(setValue, value) => (
                  <Input
                    type="text"
                    placeholder={`Search ${capitalize(label)}`}
                    className={'border-text-200 w-full mb-2 rounded-sm focus-visible:ring-0'}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  />
                )}
              </DebounceSearchInput>
            )}

            <ScrollArea
              id="scroll-container"
              style={{ maxHeight: maxMenuHeight ? `${maxMenuHeight}px` : 'none' }}
              className={cn('scroll ', maxMenuHeight && 'overflow-y-auto')}
            >
              <div className="flex flex-col">
                <DropdownOptionItems
                  options={filteredOptions}
                  onToggleFilter={onToggleFilter}
                  maxLabelLength={maxLabelLength}
                  label={label}
                />
              </div>
            </ScrollArea>

            {!!filteredOptions.length && (
              <BaseButton
                variant="contained"
                className="w-full mt-2 bg-primary-950 text-white hover:bg-primary-900"
                onClick={onApplyFilters}
              >
                Apply
              </BaseButton>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 ">
            <p className="text-text-400 body-2 capitalize"> No {label ? capitalize(label) : 'options'} found</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InterdependentMultiSelectFilterDropdown;
