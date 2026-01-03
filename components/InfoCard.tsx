import { INFO_IMAGES, INFO_TYPE } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { X } from 'lucide-react';
import { BaseButton } from './ui/base-button';

// TODO: refactor this type and remove the union type
export type InfoCardContent = string | string[] | { text: string; children?: InfoCardContent[] };

export interface InfoCard {
  type: string;
  title: string;
  content: InfoCardContent;
  onClose?: () => void;
  button?: {
    label: string;
    onClick: () => void;
  };
}

const InfoCard = ({ type, title, content, onClose, button }: InfoCard) => {
  const renderContent = (items: InfoCardContent, level = 0): React.ReactNode => {
    if (typeof items === 'string') {
      return <span>{items}</span>;
    }

    if (Array.isArray(items) && items.every(item => typeof item === 'string')) {
      return (
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    return (
      <p>
        <span>{(items as { text: string }).text}</span>
        {(items as { children?: InfoCardContent[] }).children && (
          <ul className="pl-11 list-disc mt-1">
            {(items as { children: InfoCardContent[] }).children.map((child: InfoCardContent, idx: number) => (
              <li key={idx}>{renderContent(child, level + 1)}</li>
            ))}
          </ul>
        )}
      </p>
    );
  };

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg',
        type === INFO_TYPE.error ? 'bg-red-50' : type === INFO_TYPE.info ? 'bg-secondary-50' : 'bg-success-50'
      )}
    >
      <div className="flex space-x-4 items-start flex-1">
        <Image src={INFO_IMAGES[type]} alt="icon" width={24} height={24} className="w-6 h-6" />

        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between gap-4">
            <h4
              className={cn(
                'text-sm font-semibold',
                type === INFO_TYPE.error
                  ? 'text-error-700'
                  : type === INFO_TYPE.info
                    ? 'text-secondary-500'
                    : 'text-success-700'
              )}
            >
              {title}
            </h4>

            {onClose && (
              <button
                onClick={onClose}
                className={cn('p-1 rounded hover:bg-gray-200 transition-colors text-text-950')}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className={cn('text-sm flex-1', type === INFO_TYPE.error ? 'text-error-800' : 'text-text-950')}>
              {renderContent(content)}
            </div>

            {button && (
              <BaseButton
                variant="contained"
                size="small"
                onClick={button.onClick}
                color={type === INFO_TYPE.error ? 'error' : type === INFO_TYPE.info ? 'secondary' : 'success'}
              >
                {button.label}
              </BaseButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
