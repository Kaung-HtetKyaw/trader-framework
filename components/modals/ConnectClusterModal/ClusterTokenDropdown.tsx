import { DropdownOption } from '@/components/Dropdown';
import BaseDropdown from '@/components/Dropdown/BaseDropdown';
import { CheckIcon } from '@/components/svgs/CheckIcon';
import { PlusIcon } from '@/components/svgs/PlusIcon';
import { BaseButton } from '@/components/ui/base-button';
import Can from '@/lib/authorization/casl/Can';
import useFeatureFlag from '@/lib/hooks/useFeatureFlag';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useMemo } from 'react';

export type ClusterTokenDropdownOption = DropdownOption & {
  name: string;
};

export type ClusterTokenDropdownProps = {
  options: ClusterTokenDropdownOption[];
  selectedKey: string;
  onChange: (key: ClusterTokenDropdownOption) => void;
  onGenerateNewToken: () => void;
  error?: string;
};

const ClusterTokenDropdown = (props: ClusterTokenDropdownProps) => {
  const { options, onChange: onChangeProp, error, onGenerateNewToken, selectedKey } = props;
  const { isFeatureEnabled } = useFeatureFlag();

  const selectedItem = useMemo(() => {
    return options.find(option => option.value === selectedKey);
  }, [options, selectedKey]);

  const onChange = (selectedOption: ClusterTokenDropdownOption) => {
    onChangeProp(selectedOption);
  };

  return (
    <BaseDropdown
      options={options}
      error={error}
      placeholder={'Select a key'}
      notFoundMessage={'No key found.'}
      searchPlaceholder={'Search key'}
      enableSearch={false}
      chevronIcon={<ChevronDown className="ml-2 h-4 w-4 shrink-0" />}
      renderTriggerContent={() =>
        selectedItem ? (
          <div className="flex flex-row items-center gap-2">
            <p className="max-h-[20px] py-[2px] flex items-center justify-center px-2 bg-secondary-50 rounded-sm">
              <span>{selectedItem.name}</span>
            </p>
            <span className="text-text-950">{selectedItem.label}</span>
          </div>
        ) : (
          <span className="text-text-500">Select a key</span>
        )
      }
      renderAddNewItem={() =>
        isFeatureEnabled('settings.createClusterToken') && (
          <Can do="create" on="cluster_tokens">
            <BaseButton
              onClick={onGenerateNewToken}
              variant="text"
              className="flex border-t-[0.5px] border-t-text-100 rounded-none flex-row gap-2 text-text-950 hover:text-text-950 h-[2.375rem] justify-start items-center px-3"
            >
              <PlusIcon className="!w-5 !h-5" />
              <span className="body-2 font-bold">Generate New Key</span>
            </BaseButton>
          </Can>
        )
      }
      renderOptionItem={renderOptionItemProps => (
        <div
          onClick={() => {
            renderOptionItemProps.closeDropdown();
            onChange(renderOptionItemProps.option);
            onChange(renderOptionItemProps.option);
          }}
          className="flex flex-row items-center gap-2"
        >
          <p className="text-[10px] max-h-[20px] py-[2px] flex items-center justify-center px-2 bg-secondary-50 rounded-sm">
            <span className=" whitespace-nowrap ">{renderOptionItemProps.option.name}</span>
          </p>
          <span className="flex items-center justify-between  w-full gap-2 py-[6px]">
            <span>{renderOptionItemProps.option.label}</span>
            <CheckIcon
              className={cn(
                'ml-auto w-4 h-4 text-success-600 transition-opacity',
                selectedItem?.value === renderOptionItemProps.option.value ? 'opacity-100' : 'opacity-0'
              )}
            />
          </span>
        </div>
      )}
    />
  );
};

export default ClusterTokenDropdown;
