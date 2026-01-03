import { expect, it, describe } from 'vitest';
import { act } from '@testing-library/react';
import {
  setupHook,
  getInterdependentOptionsFromDropdownOptions,
  typeOptions,
  groupOptions,
  getRequiredSetupForInterdependentFilters,
} from './utils/setup';

describe('useInterdependentFilters', () => {
  it('should return an object containing defined filter management functions', () => {
    const result = setupHook();

    expect(result.current.filterKeys).toBeDefined();
    expect(result.current.getFilterSummary).toBeDefined();
    expect(result.current.getFilterState).toBeDefined();
    expect(result.current.applyFilter).toBeDefined();
    expect(result.current.toggleFilter).toBeDefined();
    expect(result.current.showClearFilters).toBeDefined();
    expect(result.current.onClearFilters).toBeDefined();
    expect(result.current.getAvailableValuesForFilter).toBeDefined();
  });

  it('should have correct default values', () => {
    const options = getRequiredSetupForInterdependentFilters();
    const result = setupHook();

    expect(result.current.filterKeys).toEqual(['type', 'group']);
    expect(result.current.getFilterSummary('type')).toEqual('All');
    expect(result.current.getFilterSummary('group')).toEqual('All');
    expect(result.current.getFilterState('type')).toEqual(options.filters.type.options.map(option => option.value));
    expect(result.current.getFilterState('group')).toEqual(options.filters.group.options.map(option => option.value));
    expect(result.current.showClearFilters).toEqual(false);
    expect(result.current.getAvailableValuesForFilter('type')).toEqual(
      getInterdependentOptionsFromDropdownOptions(typeOptions, 'type', options.initialNodes)
    );
    expect(result.current.getAvailableValuesForFilter('group')).toEqual(
      getInterdependentOptionsFromDropdownOptions(groupOptions, 'group', options.initialNodes)
    );
  });

  it('should check all options by default', () => {
    const result = setupHook();
    const availableValues = result.current.getAvailableValuesForFilter('type');
    const allChecked = availableValues.every(value => value.checked);
    expect(allChecked).toBe(true);
  });

  it('should uncheck an option when toggleFilter is called with the same value', async () => {
    const result = setupHook();

    await act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    const availableValues = result.current.getAvailableValuesForFilter('type');
    const typeAValue = availableValues.find(value => value.value === 'Type A');
    expect(typeAValue?.checked).toBe(false);
  });

  it('should recheck an option when toggleFilter is called twice with the same value', () => {
    const result = setupHook();

    // First toggle to uncheck
    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    // Second toggle to recheck
    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    const availableValues = result.current.getAvailableValuesForFilter('type');
    const typeAValue = availableValues.find(value => value.value === 'Type A');

    expect(typeAValue?.checked).toBe(true);
  });

  it('should apply filter changes when applyFilter is called', async () => {
    const result = setupHook();

    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    const filterState = result.current.getFilterState('type');

    expect(filterState).not.toContain('Type A');
  });

  it('should update available options based on other filter selections', async () => {
    const result = setupHook();

    // First filter by type
    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    const availableGroups = result.current.getAvailableValuesForFilter('group');
    // Only groups that have Type A should be available
    const availableGroupValues = availableGroups.filter(group => !group.disabled).map(group => group.value);
    expect(availableGroupValues).toEqual(['Group A', 'Group B', 'Group C']);
  });

  it('it should match the total count of available options with the count of the applied filter(s)', () => {
    const result = setupHook();

    // uncheck all types except type A
    act(() => {
      result.current.toggleFilter('type', 'Type B');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type C');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type D');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    const availableGroups = result.current.getAvailableValuesForFilter('group');

    const availableGroupTotalCount = availableGroups.reduce((acc, cur) => {
      if (!cur.disabled) {
        acc += cur?.count ?? 0;
      }
      return acc;
    }, 0);

    const typeACount = result.current.getCountForFilterValue('type', 'Type A');

    expect(availableGroupTotalCount).toEqual(typeACount);
  });

  it('it should disable options that are not available when a filter is applied', () => {
    const result = setupHook();

    // uncheck all types except type D
    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type B');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type C');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    const availableGroups = result.current.getAvailableValuesForFilter('group');

    const availableGroupValues = availableGroups.filter(group => !group.disabled).map(group => group.value);
    expect(availableGroupValues).toEqual(['Group A', 'Group B']);

    const groupC = availableGroups.find(group => group.value === 'Group C');
    expect(groupC?.disabled).toBe(true);
    expect(groupC?.checked).toBe(false);
    expect(groupC?.count).toBe(0);
  });

  it('should select all options when all options are explicitly unselected and apply', () => {
    const result = setupHook();

    // uncheck group A
    act(() => {
      result.current.toggleFilter('group', 'Group A');
    });

    act(() => {
      result.current.applyFilter('group');
    });

    // unselect all types
    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type B');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type C');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type D');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    const availableGroups = result.current.getAvailableValuesForFilter('group');
    const availableGroupValues = availableGroups.filter(group => group.checked).map(group => group.value);
    expect(availableGroupValues).toEqual(['Group B', 'Group C']);

    const availableTypes = result.current.getAvailableValuesForFilter('type');

    const availableTypeValues = availableTypes.filter(type => type.checked).map(type => type.value);
    expect(availableTypeValues).toEqual(['Type A', 'Type B', 'Type C', 'Type D']);
  });

  it('should clear all filters when onClearFilters is called', () => {
    const result = setupHook();

    // Set up some filters , uncheck type A and group A but leave other filters checked
    act(() => {
      result.current.toggleFilter('type', 'Type A');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    act(() => {
      result.current.toggleFilter('group', 'Group A');
    });

    act(() => {
      result.current.applyFilter('group');
    });

    // Clear filters
    act(() => {
      result.current.onClearFilters();
    });

    expect(result.current.getFilterState('type')).toEqual(typeOptions.map(option => option.value));
    expect(result.current.getFilterState('group')).toEqual(groupOptions.map(option => option.value));
  });

  it('should return correct filter summary for different selection states', () => {
    const result = setupHook();

    // Test "All" case
    expect(result.current.getFilterSummary('type')).toEqual('All');

    // Test single selection, uncheck all types except type A
    act(() => {
      result.current.toggleFilter('type', 'Type B');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type C');
    });

    act(() => {
      result.current.toggleFilter('type', 'Type D');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    // Wait for the state to update
    expect(result.current.getFilterSummary('type')).toEqual('Type A');

    // Test multiple selections, 2 types checked
    act(() => {
      result.current.toggleFilter('type', 'Type B');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    expect(result.current.getFilterSummary('type')).toEqual('Type A, Type B');

    // 3 types checked
    act(() => {
      result.current.toggleFilter('type', 'Type C');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    expect(result.current.getFilterSummary('type')).toEqual('3 selected');

    // all types checked again
    act(() => {
      result.current.toggleFilter('type', 'Type D');
    });

    act(() => {
      result.current.applyFilter('type');
    });

    expect(result.current.getFilterSummary('type')).toEqual('All');
  });
});
