import { useRouter, useSearchParams } from 'next/navigation';
import { parseQs, stringifyQs } from '../utils';
import { PaginationParams } from '@/types/list';
import { useMemo } from 'react';
import { omit } from 'lodash/fp';

/**
 * Props for configuring the useQueryParams hook
 * @template T - The type of query parameters
 */
export type QueryParamsProps<T> = {
  /**
   * Array of parameter keys that should be treated as arrays.
   * These parameters will be automatically split by commas when parsing from the URL.
   */
  listKeys?: (keyof T)[];
};

export type ChangeParamFn<T> = (key: keyof T, value: string | string[]) => void;
export type MultiParamsOptions<T> = {
  [key in keyof T]?: MultiParamsOptionsItem;
};
export type MultiParamsOptionsItem = {
  value?: string | string[];
  remove?: boolean;
};
export type ChangeMultipleParamsFn<T> = (params: MultiParamsOptions<T>) => void;

/**
 * A React hook for managing URL query parameters with support for pagination and list parameters.
 *
 * @template T - The type of query parameters (defaults to PaginationParams)
 * @param props - Optional configuration for the hook
 * @returns An object containing the current parameters and methods to update them
 *
 * @example
 * // Basic usage with default pagination params
 * const { params, changeParam, resetParams } = useQueryParams();
 *
 * @example
 * // Usage with custom parameters and list keys
 * interface CustomParams {
 *   search: string;
 *   filters: string[];
 *   page: number;
 *   perPage: number;
 * }
 *
 * const { params, changeParam, resetParams } = useQueryParams<CustomParams>({
 *   listKeys: ['filters']
 * });
 */
const useQueryParams = <T = PaginationParams>(props?: QueryParamsProps<T>) => {
  const { listKeys = [] } = props || {};
  const router = useRouter();

  const searchParams = useSearchParams();

  const paramsString = searchParams.toString();

  /**
   * Parses the current URL parameters and handles list parameters
   * @returns Parsed parameters object
   */
  const parsedParams = useMemo(() => {
    if (!paramsString) return {} as T;

    const parsedParams = parseQs(paramsString) as T;

    const listParams = listKeys.reduce(
      (acc, key) => {
        const paramString = parsedParams[key] as string | undefined;
        if (typeof paramString === 'undefined') return acc;

        const paramArray = paramString?.split(',') || [];
        return { ...acc, [key]: paramArray.filter(Boolean) };
      },
      {} as Record<keyof T, string[]>
    );

    // @ts-expect-error we know that the value is either a string or an array of strings
    return { ...omit(listKeys, parsedParams), ...listParams };
  }, [paramsString, listKeys]);

  /**
   * Updates a specific query parameter in the URL
   * @param key - The parameter key to update
   * @param value - The new value for the parameter (string or array of strings)
   */
  const changeParam: ChangeParamFn<T> = (key: keyof T, value: string | string[]) => {
    const newParams = parseQs(paramsString) as T;

    // @ts-expect-error we know that the value is either a string or an array of strings
    newParams[key] = Array.isArray(value) ? value.join(',') : value;

    router.push(`?${stringifyQs(newParams)}`);
  };

  /**
   * Updates multiple query parameters in the URL
   * @param params
   */
  const changeMultipleParams: ChangeMultipleParamsFn<T> = params => {
    const existingParams = (parseQs(paramsString) || {}) as T;

    Object.entries(params).forEach(el => {
      const [key, value] = el as [keyof T, MultiParamsOptionsItem];
      if (value.remove) {
        delete existingParams[key];
      } else {
        const paramValue = (Array.isArray(value.value) ? value.value.join(',') : value.value) as T[keyof T];
        existingParams[key] = paramValue as T[keyof T];
      }
    });

    router.push(`?${stringifyQs(existingParams)}`);
  };

  const removeParams = (key: keyof T) => {
    const newParams = parseQs(paramsString) as T;
    delete newParams[key];
    router.push(`?${stringifyQs(newParams)}`);
  };

  /**
   * Resets all query parameters to empty values
   */
  const resetParams = () => {
    router.push(`?${stringifyQs({})}`);
  };

  /**
   * @returns An object containing:
   * - params: The current query parameters
   * - changeParam: Function to update a parameter
   * - changeMultipleParams: Function to update multiple parameters
   * - resetParams: Function to reset all parameters
   */
  return { params: parsedParams as T, changeParam, changeMultipleParams, resetParams, removeParams };
};

export default useQueryParams;
