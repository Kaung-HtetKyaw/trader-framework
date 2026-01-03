import { ReactNode, useMemo, useRef, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { BaseButton } from '../ui/base-button';
import { InterdependentFilterDropdownOptions } from '@/lib/hooks/useInterdependentFilters';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { capitalize } from 'lodash/fp';
import DebounceSearchInput from '../DebouncedInput';

export type InterdependentSingleSelectFilterDropdownProps = {
  label: string;
  filterSummary: string;
  availableOptions: InterdependentFilterDropdownOptions[];
  onSelectOption: (option: InterdependentFilterDropdownOptions) => void;
  icon?: ReactNode;
  enableSearch?: boolean;
  defaultSearchValue?: string;
  maxMenuHeight?: number;
  minWidth?: number;
  fullWidth?: boolean;
  disabled?: boolean;
  filterSummaryClassName?: string;
  menuContentClassName?: string;
};

// * This component delegates the logic to the useInterdependentFilters hook, implementation details might change in the future
const InterdependentSingleSelectFilterDropdown = (props: InterdependentSingleSelectFilterDropdownProps) => {
  const {
    label,
    icon,
    filterSummary,
    availableOptions,
    onSelectOption: onSelectOptionProp,
    enableSearch,
    maxMenuHeight,
    defaultSearchValue = '',
    minWidth = 250,
    fullWidth = false,
    disabled = false,
    filterSummaryClassName,
    menuContentClassName,
  } = props;

  const [width, setWidth] = useState(minWidth);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(defaultSearchValue);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      setWidth(triggerRef.current?.offsetWidth || 250);
    }
  };

  const filteredOptions = useMemo(() => {
    return availableOptions.filter(option => {
      return option.value.includes(search.toLowerCase());
    });
  }, [availableOptions, search]);

  const onSelectOption = (option: InterdependentFilterDropdownOptions) => {
    onSelectOptionProp(option);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <BaseButton
          disabled={disabled}
          ref={triggerRef}
          variant="outlined"
          style={{ minWidth: fullWidth ? '100%' : `${minWidth}px` }}
          className={cn(
            'border w-fit justify-between rounded-sm border-text-200 hover:bg-transparent h-9 px-4  flex items-center gap-1 bg-white',
            disabled && 'bg-text-50'
          )}
        >
          <div className="flex items-center gap-1">
            <div className="flex flex-row items-center gap-1">
              {icon}

              <span className="text-secondary-500">{label}: </span>
            </div>

            <div className="flex flex-row items-center gap-[10px]">
              <span className={cn('text-text-950 body-1 capitalize', filterSummaryClassName)}>{filterSummary}</span>
            </div>
          </div>

          <ChevronDown size={14} className="text-text-400" />
        </BaseButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ width: `${width}px` }}
        align="start"
        className={cn(' bg-white  p-3', menuContentClassName)}
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
              className={cn(' scroll ', maxMenuHeight && 'overflow-y-auto')}
            >
              <div className="flex flex-col gap-1 ">
                {filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className={cn(
                      'flex items-center rounded-sm py-2 px-2  cursor-pointer hover:bg-primary-50 ',
                      option.checked && 'bg-primary-50',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => {
                      if (option.disabled) return;
                      onSelectOption(option);
                    }}
                  >
                    <label
                      htmlFor={`cluster-${option.value.toLowerCase()}`}
                      className={cn(
                        'text-sm font-medium cursor-pointer group leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full',
                        option.disabled && 'cursor-not-allowed'
                      )}
                    >
                      <span
                        className={cn(
                          'body-1 capitalize group-hover:text-primary-950 truncate max-w-full',
                          option.checked ? 'text-primary-950' : 'text-text-400'
                        )}
                      >
                        {option.label} {typeof option.count === 'number' && `(${option.count})`}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
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

export default InterdependentSingleSelectFilterDropdown;
