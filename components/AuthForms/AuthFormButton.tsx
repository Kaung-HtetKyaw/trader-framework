import { cn } from '@/lib/utils';
import { BaseButton } from '../ui/base-button';

export type AuthFormButtonProps = {
  disabled: boolean;
  className: string;
  isLoading: boolean;
  children: React.ReactNode;
};

const AuthFormButton = (props: AuthFormButtonProps) => {
  const { disabled, isLoading, className, children } = props;

  return (
    <BaseButton
      type="submit"
      className={cn(
        'inline-flex h-9 w-full items-center justify-center rounded-md px-6 py-2 font-normal text-base bg-secondary-500 text-secondary-50',
        className,
        (isLoading || disabled) && 'opacity-50 cursor-not-allowed hover:bg-secondary-500'
      )}
    >
      {children}
    </BaseButton>
  );
};

export default AuthFormButton;
