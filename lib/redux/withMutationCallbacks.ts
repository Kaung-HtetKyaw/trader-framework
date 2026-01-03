/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

/**
 * Response type for mutation operations
 */
export type MutationResponse<T> = {
  data?: T;
  error?: FetchBaseQueryError | SerializedError;
};

/**
 * Result type for mutation hooks
 */
export type UseMutationResult<T, R> = readonly [
  (arg: T) => Promise<MutationResponse<R>>,
  {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    error?: FetchBaseQueryError | SerializedError;
  }
];

/**
 * Props for configuring mutation callbacks
 */
export type UseMutationWithCallbacksProps<R> = {
  onSuccess?: (response: R) => void;
  onError?: (error: FetchBaseQueryError | SerializedError) => void;
};

export type UseMutationWithCallbacksResult<T, R> = UseMutationResult<T, R>;

type InferMutationArg<T> = T extends (arg: infer A) => any ? A : never;
type InferMutationResponse<T> = T extends (arg: any) => Promise<MutationResponse<infer R>> ? R : never;

/**
 * Wraps a mutation hook with success and error callbacks
 * @template T - The mutation hook type
 * @param mutationHook - The mutation hook to wrap
 * @param callbacks - Optional callbacks for success and error handling
 * @returns The wrapped mutation hook with callbacks
 *
 * @warning Do not use this wrapper with mutations that have `notifyOnSuccess` or `notifyOnError`
 * options from reduxBaseQueryWithErrorHandling, as it will cause duplicate notifications.
 *
 * @example
 * ```ts
 * // Basic usage
 * const [mutate, state] = withMutationCallbacks(useCreateUserMutation, {
 *   onSuccess: (data) => console.log('User created:', data),
 *   onError: (error) => console.error('Failed to create user:', error)
 * });
 *
 * // Using with async/await
 * const handleSubmit = async (userData) => {
 *   try {
 *     const result = await mutate(userData);
 *     // Handle result
 *   } catch (error) {
 *     // Error already handled by onError callback
 *   }
 * };
 * ```
 */
export function withMutationCallbacks<T extends () => UseMutationResult<any, any>>(
  mutationHook: T,
  callbacks?: UseMutationWithCallbacksProps<InferMutationResponse<ReturnType<T>[0]>>
): UseMutationWithCallbacksResult<InferMutationArg<ReturnType<T>[0]>, InferMutationResponse<ReturnType<T>[0]>> {
  const [mutate, state] = mutationHook();

  const wrappedMutate = async (
    arg: InferMutationArg<ReturnType<T>[0]>
  ): Promise<MutationResponse<InferMutationResponse<ReturnType<T>[0]>>> => {
    try {
      const result = await mutate(arg);
      if (result.data) {
        callbacks?.onSuccess?.(result.data);
      }
      return result;
    } catch (error) {
      callbacks?.onError?.(error as FetchBaseQueryError | SerializedError);
      throw error;
    }
  };

  return [wrappedMutate, state] as const;
}
