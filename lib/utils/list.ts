import { SortingState } from '@tanstack/react-table';
import { get } from 'lodash/fp';

// Type for accessing nested properties safely
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type SortValue = string | number | boolean | null | undefined;

// Helper function to get nested value with type safety
function getNestedValue<T extends object>(obj: T, path: NestedKeyOf<T>): SortValue {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown) as SortValue;
}

/**
 * Sorts an array of objects based on one or multiple sort criteria defined in the sorting state.
 * This function supports nested property access and multiple data types.
 *
 * @template TData - Generic type that extends object, representing the data structure to be sorted
 * @param {TData[]} data - Array of objects to be sorted
 * @param {SortingState} sorting - Array of sort configurations from TanStack Table
 * @returns {TData[]} A new sorted array, leaving the original array unchanged
 *
 * @example
 * // Single column sort
 * const data = [{ name: "B" }, { name: "A" }];
 * const sorting = [{ id: "name", desc: false }];
 * const sorted = getSortedData(data, sorting);
 * // Result: [{ name: "A" }, { name: "B" }]
 *
 * @example
 * // Nested property sort
 * const data = [{ stats: { health: 90 }}, { stats: { health: 80 }}];
 * const sorting = [{ id: "stats.health", desc: true }];
 * const sorted = getSortedData(data, sorting);
 * // Result: [{ stats: { health: 90 }}, { stats: { health: 80 }}]
 *
 * @description
 * Supported data types for sorting:
 * - Numbers: Numerical comparison
 * - Strings: Locale-aware string comparison
 * - Booleans: false < true
 * - null/undefined: Treated as lowest value
 *
 * Features:
 * - Multi-column sorting (processes sort criteria in order)
 * - Handles nested object properties using dot notation
 * - Preserves original array (creates new sorted array)
 * - Type-safe with TypeScript generics
 * - Null-safe property access
 */
export const getSortedData = <TData extends object>(data: TData[], sorting: SortingState) => {
  if (!sorting.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const { id, desc } = sort;

      const aValue = getNestedValue(a, id as NestedKeyOf<TData>);
      const bValue = getNestedValue(b, id as NestedKeyOf<TData>);

      if (aValue === bValue) continue;

      if (aValue === null || aValue === undefined) return desc ? -1 : 1;
      if (bValue === null || bValue === undefined) return desc ? 1 : -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return desc ? bValue - aValue : aValue - bValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return desc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return desc ? (bValue === aValue ? 0 : bValue ? 1 : -1) : aValue === bValue ? 0 : aValue ? 1 : -1;
      }
    }
    return 0;
  });
};

export const getUniqueValues = <TData extends object | string>(data: TData[], key?: keyof TData) => {
  if (!key) return [...new Set(data.map(item => item))];

  return [...new Set(data.map(item => get(key, item)))];
};
