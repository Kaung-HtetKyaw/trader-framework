import Container from '@/components/Container';
import { cn } from '@/lib/utils';
import Divider from '../Divider';
import React from 'react';
import HorizontalScrollContainer from '../HorizontalScrollContainer';

export type CountInfoPanelProps = {
  items: {
    count?: number;
    label: string;
    description?: string;
  }[];
};

const CountInfoPanel = ({ items }: CountInfoPanelProps) => {
  return (
    <HorizontalScrollContainer>
      <Container className={cn('py-4 flex flex-row justify-between gap-0 items-center min-w-[770px]')}>
        {items.map((el, index) => (
          <React.Fragment key={el.label}>
            <div className={cn('flex flex-row items-center gap-2')}>
              <p className="body-2 w-9 h-9 rounded-sm bg-primary-950 flex items-center justify-center font-bold text-white">
                {el.count}
              </p>

              <div className="flex flex-col items-start">
                <p className="body-1 font-[400]">{el.label} </p>
                <p className="inline-1 text-text-500">{el.description}</p>
              </div>
            </div>

            {index === items.length - 1 ? (
              <div className="block"></div>
            ) : (
              <Divider type="vertical" className="block h-9" />
            )}
          </React.Fragment>
        ))}
      </Container>
    </HorizontalScrollContainer>
  );
};

export default CountInfoPanel;
