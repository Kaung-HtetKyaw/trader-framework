'use client';

import { memo } from 'react';
import type { K8sEvent, EventType } from '@/types/event';
import { format } from 'date-fns';

const barClassByType: Record<EventType, string> = {
  Warning: 'bg-warning-500',
  Normal: 'bg-secondary-500',
};

const fmtTime = (iso: string) => format(new Date(iso), 'yyyy/MM/dd, HH:mm:ss');

function EventItemBase({ e, clusterName }: { e: K8sEvent; clusterName?: string }) {
  return (
    <div className="flex flex-col gap-1" data-event-id={e.id}>
      <div className="flex items-center justify-between text-[12px] text-text-500">
        <span>{fmtTime(e.eventTime)}</span>
      </div>

      <div className="rounded-md border border-text-100 overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between px-4 pt-3">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-1 rounded ${barClassByType[e.type]}`} />
                <div className="text-[13px] text-text-500 leading-none">{e.objectName}</div>
              </div>
              <div className="text-[12px] text-text-500">{e.objectKind}</div>
            </div>
            <div className="px-4 py-2 min-w-0">
              <p className="text-[13px] text-text-900 leading-5 line-clamp-3 break-words whitespace-pre-wrap">
                {e.note}
              </p>
            </div>
            <div className="px-4 pb-3">
              <div className="rounded-lg bg-text-50 px-3 py-3">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
                  <div className="w-full">
                    <div className="text-text-500">Namespace:</div>
                    <div className="text-text-900">{e.objectNamespace ?? '—'}</div>
                  </div>
                  <div className="w-full">
                    <div className="text-text-500">Cluster name:</div>
                    <div className="text-text-900">{clusterName ?? e.clusterID ?? '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(EventItemBase);
