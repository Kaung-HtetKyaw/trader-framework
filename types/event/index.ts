import { K8sObjectTypeEnum } from '../visualization/k8sObjects';

export type EventType = 'Warning' | 'Normal';


// New interface for k8sEvent.list API response format
export interface K8sEvent {
  eventTime: string;
  clusterID: string;
  id: string;
  organizationID: string;
  reason: string;
  note: string;
  type: EventType;
  objectID: string;
  objectName: string;
  objectNamespace: string;
  objectKind: K8sObjectTypeEnum;
}

export interface K8sEventListResponse {
  pagination: {
    nextCursor: string;
    prevCursor: string;
    pageSize: number;
  };
  items: K8sEvent[];
}

export interface K8sEventListRequest {
  filter?: {
    clusterID?: string;
    beginAt?: string;
    endAt?: string;
    objectIDs?: string[];
  };
  sort?: {
    eventTime?: 'asc' | 'desc';
    id?: 'asc' | 'desc';
  };
  pagination?: {
    nextCursor?: string;
    prevCursor?: string;
    pageSize?: number;
  };
}

export type TimeRange = '15m' | '1h' | '6h' | '24h' | '7d';



