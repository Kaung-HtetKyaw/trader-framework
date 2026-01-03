import { BaseButton } from '@/components/ui/base-button';
import SearchLineIcon from '@/components/svgs/SearchLineIcon';
import DebounceSearchInput from '@/components/DebouncedInput';
import { Input } from '@/components/ui/input';
import ArrowUpRightLine from '@/components/svgs/ArrowUpRightLine';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { useReactFlow } from '@xyflow/react';
import { useCallback, useState, useRef, useEffect, RefObject } from 'react';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import useKeyPress from '@/lib/hooks/useKeyPress';
import { cn } from '@/lib/utils';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import MatchedSearchLabel from '../RFMiscControls/MatchedSearchLabel';
import { useOnClickOutside } from '@/lib/hooks/useOnClickOutside';
import { nodes } from '@/signals/visualiation/nodes';
import { openSearch, misc, closeSearch, changeFocusedNode, selectNode } from '@/signals/visualiation/misc';
import { useSignals } from '@preact/signals-react/runtime';

const RFSearch = () => {
  useSignals();
  const { params, changeParam, removeParams } = useQueryParams<{ search: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const { fitView } = useReactFlow();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const matchedNodes = nodes.value.filter(
    node =>
      node.data.label.toLowerCase().includes(params.search?.toLowerCase() || '') &&
      node.data.type !== K8sObjectTypes.HierarchyGroup
  );

  const activeNode = matchedNodes[activeIndex];

  const onCloseSearch = () => {
    closeSearch(() => {
      removeParams('search');
    });
  };

  // Scroll to active item when activeIndex changes
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeItem = activeItemRef.current;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // Check if item is outside the visible area
      if (itemRect.top < containerRect.top) {
        // Item is above the visible area, scroll up
        container.scrollTop -= containerRect.top - itemRect.top + 10;
      } else if (itemRect.bottom > containerRect.bottom) {
        // Item is below the visible area, scroll down
        container.scrollTop += itemRect.bottom - containerRect.bottom + 10;
      }
    }
  }, [activeIndex, matchedNodes.length]);

  const onArrowUp = useCallback(() => {
    if (!matchedNodes.length) return;

    const prevIndex = activeIndex === 0 ? matchedNodes.length - 1 : activeIndex - 1;

    changeFocusedNode(matchedNodes[prevIndex].id);
    setActiveIndex(prevIndex);
  }, [matchedNodes, activeIndex]);

  const onArrowDown = useCallback(() => {
    if (!matchedNodes.length) return;

    const nextIndex = activeIndex === matchedNodes.length - 1 ? 0 : activeIndex + 1;

    changeFocusedNode(matchedNodes[nextIndex].id);
    setActiveIndex(nextIndex);
  }, [matchedNodes, activeIndex]);

  const onSelectNode = useCallback(
    (node: RFVisualizationNode) => {
      selectNode(node.id);
      // un-focus the selected node
      changeFocusedNode(undefined);

      fitView({ nodes: [node], duration: 600 });

      closeSearch(() => {
        removeParams('search');
        setActiveIndex(0);
      });
    },
    [fitView, removeParams]
  );

  const onClickNode = useCallback(
    (id: string) => {
      const activeNode = matchedNodes.find(node => node.id === id);
      if (!activeNode) return;

      onSelectNode(activeNode);
    },
    [matchedNodes, onSelectNode]
  );

  const onPressEnter = useCallback(() => {
    if (!activeNode) return;

    onSelectNode(activeNode);
  }, [activeNode, onSelectNode]);

  const onOpenSearch = () => {
    if (misc.value.isSearchOpen) {
      onCloseSearch();
      return;
    }

    openSearch();
  };

  useKeyPress('ArrowUp', onArrowUp, { disableInInputs: false });
  useKeyPress('ArrowDown', onArrowDown, { disableInInputs: false });
  useKeyPress('Enter', onPressEnter, { disableInInputs: false });
  useKeyPress('Escape', onCloseSearch, { disableInInputs: false });
  useOnClickOutside(containerRef as RefObject<HTMLElement>, onCloseSearch);

  return (
    <div ref={containerRef}>
      <BaseButton
        onClick={onOpenSearch}
        className={cn(
          'bg-text-50 hover:bg-text-100 w-8 h-8 px-1 rounded-sm ',
          misc.value.isSearchOpen && 'bg-primary-950 hover:bg-primary-900'
        )}
        title="Fit to View"
        disabled={misc.value.isLoading}
      >
        <SearchLineIcon className={cn(misc.value.isSearchOpen && 'text-white')} width={24} height={24} />
      </BaseButton>

      {misc.value.isSearchOpen && (
        <>
          {params.search && !!matchedNodes.length && (
            <div
              ref={scrollContainerRef}
              className="scroll-container overflow-x-hidden absolute bottom-[calc(54px)] left-[calc(100%+12px)] max-h-[270px] p-2 overflow-y-auto shadow-lg bg-white border-t-[8px] border-t-white border-b-[]  rounded-sm "
            >
              <div className=" w-[220px]">
                <ul className="flex flex-col gap-1 body-2 overflow-y-auto">
                  {matchedNodes.map((el, index) => (
                    <li
                      key={el.id}
                      ref={index === activeIndex ? activeItemRef : null}
                      onClick={() => onClickNode(el.id)}
                      className={cn(
                        'text-left h-6 px-2 text-text-950 hover:bg-primary-50 active:bg-primary-950 active:text-white rounded-sm cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis leading-6 transition-colors duration-150',
                        activeNode?.id === el.id && 'bg-primary-950 text-white hover:bg-primary-950'
                      )}
                    >
                      <MatchedSearchLabel label={el.data.label} searchTerm={params.search || ''} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-[calc(100%+12px)]">
            <div className=" relative  w-[220px] flex flex-row items-center justify-between bg-white rounded-sm shadow-lg pr-4">
              <DebounceSearchInput
                debounce={200}
                setState={value => changeParam('search', value)}
                defaultValue={params.search || ''}
              >
                {(setValue, value) => (
                  <Input
                    autoFocus
                    required
                    type="text"
                    placeholder="Search keywords"
                    className={'border-none  focus-visible:ring-0'}
                    onChange={e => setValue(e.target.value)}
                    value={value}
                  />
                )}
              </DebounceSearchInput>
              <ArrowUpRightLine />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RFSearch;
