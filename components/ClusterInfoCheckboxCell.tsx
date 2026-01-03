import { isRowSelected } from '@/signals/tables/selection';
import { useSignals } from '@preact/signals-react/runtime';
import { MouseEventHandler, useCallback } from 'react';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';

export type ClusterInfoCheckboxCellProps = {
  id: string;
  isRowDisabled: (id: string) => boolean;
  onToggleSelection: (id: string) => void;
};

const ClusterInfoCheckboxCell = (props: ClusterInfoCheckboxCellProps) => {
  useSignals();

  const { id, isRowDisabled, onToggleSelection } = props;
  const isDisabled = isRowDisabled(id);
  const isSelected = isRowSelected(id);

  const onClickContainer: MouseEventHandler<HTMLDivElement> = useCallback(e => {
    e.stopPropagation();
  }, []);

  const onToggle = useCallback(() => {
    onToggleSelection(id);
  }, [id, onToggleSelection]);

  return (
    <div onClick={onClickContainer}>
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        aria-label="Select row"
        className={cn(
          'w-[1.125rem] h-[1.125rem] border border-text-200 rounded-[4px] data-[state=checked]:bg-primary-950 data-[state=checked]:text-text-50 shadow-none focus:shadow-none',
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        )}
      />
    </div>
  );
};

export default ClusterInfoCheckboxCell;
