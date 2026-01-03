import { BaseButton } from '@/components/ui/base-button';
import React from 'react';

export type ChatButtonProps = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const ChatButton = ({ title, onClick, disabled }: ChatButtonProps) => {
  return (
    <BaseButton 
      size="medium" 
      variant="contained" 
      onClick={onClick} 
      disabled={disabled}
    >
    {title}
    </BaseButton>
  );
};

export default ChatButton;