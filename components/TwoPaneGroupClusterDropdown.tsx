'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { BaseButton } from './ui/base-button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { cn, getHighlightedParts } from '@/lib/utils';
import { DropdownOption } from '@/components/Dropdown';
import { ClusterGroupIcon } from './svgs/ClusterGroupIcon';
import { CheckIcon } from './svgs/CheckIcon';
import { ScrollArea } from './ui/scroll-area';
import CustomEllipsis from './CustomEllipsis';

interface Props {
  label?: string;
  groupOptions: DropdownOption[];
  clusterOptions: DropdownOption[];
  clustersByGroup: Record<string, DropdownOption[]>;
  selectedGroupId?: string;
  selectedClusterId?: string;
  onSelectGroup: (groupId: string) => void;
  onSelectCluster: (clusterId: string) => void;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const TwoPaneGroupClusterDropdown = ({
  groupOptions,
  clusterOptions,
  clustersByGroup,
  selectedGroupId,
  selectedClusterId,
  onSelectGroup,
  onSelectCluster,
  onOpenChange: onOpenChangeProps,
  disabled = false,
}: Props) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(300);
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const selectedGroupLabel = useMemo(
    () => (selectedGroupId ? groupOptions.find(g => g.value === selectedGroupId)?.label : 'Cluster Group Name'),
    [selectedGroupId, groupOptions]
  );

  const selectedClusterLabel = useMemo(
    () => (selectedClusterId ? clusterOptions.find(c => c.value === selectedClusterId)?.label : 'Select a cluster'),
    [selectedClusterId, clusterOptions]
  );

  const clustersToShow = useMemo(() => {
    const all = activeGroup ? clustersByGroup[activeGroup] || [] : [];
    return search ? all.filter(c => c.label.toLowerCase().includes(search.toLowerCase())) : all;
  }, [activeGroup, clustersByGroup, search]);

  useEffect(() => {
    if (open) setActiveGroup(selectedGroupId);
  }, [open, selectedGroupId]);

  useEffect(() => {
    if (selectedClusterId && !selectedGroupId && clusterOptions.length && groupOptions.length) {
      // Find the group for the selected cluster
      for (const group of groupOptions) {
        const clusters = clustersByGroup[group.value] || [];
        if (clusters.some(c => c.value === selectedClusterId)) {
          setActiveGroup(group.value);
          onSelectGroup(group.value);
          break;
        }
      }
    } else if (selectedGroupId) {
      setActiveGroup(selectedGroupId);
    }
  }, [selectedClusterId, selectedGroupId, groupOptions, clusterOptions, clustersByGroup, onSelectGroup]);

  const onOpenChange = useCallback(
    (state: boolean) => {
      setOpen(state);
      if (state) {
        setWidth(triggerRef.current?.offsetWidth || 300);
      }
      onOpenChangeProps(state);
    },
    [onOpenChangeProps]
  );

  const handleGroupClick = useCallback(
    (groupId: string) => {
      setActiveGroup(groupId);
      onSelectGroup(groupId);
    },
    [onSelectGroup]
  );

  const handleClusterClick = useCallback(
    (clusterId: string) => {
      onSelectCluster(clusterId);
      setOpen(false);
    },
    [onSelectCluster]
  );

  const renderHighlightedLabel = (label: string, search: string) => {
    const parts = getHighlightedParts(label, search);
    return parts.map((part, index) =>
      part.isMatch ? (
        <span key={index} className="text-secondary-500">
          {part.text}
        </span>
      ) : (
        part.text
      )
    );
  };

  if (disabled) {
    return (
      <div className=" min-w-[auto] justify-between rounded-sm border-text-200 h-9 px-4 flex items-center gap-1 bg-text-50 text-text-400 cursor-not-allowed select-none">
        <div className="flex items-center">
          <span className="text-text-400 flex items-center gap-1 font-semibold">
            <ClusterGroupIcon className="w-4 h-4 text-text-400" />
            <CustomEllipsis text={selectedGroupLabel || ''} maxLength={30} className="truncate max-w-full" />
          </span>
          <span className="text-text-400">:</span>
          <span className="text-text-400 ml-1 truncate max-w-full">{selectedClusterLabel}</span>
        </div>
        <ChevronDown size={14} className="text-text-400 ml-1" />
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <BaseButton
          ref={triggerRef}
          variant="outlined"
          className="border min-w-[auto] justify-between rounded-sm border-text-200 hover:bg-transparent h-9 px-4 flex items-center gap-1 bg-white"
        >
          <div className="flex items-center">
            <span className="text-secondary-500 flex items-center gap-1 font-semibold">
              <ClusterGroupIcon className="w-4 h-4" />
              <CustomEllipsis text={selectedGroupLabel || ''} maxLength={30} />
            </span>
            <span className="text-secondary-500">:</span>
            <CustomEllipsis className="text-text-950 ml-1" text={selectedClusterLabel || ''} maxLength={30} />
          </div>
          <ChevronDown size={14} className="text-text-950 ml-1" />
        </BaseButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ minWidth: `${width}px`, width: 'auto', height: '352px' }}
        align="start"
        className="bg-white p-2 mt-2"
      >
        <div className="flex rounded-sm w-[520px]">
          {/* Left: Cluster Groups */}
          <div className="w-1/2 pr-2">
            <div className="p-4 pl-2 flex items-center justify-start font-semibold leading-[1.3] text-[14px]">
              Cluster Group
            </div>
            <ScrollArea className="overflow-y-auto scroll-container pr-2 max-h-[280px]">
              {groupOptions.map(group => {
                const isSelected = activeGroup === group.value;
                return (
                  <div
                    key={group.value}
                    onClick={() => handleGroupClick(group.value)}
                    className={cn(
                      'px-2 py-1 cursor-pointer flex items-center justify-between text-sm font-normal rounded-lg mb-1',
                      isSelected ? 'bg-primary-950 text-text-50' : 'hover:text-secondary-950 hover:bg-primary-50'
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <CustomEllipsis text={group.label} maxLength={30} />
                    <ChevronRight className={cn('w-4 h-4', isSelected ? 'text-text-50' : 'text-inherit')} />
                  </div>
                );
              })}
            </ScrollArea>
          </div>

          {/* Right: Clusters */}
          <div className="w-1/2 pl-2">
            <div className="px-1 py-2 flex items-center ">
              <Input
                type="text"
                placeholder="Search"
                className="text-xs h-8 focus-visible:ring-0 border border-text-200 rounded-md"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <ScrollArea className="overflow-y-auto scroll-container pr-2 max-h-[280px] p-1">
              {clustersToShow.length > 0 ? (
                clustersToShow.map(cluster => {
                  const isSelected = selectedClusterId === cluster.value;
                  return (
                    <div
                      key={cluster.value}
                      onClick={() => handleClusterClick(cluster.value)}
                      className={cn(
                        'px-2 py-1 cursor-pointer flex items-center justify-between text-sm font-normal rounded-lg mb-1',
                        isSelected ? 'bg-primary-950 text-text-50' : 'hover:text-secondary-950 hover:bg-primary-50'
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span>{renderHighlightedLabel(cluster.label, search)}</span>
                      <CheckIcon className={cn('w-4 h-4', isSelected ? 'text-success-600' : 'text-text-200')} />
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-sm text-text-400 text-center">No clusters found</div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TwoPaneGroupClusterDropdown;
