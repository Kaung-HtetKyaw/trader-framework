import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import SuccessIcon from './svgs/SuccessIcon';
import ErrorIcon from './svgs/ErrorIcon';

export interface CustomToastProps {
  type: 'success' | 'error';
  message: string;
}

const STYLE_CONFIG = {
  success: {
    bg: 'bg-success-50',
    text: 'text-success-700',
  },
  error: {
    bg: 'bg-error-50',
    text: 'text-error-700',
  },
};

export const CustomToast = ({ type, message }: CustomToastProps) => {
  const styleConfig = STYLE_CONFIG[type];

  return toast.custom(
    () => (
      <div
        role="status"
        className={cn('flex items-center gap-[10px] p-4 rounded-lg shadow-lg', styleConfig.bg, styleConfig.text)}
      >
        {type === 'success' ? (
          <SuccessIcon className="w-[18px] h-[18px] shrink-0" />
        ) : (
          <ErrorIcon className="w-[18px] h-[18px] shrink-0" />
        )}
        <span className="whitespace-nowrap">{message}</span>
      </div>
    ),
    { duration: 3000 }
  );
};
