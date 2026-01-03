import { BackendError } from '@/lib/utils/error';
import { PaginationParams } from './list';

export interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
}
export interface Pod {
  id: string;
  namespace: string;
  name: string;
}
export interface Container {
  id: string;
  podID: string;
  name: string;
  image: string;
}

export type AuthResponse = {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  redirectTo?: string;
};

export type BaseApiResponse<T = unknown> = {
  data: T;
  message?: string;
  error?: BackendError;
};

export type OrganizationMemberListParams = PaginationParams & {
  search: string;
};
