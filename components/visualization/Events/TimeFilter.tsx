'use client';
import type { TimeRange } from '@/types/event';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { BaseButton } from '../../ui/base-button';
import { CheckIcon } from '@/components/svgs/CheckIcon';
import { ChevronDown } from 'lucide-react';
import { useState, startTransition } from 'react';

export const timeOptions = [
  { value: '15m', label: '15 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '6h', label: '6 Hours' },
  { value: '24h', label: '1 Day' },
  { value: '7d', label: '7 Days' },
] as const;

export default function TimeFilter({
  value,
  onChange,
}: {
  value: TimeRange | undefined;
  onChange: (v: TimeRange) => void;
}) {
  const selectedOption = timeOptions.find(option => option.value === value);
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: TimeRange) => {
    setOpen(false);
    requestAnimationFrame(() => {
      startTransition(() => {
        onChange(selectedValue);
      });
    });
  };

  return (
    <div className="flex items-center justify-start pt-0 p-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <BaseButton
            variant="outlined"
            className="border w-[250px] justify-between rounded-sm border-text-200 hover:bg-transparent h-8 px-3 flex items-center gap-2 bg-white"
          >
            <span className="text-sm text-text-900">
              <span className="font-semibold text-secondary-500">Time Period:</span>{' '}
              {selectedOption?.label || 'Select time range'}
            </span>
            <ChevronDown size={14} className="text-text-400" />
          </BaseButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white p-2 w-[250px]" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-1">
            {timeOptions.map(option => {
              const active = option.value === value;
              return (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={`flex justify-between text-left px-2 py-2 text-sm rounded-sm ${
                    active ? 'bg-primary-950 text-white' : 'text-text-900 hover:bg-primary-50'
                  }`}
                >
                  {option.label}
                  {active && <CheckIcon className="w-4 h-4 text-success-600" />}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
