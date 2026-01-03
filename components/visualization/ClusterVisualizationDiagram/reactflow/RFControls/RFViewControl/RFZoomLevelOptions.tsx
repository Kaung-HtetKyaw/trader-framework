import { BaseButton } from '@/components/ui/base-button';
import { cn } from '@/lib/utils';
import {
  changeZoomLevel,
  closeZoomOptions,
  misc,
  openZoomOptions,
  zoomLevelOptions,
} from '@/signals/visualiation/misc';
import { ZoomLevel } from '@/types/visualization';
import { useSignals } from '@preact/signals-react/runtime';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

const ZoomLevelOptions = () => {
  useSignals();
  const isLoading = misc.value.isLoading;
  const { setViewport } = useReactFlow();

  const active = !misc.value.isSearchOpen;
  const selectedZoomLevel = misc.value.zoomLevel;

  const onZoomLevelClick = () => {
    if (misc.value.isZoomOptionsOpen) {
      closeZoomOptions();
      return;
    }
    openZoomOptions();
  };

  const onZoomLevelChange = useCallback(
    (zoomLevel: number) => {
      if (isLoading) return;
      setViewport({ x: 30, y: 30, zoom: zoomLevel }, { duration: 600 });
    },
    [isLoading, setViewport]
  );

  const onZoomOptionChange = useCallback(
    (option: ZoomLevel) => {
      return () => {
        if (isLoading) return;
        changeZoomLevel(option);
        if (option.value === 'fit') {
          misc.value.fitView();
        } else {
          onZoomLevelChange(option.value as number);
        }
      };
    },
    [isLoading, onZoomLevelChange]
  );

  return (
    <div className={cn(isLoading && 'cursor-default opacity-75')}>
      <div onClick={onZoomLevelClick} className=" cursor-pointer flex flex-row items-center gap-[2px]">
        <BaseButton
          className={cn(
            'bg-text-50 hover:bg-text-100 w-8 h-8 px-1 body-1 rounded-sm text-primary-950',
            isLoading && 'cursor-default',
            active && 'bg-primary-950  hover:bg-primary-900 text-white '
          )}
          title="Fit to View"
        >
          <span> {selectedZoomLevel?.selectedLabel}</span>
        </BaseButton>
      </div>

      {misc.value.isZoomOptionsOpen && (
        <div className="absolute right-[-110px] bottom-0 w-[100px] whitespace-nowrap flex flex-col items-center justify-center gap-2 bg-white shadow-lg rounded-lg p-2">
          {zoomLevelOptions.map(option => (
            <div
              key={option.value}
              className={cn(
                'cursor-pointer px-2 h-6 rounded-sm body-2 flex items-center justify-center',
                active && selectedZoomLevel?.value === option.value && 'bg-primary-950 hover:bg-primary-900 text-white'
              )}
              onClick={onZoomOptionChange(option)}
            >
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoomLevelOptions;
