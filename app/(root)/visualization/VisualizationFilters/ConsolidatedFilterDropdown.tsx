import React, { useCallback, useMemo, useState } from 'react';
import { DropdownOption } from '@/components/Dropdown';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BaseButton } from '@/components/ui/base-button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import DebounceSearchInput from '@/components/DebouncedInput';
import { MoreFiltersIcon } from '@/components/svgs/MoreFiltersIcon';
import HighlightedText from '@/components/HighlightedText';

const MAX_LABEL_LENGTH = 35;

export type ConsolidatedFilterDropdownProps = {
  clusterWideObjectOptions: DropdownOption[];
  selectedClusterWideObjects: string[];
  onClusterWideObjectsChange: (values: string[]) => void;
  namespaceOptions: DropdownOption[];
  selectedNamespaces: string[];
  onNamespacesChange: (values: string[]) => void;
  disabled?: boolean;
  onApplyClusterWideObjects: (closeDropdown: () => void) => void;
  onApplyNamespaces: (closeDropdown: () => void) => void;
  clusterWideApplyDisabled: boolean;
  namespaceApplyDisabled: boolean;
};

const CollapsibleFilterSection = ({
  title,
  options,
  selectedValues,
  onToggle,
  onSelectAll,
  onClearAll,
  searchValue,
  onSearchChange,
  isExpanded,
  onToggleExpand,
  onApply,
  applyDisabled,
  closeParentDropdown,
}: {
  title: string;
  options: DropdownOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApply: (closeDropdown: () => void) => void;
  applyDisabled: boolean;
  closeParentDropdown: () => void;
}) => {
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return options;
    return options.filter(option => option.label.toLowerCase().includes(searchValue.trim().toLowerCase()));
  }, [searchValue, options]);

  return (
    <div className="border-b border-gray-200 last:border-b-0">

      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-normal text-text-950">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-text-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-400" />
        )}
      </button>


      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <DebounceSearchInput defaultValue={searchValue} setState={onSearchChange}>
            {(setValue, value) => (
              <Input
                type="text"
                placeholder="Search"
                className="border-text-200 w-full h-8 text-xs rounded-sm focus-visible:ring-0"
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            )}
          </DebounceSearchInput>

          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs text-text-400 hover:text-text-600 font-normal"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-text-400 hover:text-text-600 font-normal"
            >
              Clear
            </button>
          </div>

          <ScrollArea className="h-[200px] pr-2">
            <div className="flex flex-col">
              {filteredOptions.length === 0 ? (
                <div className="text-xs text-text-400 px-2 py-4 text-center">No result!</div>
              ) : (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-primary-50 transition-colors"
                  >
                    <Checkbox
                      id={`${title}-${option.value}`}
                      checked={selectedValues.includes(option.value)}
                      onCheckedChange={() => onToggle(option.value)}
                      className="w-[1.125rem] h-[1.125rem] border border-text-200 rounded-[4px] data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50 shadow-none focus:shadow-none"
                    />
                    <label
                      htmlFor={`${title}-${option.value}`}
                      className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between w-full"
                      title={option.label.length > MAX_LABEL_LENGTH ? option.label : undefined}
                    >
                      <span className="body-1 text-text-950">
                        <HighlightedText text={option.label} search={searchValue} maxLength={MAX_LABEL_LENGTH} />
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="pt-2">
            <BaseButton
              onClick={() => onApply(closeParentDropdown)}
              disabled={applyDisabled}
              className="w-full mt-2 bg-primary-950 text-white hover:bg-primary-900"
              variant="contained"
            >
              Apply
            </BaseButton>
          </div>
        </div>
      )}
    </div>
  );
};

const ConsolidatedFilterDropdown: React.FC<ConsolidatedFilterDropdownProps> = ({
  clusterWideObjectOptions,
  selectedClusterWideObjects,
  onClusterWideObjectsChange,
  namespaceOptions,
  selectedNamespaces,
  onNamespacesChange,
  disabled,
  onApplyClusterWideObjects,
  onApplyNamespaces,
  clusterWideApplyDisabled,
  namespaceApplyDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cwoSearch, setCwoSearch] = useState('');
  const [namespaceSearch, setNamespaceSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<'cwo' | 'namespace' | null>('cwo');

  const toggleClusterWideObject = useCallback(
    (value: string) => {
      const isSelected = selectedClusterWideObjects.includes(value);
      const updated = isSelected
        ? selectedClusterWideObjects.filter(v => v !== value)
        : [...selectedClusterWideObjects, value];
      onClusterWideObjectsChange(updated);
    },
    [selectedClusterWideObjects, onClusterWideObjectsChange]
  );

  const toggleNamespace = useCallback(
    (value: string) => {
      const isSelected = selectedNamespaces.includes(value);
      const updated = isSelected ? selectedNamespaces.filter(v => v !== value) : [...selectedNamespaces, value];
      onNamespacesChange(updated);
    },
    [selectedNamespaces, onNamespacesChange]
  );

  const selectAllCWO = useCallback(() => {
    onClusterWideObjectsChange(clusterWideObjectOptions.map(opt => opt.value));
  }, [clusterWideObjectOptions, onClusterWideObjectsChange]);

  const clearAllCWO = useCallback(() => {
    onClusterWideObjectsChange([]);
  }, [onClusterWideObjectsChange]);

  const selectAllNamespaces = useCallback(() => {
    onNamespacesChange(namespaceOptions.map(opt => opt.value));
  }, [namespaceOptions, onNamespacesChange]);

  const clearAllNamespaces = useCallback(() => {
    onNamespacesChange([]);
  }, [onNamespacesChange]);

  const toggleCWOSection = useCallback(() => {
    setExpandedSection(prev => (prev === 'cwo' ? null : 'cwo'));
  }, []);

  const toggleNamespaceSection = useCallback(() => {
    setExpandedSection(prev => (prev === 'namespace' ? null : 'namespace'));
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <MoreFiltersIcon className="w-4 h-4 " />
          <span className="text-sm font-normal text-text-950">More Filter</span>
          <ChevronDown className="w-4 h-4 text-text-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[300px] max-w-[90vw] bg-white rounded-lg shadow-lg p-0 mt-2" align="start">
        <div className="flex flex-col">
          <CollapsibleFilterSection
            title="Cluster Wide Objects"
            options={clusterWideObjectOptions}
            selectedValues={selectedClusterWideObjects}
            onToggle={toggleClusterWideObject}
            onSelectAll={selectAllCWO}
            onClearAll={clearAllCWO}
            searchValue={cwoSearch}
            onSearchChange={setCwoSearch}
            isExpanded={expandedSection === 'cwo'}
            onToggleExpand={toggleCWOSection}
            onApply={onApplyClusterWideObjects}
            applyDisabled={clusterWideApplyDisabled}
            closeParentDropdown={closeDropdown}
          />

          <CollapsibleFilterSection
            title="Namespaces"
            options={namespaceOptions}
            selectedValues={selectedNamespaces}
            onToggle={toggleNamespace}
            onSelectAll={selectAllNamespaces}
            onClearAll={clearAllNamespaces}
            searchValue={namespaceSearch}
            onSearchChange={setNamespaceSearch}
            isExpanded={expandedSection === 'namespace'}
            onToggleExpand={toggleNamespaceSection}
            onApply={onApplyNamespaces}
            applyDisabled={namespaceApplyDisabled}
            closeParentDropdown={closeDropdown}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConsolidatedFilterDropdown;
