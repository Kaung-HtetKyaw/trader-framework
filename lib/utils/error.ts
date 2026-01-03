import { CustomToast } from '@/components/CustomToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type BackendError = {
  errorCode: ErrorCodeEnum;
  errorMessage: string;
  statusCode?: number;
};

export const ErrorCodes = {
  // Bad Request Errors (400)
  EKG40000: 'EKG40000',
  EKG40001: 'EKG40001',
  EKG40002: 'EKG40002',
  EKG40003: 'EKG40003',
  EKG40004: 'EKG40004',
  EKG40005: 'EKG40005',
  EKG40100: 'EKG40100',
  EKG40101: 'EKG40101',
  EKG40102: 'EKG40102',
  EKG40103: 'EKG40103',
  EKG40104: 'EKG40104',
  EKG40105: 'EKG40105',
  EKG40106: 'EKG40106',
  EKG40107: 'EKG40107',
  EKG40108: 'EKG40108',
  EKG40109: 'EKG40109',
  EKG40400: 'EKG40400',
  EKG40401: 'EKG40401',
  EKG40402: 'EKG40402',
  // Conflict Errors (409)
  EKG40901: 'EKG40901',
  // Internal Server Error (500)
  EKG50000: 'EKG50000',
} as const;

export const ReadableErrorMessages = {
  // Bad Request Errors (400)
  BAD_REQUEST: 'BAD_REQUEST',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  DUPLICATE_CLUSTER_TOKEN_NAME: 'DUPLICATE_CLUSTER_TOKEN_NAME',
  DUPLICATE_CLUSTER_GROUP_NAME: 'DUPLICATE_CLUSTER_GROUP_NAME',
  DUPLICATE_IDENTITY: 'DUPLICATE_IDENTITY',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_EMAIL_OR_PASSWORD: 'INVALID_EMAIL_OR_PASSWORD',
  RESOURCE_NOT_OWNED: 'RESOURCE_NOT_OWNED',
  INVALID_VERIFY_TOKEN: 'INVALID_VERIFY_TOKEN',
  VERIFY_TOKEN_EXPIRED: 'VERIFY_TOKEN_EXPIRED',
  VERIFY_TOKEN_USED: 'VERIFY_TOKEN_USED',
  FORGOT_PASSWORD_TOKEN_EXPIRED: 'FORGOT_PASSWORD_TOKEN_EXPIRED',
  FORGOT_PASSWORD_TOKEN_USED: 'FORGOT_PASSWORD_TOKEN_USED',
  UNVERIFIED_USER: 'UNVERIFIED_USER',
  UNREGISTERED_CLUSTER: 'UNREGISTERED_CLUSTER',
  NOT_FOUND: 'NOT_FOUND',
  NOT_FOUND_NEXT_K8S_VERSION: 'NOT_FOUND_NEXT_K8S_VERSION',
  USER_ALREADY_BELONGS_TO_ORG: 'USER_ALREADY_BELONGS_TO_ORG',
  ORGANIZATION_INVITE_NOT_FOUND: 'ORGANIZATION_INVITE_NOT_FOUND',
  // Conflict Errors (409)
  USER_ALREADY_ACCEPTED_INVITE: 'USER_ALREADY_ACCEPTED_INVITE',
  // Internal Server Error (500)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

type ReadableErrorMessageEnum = keyof typeof ReadableErrorMessages;
type ErrorCodeEnum = keyof typeof ErrorCodes;

export const ErrorMessages: Record<ReadableErrorMessageEnum, BackendError> = {
  // Bad Request Errors (400)
  BAD_REQUEST: {
    errorCode: 'EKG40000',
    errorMessage: 'bad request',
    statusCode: 400,
  },
  EMAIL_ALREADY_EXISTS: {
    errorCode: 'EKG40001',
    errorMessage: 'email already exists',
    statusCode: 400,
  },
  DUPLICATE_IDENTITY: {
    errorCode: 'EKG40002',
    errorMessage: 'duplicate identity',
    statusCode: 400,
  },
  DUPLICATE_CLUSTER_TOKEN_NAME: {
    errorCode: 'EKG40003',
    errorMessage: 'This name is already taken, please choose another one.',
    statusCode: 400,
  },
  DUPLICATE_CLUSTER_GROUP_NAME: {
    errorCode: 'EKG40004',
    errorMessage: 'This name is already taken, please choose another one.',
    statusCode: 400,
  },
  USER_ALREADY_BELONGS_TO_ORG: {
    errorCode: 'EKG40005',
    errorMessage: 'This user is already part of your organisation.',
  },
  USER_ALREADY_ACCEPTED_INVITE: {
    errorCode: 'EKG40901',
    errorMessage: 'This user has already accepted the invite.',
  },
  // Unauthorized Errors (401)
  UNAUTHORIZED: {
    errorCode: 'EKG40100',
    errorMessage: 'Insufficient permissions',
    statusCode: 401,
  },
  INVALID_EMAIL_OR_PASSWORD: {
    errorCode: 'EKG40101',
    errorMessage: 'invalid email or password',
    statusCode: 401,
  },
  RESOURCE_NOT_OWNED: {
    errorCode: 'EKG40102',
    errorMessage: 'Resource not owned',
    statusCode: 401,
  },
  INVALID_VERIFY_TOKEN: {
    errorCode: 'EKG40103',
    errorMessage: 'invalid verify token',
    statusCode: 401,
  },
  VERIFY_TOKEN_EXPIRED: {
    errorCode: 'EKG40104',
    errorMessage: 'verify token expired',
    statusCode: 401,
  },
  VERIFY_TOKEN_USED: {
    errorCode: 'EKG40105',
    errorMessage: 'verify token already used',
    statusCode: 401,
  },
  FORGOT_PASSWORD_TOKEN_EXPIRED: {
    errorCode: 'EKG40106',
    errorMessage: 'forgot password token expired',
    statusCode: 401,
  },
  FORGOT_PASSWORD_TOKEN_USED: {
    errorCode: 'EKG40107',
    errorMessage: 'forgot password already used',
    statusCode: 401,
  },
  UNVERIFIED_USER: {
    errorCode: 'EKG40108',
    errorMessage: 'Unverified user',
    statusCode: 401,
  },
  UNREGISTERED_CLUSTER: {
    errorCode: 'EKG40109',
    errorMessage: 'Unregistered cluster',
    statusCode: 401,
  },
  // Not Found Errors (404)
  NOT_FOUND: {
    errorCode: 'EKG40400',
    errorMessage: 'Not found',
    statusCode: 404,
  },
  NOT_FOUND_NEXT_K8S_VERSION: {
    errorCode: 'EKG40401',
    errorMessage: 'not found next kubernetes version',
    statusCode: 404,
  },
  ORGANIZATION_INVITE_NOT_FOUND: {
    errorCode: 'EKG40402',
    errorMessage: 'Organization invite not found',
  },
  // Internal Server Error (500)
  INTERNAL_SERVER_ERROR: {
    errorCode: 'EKG50000',
    errorMessage: 'Something went wrong',
    statusCode: 500,
  },
} as const;

export const notifyErrorFromResponse = <T>(response: ResponseWithError<T>, notify?: (error: string) => void) => {
  const backendError = getErrorFromResponse(response);

  if (!backendError) return { error: null, notify: () => {} };

  if (notify) {
    return {
      error: backendError,
      notify: (error?: string) => {
        return notify(error || getDefaultErrorMessageByErrorCode(backendError.errorCode) || 'Something went wrong');
      },
    };
  }

  return {
    error: backendError,

    notify: (error?: string) => {
      return CustomToast({
        type: 'error',
        message: error || getDefaultErrorMessageByErrorCode(backendError.errorCode) || 'Something went wrong',
      });
    },
  };
};

type ResponseWithError<
  T,
  // TODO: improve SerializedError type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E = FetchBaseQueryError | any,
> = {
  data?: T;
  error?: E;
};

export const getErrorFromResponse = <T>(response: ResponseWithError<T>) => {
  if ('error' in response) {
    const error = response?.error?.data as BackendError;
    return error;
  }

  return null;
};

export const getDefaultErrorMessageByErrorCode = (errorCode: ErrorCodeEnum) => {
  return (
    Object.values(ErrorMessages).find(error => error.errorCode === errorCode)?.errorMessage || 'Something went wrong'
  );
};

export const getDefaultErrorCodeByStatusCode = (statusCode: number) => {
  return Object.values(ErrorMessages).find(error => error.statusCode === statusCode)?.errorCode || 'EKG50000';
};

export const transformApiErrorResponse = (error: FetchBaseQueryError, message?: string) => {
  const errorData = error.data as BackendError;
  return {
    success: false,
    errorMessage: errorData.errorMessage,
    data: {
      errorCode: errorData.errorCode,
      errorMessage: message || errorData.errorMessage,
    },
  };
};
