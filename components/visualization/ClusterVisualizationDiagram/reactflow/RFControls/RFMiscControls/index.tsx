import CursorIcon from '@/components/svgs/CursorIcon';
import HandGrabIcon from '@/components/svgs/HandGrabIcon';
import { BaseButton } from '@/components/ui/base-button';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import { VisualizationActionEnum } from '@/types/visualization';
import { changeActiveAction, misc } from '@/signals/visualiation/misc';

const RFMiscControls = () => {
  const activeAction = misc.value.activeAction;
  const isLoading = misc.value.isLoading;

  const onSelectMouseEvent = useCallback((type: VisualizationActionEnum) => {
    switch (type) {
      case 'pan':
        changeActiveAction('pan');
        break;
      case 'default':
        changeActiveAction('default');
    }
  }, []);

  return (
    <div className="absolute bottom-6 left-[46px] transform -translate-x-1/2 z-5 bg-white rounded-sm  shadow-lg p-2 ">
      <div className="flex flex-col gap-1">
        <BaseButton
          className={cn(
            'bg-text-50 hover:bg-text-100  w-9 h-9 px-1 rounded-sm ',
            activeAction === 'pan' && 'bg-primary-950 hover:bg-primary-900',
            isLoading && 'cursor-default opacity-75 '
          )}
          title="Grab"
          onClick={() => onSelectMouseEvent('pan')}
        >
          <HandGrabIcon className={cn(activeAction === 'pan' && 'text-white')} width={24} height={24} />
        </BaseButton>

        <BaseButton
          className={cn(
            'bg-text-50 hover:bg-text-100  w-9 h-9 px-1 rounded-sm ',
            activeAction === 'default' && 'bg-primary-950 hover:bg-primary-900'
          )}
          title="Pointer"
          onClick={() => onSelectMouseEvent('default')}
          disabled={isLoading}
        >
          <CursorIcon className={cn(activeAction === 'default' && 'text-white')} width={24} height={24} />
        </BaseButton>
      </div>
    </div>
  );
};

export default RFMiscControls;
