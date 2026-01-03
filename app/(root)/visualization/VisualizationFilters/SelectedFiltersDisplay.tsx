import React, { useCallback, useMemo } from 'react';
import { CircularCloseIcon } from '@/components/svgs/CircularCloseIcon';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownOption } from '@/components/Dropdown';
import CustomEllipsis from '@/components/CustomEllipsis';
import useMediaQuery from '@/lib/hooks/useMediaQuery';

const MAX_DISPLAYED_ITEMS = 3;

export type SelectedFilterContext = {
  options: DropdownOption[];
  items: string[];
  onChange: (value: string[]) => void;
};

export type SelectedFilterDisplayProps = {
  namespace: SelectedFilterContext;
  clusterWideObject: SelectedFilterContext;
  objectKind: SelectedFilterContext;
  disabled?: boolean;
  max?: number;
};

const SelectedFiltersDisplay: React.FC<SelectedFilterDisplayProps> = (props: SelectedFilterDisplayProps) => {
  const { namespace, clusterWideObject, objectKind, max, disabled } = props;

  const maxDisplayedItems = useMemo(() => (typeof max !== 'undefined' ? max : MAX_DISPLAYED_ITEMS), [max]);

  const isCompactView = useMediaQuery('(max-width: 1040px)');

  const onRemoveNamespaceFilter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
      e.stopPropagation();
      const newSelection = namespace.items.filter(val => val !== value);
      namespace.onChange(newSelection);
    },
    [namespace]
  );

  const onRemoveClusterWideFilter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
      e.stopPropagation();
      const newSelection = clusterWideObject.items.filter(val => val !== value);
      clusterWideObject.onChange(newSelection);
    },
    [clusterWideObject]
  );

  const onRemoveObjectKindFilter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
      e.stopPropagation();
      const newSelection = objectKind.items.filter(val => val !== value);
      objectKind.onChange(newSelection);
    },
    [objectKind]
  );

  const selectedNamespaceItems = useMemo(() => {
    return namespace.items.map(el => {
      const option = namespace.options.find(opt => opt.value === el);

      return {
        ...option,
        onChange: onRemoveNamespaceFilter,
      };
    });
  }, [namespace.items, onRemoveNamespaceFilter, namespace.options]);

  const selectedClusterWideItems = useMemo(() => {
    return clusterWideObject.items.map(el => {
      const option = clusterWideObject.options.find(opt => opt.value === el);
      return {
        ...option,
        onChange: onRemoveClusterWideFilter,
      };
    });
  }, [onRemoveClusterWideFilter, clusterWideObject.items, clusterWideObject.options]);

  const selectedObjectKindItems = useMemo(() => {
    return objectKind.items.map(el => {
      const option = objectKind.options.find(opt => opt.value === el);
      return {
        ...option,
        onChange: onRemoveObjectKindFilter,
      };
    });
  }, [onRemoveObjectKindFilter, objectKind.items, objectKind.options]);

  const allSelectedItems = useMemo(() => {
    const items = [...selectedObjectKindItems, ...selectedClusterWideItems, ...selectedNamespaceItems].filter(
      el => !!el.label || !!el.value
    );
    return items;
  }, [selectedNamespaceItems, selectedClusterWideItems, selectedObjectKindItems]);

  const miniSelectedItems = useMemo(() => {
    return allSelectedItems.slice(0, maxDisplayedItems);
  }, [allSelectedItems, maxDisplayedItems]);

  const shouldShowChips = !isCompactView && maxDisplayedItems > 0;
  const shouldShowDropdown = isCompactView ? allSelectedItems.length > 0 : allSelectedItems.length > maxDisplayedItems;

  return (
    <div className="flex flex-wrap gap-1 overflow-x-auto relative">
      {shouldShowChips && miniSelectedItems.map(item => {
        return (
          <span
            key={item.value}
            className="flex items-center bg-text-100 text-text-500 rounded-lg px-2 py-1 text-xs font-medium"
          >
            <CustomEllipsis text={item.label || item.value || ''} maxLength={18} />
            <button
              type="button"
              className="ml-1 text-text-500 hover:text-secondary-500"
              onClick={e => item.onChange(e, item.value || '')}
              disabled={disabled}
            >
              <CircularCloseIcon className="w-4 h-4" />
            </button>
          </span>
        );
      })}

      {shouldShowDropdown && (
        <DropdownMenu>
          <DropdownMenuTrigger disabled={disabled} asChild>
            <span
              className="flex items-center bg-text-100 text-text-500 px-2 py-1 text-xs font-medium cursor-pointer transition rounded-lg outline-none focus:outline-none"
              tabIndex={0}
              role="button"
              aria-label={`Show ${isCompactView ? allSelectedItems.length : allSelectedItems.length - maxDisplayedItems} more filters`}
            >
              <Plus className="w-3 h-3" />
              {isCompactView ? allSelectedItems.length : allSelectedItems.length - maxDisplayedItems}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="max-h-[250px] overflow-y-auto scroll-container min-w-[180px] max-w-[220px] bg-white mt-3 rounded-lg">
            <div className="flex flex-col space-y-2 px-1 py-1">
              {allSelectedItems.map(item => {
                return (
                  <DropdownMenuItem
                    disabled={disabled}
                    key={item.value}
                    className="flex items-center w-auto justify-between bg-text-100 text-text-500 rounded-lg px-3 py-2 text-sm font-medium focus:bg-text-200 gap-2 cursor-pointer"
                  >
                    <CustomEllipsis text={item.label || item.value || ''} maxLength={18} />
                    <button
                      type="button"
                      className="ml-2 text-text-500 hover:text-secondary-500"
                      onClick={e => item.onChange(e, item.value || '')}
                      disabled={disabled}
                    >
                      <CircularCloseIcon className="w-4 h-4" />
                    </button>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default SelectedFiltersDisplay;
