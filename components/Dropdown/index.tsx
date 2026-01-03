export { default as SingleSelectDropdown } from './SingleSelectDropdown';
export * from './SingleSelectDropdown';
export { default as MultiSelectDropdown } from './MultiSelectDropdown';
export * from './MultiSelectDropdown';

export type DropdownOption<T = string> = {
  label: string;
  value: T;
  count?: number;
};
