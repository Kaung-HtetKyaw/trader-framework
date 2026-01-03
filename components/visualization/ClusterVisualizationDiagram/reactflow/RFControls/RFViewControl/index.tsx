import ZoomInIcon from '@/components/svgs/ZoomInIcon';
import { BaseButton } from '@/components/ui/base-button';
import RFZoomLevelOptions from './RFZoomLevelOptions';
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import ZoomOutIcon from '@/components/svgs/ZoomOutIcon';
import { ZoomLevel } from '@/types/visualization';
import { cn } from '@/lib/utils';
import RFSearch from './RFSearchControl';
import { changeZoomLevel, closeSearch, misc } from '@/signals/visualiation/misc';
import { useSignals } from '@preact/signals-react/runtime';

export const zoomLevelOptions: ZoomLevel[] = [
  {
    label: '5x',
    selectedLabel: '5x',
    value: 2,
    default: false,
  },
  {
    label: '3x',
    selectedLabel: '3x',
    value: 1.5,
    default: false,
  },
  {
    label: '1x',
    selectedLabel: '1x',
    value: 1,
    default: false,
  },
  {
    label: 'Fit Screen',
    selectedLabel: 'Fit',
    value: 'fit',
    default: true,
  },
];

const RFZoomControls = () => {
  useSignals();
  const { setViewport, fitView } = useReactFlow();
  const isLoading = misc.value.isLoading;

  const getNextZoomLevel = useCallback(
    (direction: 'in' | 'out') => {
      if (isLoading) return zoomLevelOptions[0];

      const currentIndex = zoomLevelOptions.findIndex(option => option.value === misc.value.zoomLevel?.value);

      if (direction === 'in' && currentIndex === 0) {
        return zoomLevelOptions[currentIndex];
      }

      if (direction === 'out' && currentIndex === zoomLevelOptions.length - 1) {
        return zoomLevelOptions[currentIndex];
      }

      const nextIndex = direction === 'in' ? currentIndex - 1 : currentIndex + 1;

      return zoomLevelOptions[nextIndex];
    },
    [isLoading]
  );

  const onZoomClick = useCallback(
    (direction: 'in' | 'out') => {
      const nextZoomLevel = getNextZoomLevel(direction);
      changeZoomLevel(nextZoomLevel);

      if (nextZoomLevel.value === 'fit') {
        return fitView({ duration: 600 });
      }

      setViewport({ x: 30, y: 30, zoom: nextZoomLevel.value }, { duration: 600 });
    },
    [getNextZoomLevel, fitView, setViewport]
  );

  const onZoomOutClick = useCallback(() => {
    closeSearch();
    onZoomClick('out');
  }, [onZoomClick]);

  const onZoomInClick = useCallback(() => {
    closeSearch();
    onZoomClick('in');
  }, [onZoomClick]);

  return (
    <div className="absolute bottom-6 left-[46px] transform -translate-x-1/2 bg-white rounded-sm  shadow-lg p-2 ">
      <div className="flex flex-col gap-1">
        <BaseButton
          className={cn('bg-text-50 hover:bg-text-100 h-8 px-1 rounded-sm ', isLoading && 'cursor-default opacity-75')}
          title="zoom out"
          onClick={onZoomOutClick}
          disabled={isLoading}
        >
          <ZoomOutIcon width={24} height={24} />
        </BaseButton>
        <RFZoomLevelOptions />
        <BaseButton
          className={cn('bg-text-50 hover:bg-text-100  h-8 px-1 rounded-sm ', isLoading && 'cursor-default opacity-75')}
          title="zoom in"
          onClick={onZoomInClick}
          disabled={isLoading}
        >
          <ZoomInIcon width={24} height={24} />
        </BaseButton>
        <RFSearch />
      </div>
    </div>
  );
};

export default RFZoomControls;
