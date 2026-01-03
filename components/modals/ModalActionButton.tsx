import { cn } from '@/lib/utils';
import { BaseButton, BaseButtonProps } from '../ui/base-button';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ModalActionButtonTypes = {
  cancel: 'cancel',
  submit: 'submit',
} as const;
export type ModalActionButtonTypeEnum = keyof typeof ModalActionButtonTypes;

export type ModalActionButtonProps = BaseButtonProps & {
  action: ModalActionButtonTypeEnum;
};

const ModalActionButton = ({ className, variant, size, color, action, type, ...props }: ModalActionButtonProps) => {
  return (
    <BaseButton
      variant={variant || 'contained'}
      color={color || (action === 'cancel' ? 'cancel' : 'secondary')}
      size={size || 'medium'}
      type={type || (action === 'submit' ? 'submit' : 'button')}
      className={cn('flex w-[120px] md:w-[156px] h-9 px-4 justify-center items-center gap-2 rounded-sm ', className)}
      {...props}
    >
      {props.children}
    </BaseButton>
  );
};

export default ModalActionButton;
