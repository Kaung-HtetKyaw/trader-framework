import { BaseButton } from '@/components/ui/base-button';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

export type UsageMeterSegmentType = 'current usage' | 'request' | 'limit' | 'full size';

export type UsageMeterSegment = {
  type: UsageMeterSegmentType;
  value: number;
  unit: string;
  color: string;
};

export type CPUMemUsageProps = {
  usageMetrics: Record<ClusterMetricsType, ClusterMetrics>;
};

export type ClusterMetrics = {
  title: string;
  description: string;
  percentage: number;
  metrics: UsageMeterSegment[];
};

export type ClusterMetricsType = 'cpu' | 'memory';

export const UsageMeterSegmentOrder = ['current usage', 'request', 'limit', 'full size'];

const CPUMemUsage = ({ usageMetrics }: CPUMemUsageProps) => {
  const [activeTab, setActiveTab] = useState<ClusterMetricsType>('cpu');

  const activeMetrics = useMemo(() => {
    return usageMetrics[activeTab];
  }, [activeTab, usageMetrics]);

  const orderedMetrics = useMemo(() => {
    return activeMetrics.metrics.sort((a, b) => {
      return UsageMeterSegmentOrder.indexOf(a.type) - UsageMeterSegmentOrder.indexOf(b.type);
    });
  }, [activeMetrics.metrics]);

  const hasData = useMemo(() => {
    const total = activeMetrics.metrics.find(m => m.type === 'full size')?.value ?? 0;
    return total > 0;
  }, [activeMetrics.metrics]);

  const onSelectTab = (tab: ClusterMetricsType) => {
    setActiveTab(tab);
  };

  // Use the maximum value across all metrics as the baseline for accurate visual comparison
  const maxValue = useMemo(() => {
    return Math.max(...activeMetrics.metrics.map(m => m.value), 1);
  }, [activeMetrics.metrics]);

  const getPercentage = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-2">
        {Object.entries(usageMetrics).map(([key, el]) => (
          <BaseButton
            key={el.title}
            className={cn(
              'bg-primary-950 h-6 rounded-sm',
              activeTab === key
                ? 'text-white bg-primary-900 hover:bg-primary-900'
                : 'text-text-500 bg-secondary-50 hover:bg-secondary-100'
            )}
            onClick={() => onSelectTab(key as ClusterMetricsType)}
          >
            <p className="h-4 flex items-center justify-center">{el.title}</p>
          </BaseButton>
        ))}
      </div>

      {/* Metrics List */}
      <div className="flex flex-col gap-4">
        {hasData ? (
          orderedMetrics.map(metric => {
            const percentage = getPercentage(metric.value);
            const displayValue = `${metric.value.toFixed(2)} ${metric.unit}`;

            return (
              <div key={metric.type} className="flex items-center gap-2 w-full overflow-visible">
                <span className="body-2 text-text-700 capitalize font-medium min-w-[90px] w-[120px] flex-shrink-0">
                  {metric.type}
                </span>
                <div className="relative h-5 flex-1 min-w-0 overflow-visible">
                  <div
                    className={cn('h-full rounded-xs transition-all duration-500', metric.color)}
                    style={{ width: `${percentage}%`, minWidth: '40px' }}
                  />
                  <span
                    className="absolute top-0 h-full flex items-center body-2 text-text-500 pl-2 whitespace-nowrap"
                    style={{ left: `${percentage}%` }}
                  >
                    {displayValue}
                  </span>
                </div>
                <div className="w-24 flex-shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-24 text-text-400">
            <p className="body-2">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPUMemUsage;
