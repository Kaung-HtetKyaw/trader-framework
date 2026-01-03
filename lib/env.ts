import { identity, split, toInteger, toNumber } from 'lodash/fp';

/**
 * @deprecated
 * This file is deprecated and will be removed.
 *
 * This is the initial attempt to implement environment variables with validation.
 * Problems with this implementation:
 * 1. Next.js tree-shaking: Next.js only includes environment variables that are statically
 *    referenced using `process.env.VARIABLE_NAME`. Dynamic access using `process.env[key]`
 *    won't work as Next.js can't detect these at build time 🫠.
 *
 * 2. Client/Server separation: This implementation doesn't enforce proper separation between
 *    server-only and client-accessible environment variables, which can lead to security issues.
 *
 *
 * Solution:
 * We now use @t3-oss/env-nextjs instead, which provides:
 * - Proper Next.js tree-shaking support
 * - Runtime validation with Zod
 * - Build-time type safety
 * - Strict client/server separation
 * - Better error messages
 *
 * See lib/config/index.ts for the new implementation using @t3-oss/env-nextjs.
 * @see https://env.t3.gg/docs/introduction
 */

export const toBoolean = (value: string) =>
  value === 'true' || value === '1' || value === 'on' || false;

type RequiredConfig<T> = { required: boolean; fallbackValue?: T };

// Function overloads for getValue
export function getValue<T>(
  key: string,
  config: RequiredConfig<T>,
  format?: (value: string) => T
): T;
export function getValue<T>(
  key: string,
  fallbackValue: T | undefined,
  format?: (value: string) => T
): T;
export function getValue<T>(
  key: string,
  configOrFallback: T | RequiredConfig<T> | undefined,
  formatFn?: (value: string) => T
): T {
  const value = process.env[key];

  const isRequired =
    configOrFallback &&
    typeof configOrFallback === 'object' &&
    (configOrFallback as RequiredConfig<T>).required;

  const isNotRequiredWithConfig =
    configOrFallback &&
    typeof configOrFallback === 'object' &&
    !(configOrFallback as RequiredConfig<T>).required;

  const format = formatFn || (identity as (value: string) => T);

  if (isRequired && (value === undefined || value === '')) {
    throw new Error(`Required environment variable ${key} is not defined`);
  }

  if (isNotRequiredWithConfig && (value === undefined || value === '')) {
    return (configOrFallback as RequiredConfig<T>).fallbackValue as T;
  }

  if (value === undefined || value === '') {
    if (isRequired) {
      throw new Error(`Required environment variable ${key} is not defined`);
    }
    return configOrFallback as T;
  }

  return format(value);
}

// Function overloads for getString
export function getString(key: string, config: RequiredConfig<string>): string;
export function getString(
  key: string,
  fallbackValue?: string
): string | undefined;
export function getString(
  key: string,
  configOrFallback?: string | RequiredConfig<string>
): string | undefined {
  return getValue<string>(
    key,
    configOrFallback as string | undefined,
    identity
  );
}

export const getInteger = (key: string, fallbackValue?: number) =>
  getValue(key, fallbackValue, toInteger);

export const getNumber = (key: string, fallbackValue?: number) =>
  getValue(key, fallbackValue, toNumber);

export const getBoolean = (key: string, fallbackValue?: boolean) =>
  getValue(key, fallbackValue, toBoolean);

export const getStringList = (
  key: string,
  fallbackValue?: string[],
  separator = ','
) => getValue(key, fallbackValue, (value) => value.split(separator));

export const getPrefix = (key: string) => `VITE_APP_${key}`;

export const getStringArray = (
  key: string,
  fallbackValue: string[] = []
): string[] => getValue(key, fallbackValue, split(','));
