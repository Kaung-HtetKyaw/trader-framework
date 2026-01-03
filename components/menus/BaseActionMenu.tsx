'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { MenuTriggerIcon } from '../svgs/MenuTriggerIcon';

export type ActionMenuItem = {
  label: string;
  icon?: React.ComponentType<{ className?: string; alt?: string }>;
  onSelect: () => void;
};

type BaseActionMenuProps = {
  items: ActionMenuItem[];
  triggerIcon?: React.ComponentType<{ className?: string; alt?: string }>;
  iconSize?: number;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
};

const BaseActionMenu: React.FC<BaseActionMenuProps> = ({ items, className, side, disabled }) => {
  if (disabled) {
    return (
      <button className="rounded-full opacity-50" disabled tabIndex={-1} aria-disabled="true">
        <MenuTriggerIcon className="w-6 h-6" />
      </button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="min-w-6 h-6 rounded-full focus:outline-none focus:ring-0 focus-visible:ring-0">
          <MenuTriggerIcon className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side ?? 'left'}
        align="start"
        className={`bg-white shadow-md rounded-lg border border-text-50 p-3 ${className}`}
      >
        {items.map((item, idx) => (
          <DropdownMenuItem
            key={idx}
            onSelect={item.onSelect}
            className="hover:text-secondary-950 hover:bg-primary-50 cursor-pointer flex items-center gap-2"
          >
            {item.icon && <item.icon className="w-6 h-6" />}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BaseActionMenu;
