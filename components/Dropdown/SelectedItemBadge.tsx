import { X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { DropdownOption } from '.';

export type SelectedItemBadgeProps<T extends DropdownOption<string>> = {
  item: T;
  onRemove: (item: T) => void;
};

const SelectedItemBadge = <T extends DropdownOption<string>>(props: SelectedItemBadgeProps<T>) => {
  const { item, onRemove } = props;

  return (
    <Badge
      key={item.value}
      variant="secondary"
      onClick={e => {
        e.stopPropagation();
        onRemove(item);
      }}
      className="rounded-sm px-1 border-text-300 border-regular font-normal flex items-center gap-1"
    >
      {item.label}
      <X className="h-3 w-3 cursor-pointer" />
    </Badge>
  );
};

export default SelectedItemBadge;
