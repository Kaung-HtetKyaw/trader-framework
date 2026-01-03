import { renderHook } from '@testing-library/react';
import useInterdependentFilters from '../..';
import { DropdownOption } from '@/components/Dropdown';
import { InterdependentFilterDropdownOptions } from '../..';

export const initialNodes = [
  {
    type: 'Type A',
    group: 'Group A',
  },
  {
    type: 'Type A',
    group: 'Group B',
  },
  {
    type: 'Type A',
    group: 'Group C',
  },
  {
    type: 'Type B',
    group: 'Group A',
  },
  {
    type: 'Type B',
    group: 'Group B',
  },
  {
    type: 'Type B',
    group: 'Group C',
  },
  {
    type: 'Type C',
    group: 'Group A',
  },
  {
    type: 'Type C',
    group: 'Group B',
  },
  {
    type: 'Type C',
    group: 'Group C',
  },
  {
    type: 'Type D',
    group: 'Group A',
  },
  {
    type: 'Type D',
    group: 'Group B',
  },
];

export const typeOptions = [
  {
    label: 'Type A',
    value: 'Type A',
  },
  {
    label: 'Type B',
    value: 'Type B',
  },
  {
    label: 'Type C',
    value: 'Type C',
  },
  {
    label: 'Type D',
    value: 'Type D',
  },
];

export const groupOptions = [
  {
    label: 'Group A',
    value: 'Group A',
  },
  {
    label: 'Group B',
    value: 'Group B',
  },
  {
    label: 'Group C',
    value: 'Group C',
  },
];

export type TestParams = {
  type: string[];
  group: string[];
};

export const getRequiredSetupForInterdependentFilters = () => {
  let params = {} as TestParams;

  const changeParam = (key: keyof TestParams, value: string | string[]) => {
    params[key] = Array.isArray(value) ? value : [value];
  };

  const resetParams = () => {
    params = {
      type: [],
      group: [],
    };
  };

  return {
    initialNodes: initialNodes,
    params,
    filters: {
      type: {
        options: typeOptions,
        getter: (node: { type: string }) => node.type,
      },
      group: {
        options: groupOptions,
        getter: (node: { group: string }) => node.group,
      },
    },
    onApplyFilters: changeParam,
    onClearFilters: resetParams,
  };
};

export const getInterdependentOptionsFromDropdownOptions = <T>(
  options: DropdownOption[],
  key: keyof T,
  sourceData: T[]
): InterdependentFilterDropdownOptions[] => {
  const groupedByKey = Object.groupBy(sourceData, value => String(value[key]));

  return options.map(option => ({
    label: option.label,
    value: option.value,
    checked: true,
    disabled: false,
    count: groupedByKey[option.value]?.length || 0,
  }));
};

export const setupHook = () => {
  const options = getRequiredSetupForInterdependentFilters();
  const { result } = renderHook(() => useInterdependentFilters(options));

  return result;
};
