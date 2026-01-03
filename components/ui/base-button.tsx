import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const baseButtonVariants = cva(
  'inline-flex items-center body-2 text-white justify-center gap-1 whitespace-nowrap rounded-xs text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 duration-300',
  {
    variants: {
      variant: {
        contained: ' px-2 py-4 bg-secondary-500',
        outlined: 'border-[1px]  ',
        text: ' !bg-transparent ',
        disabled: 'cursor-default  !text-text-400 !bg-text-50',
      },
      size: {
        small: 'h-[30px] px-3 py-1 body-2 rounded-lg',
        medium: 'h-9 px-4 py-[0.594rem] body-1',
        large: 'h-12 px-5 py-[0.929rem] title-2',
      },
      color: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        essence: 'bg-essence-500 text-white hover:bg-essence-600',
        text: 'bg-text-500 text-white hover:bg-text-600',
        warning: 'bg-warning-500 text-white hover:bg-warning-600',
        success: 'bg-success-500 text-white hover:bg-success-600',
        error: 'bg-error-600 text-white hover:bg-error-500',
        warningAction: 'bg-warningAction-500 text-white hover:bg-warningAction-600',
        disabled: '!text-text-400 bg-text-50',
        cancel: 'bg-text-300 text-white hover:bg-text-400',
      },
    },

    compoundVariants: [
      {
        variant: 'outlined',
        color: 'primary',
        className: 'border-primary-500 !bg-transparent text-primary-500 hover:bg-primary-200 ',
      },
      {
        variant: 'outlined',
        color: 'secondary',
        className: 'border-secondary-500 bg-transparent text-secondary-500 hover:bg-secondary-200 ',
      },
      {
        variant: 'outlined',
        color: 'essence',
        className: 'border-essence-500 bg-transparent text-essence-500 hover:bg-essence-200 ',
      },
      {
        variant: 'outlined',
        color: 'text',
        className: 'border-text-500 bg-transparent text-text-500 hover:bg-text-200 ',
      },
      {
        variant: 'outlined',
        color: 'error',
        className: 'border-error-600 bg-transparent text-error-600 hover:bg-error-200 ',
      },
      {
        variant: 'outlined',
        color: 'success',
        className: 'border-success-500 bg-transparent text-success-500 hover:bg-success-200 ',
      },
      {
        variant: 'outlined',
        color: 'warning',
        className: 'border-warning-500 bg-transparent text-warning-500 hover:bg-warning-200 ',
      },
      {
        variant: 'outlined',
        color: 'warningAction',
        className: 'border-warningAction-500 bg-transparent text-warningAction-500 hover:bg-warningAction-200 ',
      },
      {
        variant: 'text',
        color: 'primary',
        className: 'text-primary-500 hover:text-primary-600 ',
      },
      {
        variant: 'text',
        color: 'secondary',
        className: 'text-secondary-500 hover:text-secondary-600 ',
      },
      {
        variant: 'text',
        color: 'essence',
        className: 'text-essence-500 hover:text-essence-600 ',
      },
      {
        variant: 'text',
        color: 'text',
        className: 'text-text-500 hover:text-text-600 ',
      },
      {
        variant: 'text',
        color: 'error',
        className: 'text-error-600 hover:text-error-400 ',
      },
      {
        variant: 'text',
        color: 'success',
        className: 'text-success-500 hover:text-success-600 ',
      },
      {
        variant: 'text',
        color: 'warning',
        className: 'text-warning-500 hover:text-warning-600 ',
      },
      {
        variant: 'text',
        color: 'warningAction',
        className: 'text-warningAction-500 hover:text-warningAction-600 ',
      },
      {
        variant: 'text',
        color: 'primary',
        className: 'text-primary-500 hover:text-primary-600 ',
      },
    ],
    defaultVariants: {
      variant: 'contained',
      size: 'medium',
      color: 'secondary',
    },
  }
);

export type ButtonColor = NonNullable<VariantProps<typeof baseButtonVariants>['color']>;

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof baseButtonVariants> {
  asChild?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
}

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className: classNameProps, variant, size, color, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const isTextDisabled = disabled && variant === 'text';

    const onClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        props.onClick?.(e);
      },
      [disabled, props]
    );

    const className = React.useMemo(() => {
      return cn(
        baseButtonVariants({
          variant: isTextDisabled ? 'text' : disabled ? 'disabled' : variant,
          size,
          color: disabled ? 'disabled' : color,
          className: classNameProps,
        })
      );
    }, [isTextDisabled, disabled, variant, size, color, classNameProps]);

    return <Comp className={className} ref={ref} {...props} onClick={onClick} />;
  }
);

BaseButton.displayName = 'BaseButton';

export { BaseButton, baseButtonVariants };
