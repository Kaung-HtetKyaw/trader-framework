import { useEffect } from 'react';
import { AppListViewSettings, ListSettings, ListViews } from '@/types/list';
import { defaultListSettings } from '../config';
import useLocalStorage from './useLocalStorage';

/**
 * Interface for the return value of useListSettings hook
 * @template TColumns - Generic type extending string for column names
 */
export interface UseListSettings<TColumns extends string = string> {
  /** Current settings for the list view */
  settings: ListSettings<TColumns>;
  /** Function to update specific settings in the list view */
  updateListSettings: <T extends keyof ListSettings<TColumns>>(key: T, value: ListSettings<TColumns>[T]) => void;
}

/**
 * A custom hook for managing list view settings with persistent storage.
 * This hook provides functionality to manage and persist list-specific settings
 * such as sorting, filtering (only page size aka limit), and view preferences in localStorage.
 *
 * @template TColumns - Generic type extending string for column names
 * @param {ListViews} listName - The identifier for the specific list view
 * @returns {UseListSettings<TColumns>} Object containing current settings and update function
 *
 * @example
 * // Basic usage
 * const { settings, updateListSettings } = useListSettings(ListViews.CLUSTER_LIST);
 *
 * // Update sorting settings
 * updateListSettings('sortSettings', [{ id: 'name', desc: false }]);
 *
 * // Access current settings
 * console.log(settings.sortSettings);
 *
 * @description
 * Features:
 * - Persistent storage using localStorage
 * - Type-safe settings updates
 * - Default settings fallback
 * - Automatic initialization of new list views
 *
 * Settings stored:
 * - Sort settings (column and direction)
 * - Row number (items per page)
 * - View preferences
 * - Custom filters
 *
 * @example
 * // With TypeScript and custom columns
 * type MyColumns = 'name' | 'status' | 'date';
 * const { settings } = useListSettings<MyColumns>(ListViews.CUSTOM_LIST);
 *
 * @example
 * // Updating multiple settings
 * const { updateListSettings } = useListSettings(ListViews.CLUSTER_LIST);
 * updateListSettings('rowNumber', 25);
 * updateListSettings('sortSettings', [{ id: 'date', desc: true }]);
 */
export default function useListSettings<TColumns extends string = string>(
  listName: ListViews
): UseListSettings<TColumns> {
  const [settings, setListSettings] = useLocalStorage<AppListViewSettings>('listConfig', defaultListSettings);

  // Initialize settings for new list views
  useEffect(() => {
    if (settings[listName] === undefined) {
      setListSettings(settings => ({
        ...settings,
        [listName]: defaultListSettings[listName],
      }));
    }
  }, []);

  const updateListSettings = <T extends keyof ListSettings>(key: T, value: ListSettings[T]) =>
    setListSettings(settings => ({
      ...settings,
      [listName]: {
        ...settings[listName],
        [key]: value,
      },
    }));

  return {
    settings: (settings[listName] || defaultListSettings[listName]) as ListSettings<TColumns>,
    updateListSettings,
  };
}
