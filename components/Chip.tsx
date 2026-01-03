import { cn } from '@/lib/utils';

type ChipProps = {
  label?: string;
  children?: React.ReactNode;
  className?: string;
};

const Chip = ({ label, children, className }: ChipProps) => {
  return (
    <div
      className={cn(
        'body-2 text-text-500 px-3 min-h-6 h-auto xl:h-6 flex items-center text-center py-2 md:py-0 lg:py-0 bg-white rounded-sm ',
        className
      )}
    >
      {children ?? label}
    </div>
  );
};

export default Chip;
