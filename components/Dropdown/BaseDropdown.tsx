import { Check, ChevronsUpDown } from 'lucide-react';
import { BaseButton } from '../ui/base-button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { DropdownOption } from '.';

/**
 * Props for rendering individual dropdown options
 */
export type RenderOptionItemProps<T extends DropdownOption<string>> = {
  /** The option to render */
  option: T;
  /** Whether the option is selected */
  selectedOption: T['value'];
  /** Function to close the dropdown */
  closeDropdown: () => void;
};

/**
 * BaseDropdown component that provides core dropdown functionality.
 * This component serves as the foundation for SingleSelectDropdown and MultiSelectDropdown.
 *
 * @example
 * ```tsx
 * <BaseDropdown
 *   options={[
 *     { label: "Option 1", value: "1" },
 *     { label: "Option 2", value: "2" }
 *   ]}
 *   renderTriggerContent={() => <span>Select an option</span>}
 *   renderOptionItem={({ option }) => <span>{option.label}</span>}
 * />
 * ```
 */
export type BaseDropdownProps<T extends DropdownOption<string>> = {
  /** Array of options to display in the dropdown */
  options: T[];
  /** Error message to display */
  error?: string;
  /** Function to render the trigger button content */
  renderTriggerContent?: () => React.ReactNode;
  /** Callback when trigger is clicked */
  onTriggerClick?: () => void;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Function to render each option item */
  renderOptionItem?: (props: RenderOptionItemProps<T>) => React.ReactNode;
  /** Message to display when no options match the search */
  notFoundMessage?: string;
  /** Whether to enable search functionality */
  enableSearch?: boolean;
  /** Icon to display for the chevron */
  chevronIcon?: React.ReactNode;
  /** Icon to display for the check */
  checkIcon?: React.ReactNode;
  /** Whether to display the add new item option */
  renderAddNewItem?: () => React.ReactNode;
};

const BaseDropdown = <T extends DropdownOption<string>>(props: BaseDropdownProps<T>) => {
  const {
    options,
    error,
    renderTriggerContent,
    onTriggerClick,
    renderOptionItem,
    placeholder = 'Select an item',
    searchPlaceholder = 'Search item(s)',
    notFoundMessage = 'No item found.',
    enableSearch = true,
    chevronIcon,
    checkIcon,
    renderAddNewItem,
  } = props;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number>(200);

  const closeDropdown = () => {
    triggerRef.current?.click();
  };

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => {
          setWidth(triggerRef.current?.offsetWidth || 0);
          onTriggerClick?.();
        }}
        asChild
      >
        <BaseButton
          ref={triggerRef}
          variant="outlined"
          role="combobox"
          className={cn(
            error
              ? 'border-red-500 focus:border-red-500 focus-visible:ring-0'
              : 'border-text-200 focus:border-text-300 focus-visible:ring-0',
            'w-full border min-h-9 h-auto hover:bg-text-50 text-text-950 justify-between'
          )}
        >
          <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
            {renderTriggerContent ? renderTriggerContent() : <span className="text-text-500">{placeholder}</span>}
          </div>
          {chevronIcon ?? <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </BaseButton>
      </PopoverTrigger>

      <PopoverContent
        data-testid="popover-content"
        style={{
          width: `${width}px`,
        }}
        onWheel={e => {
          e.stopPropagation();
        }}
        className="bg-white p-0 overflow-y-auto"
      >
        <Command>
          {enableSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  className="hover:bg-text-50 transition-colors duration-200 cursor-pointer"
                  value={option.value as string}
                  key={option.value as string}
                >
                  {renderOptionItem ? (
                    renderOptionItem({
                      option,
                      selectedOption: option.value,
                      closeDropdown,
                    })
                  ) : (
                    <span className="flex items-center justify-between w-full gap-2">
                      {option.label}
                      {checkIcon ?? <Check className={cn('ml-auto opacity-0')} />}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          {renderAddNewItem && renderAddNewItem()}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BaseDropdown;
