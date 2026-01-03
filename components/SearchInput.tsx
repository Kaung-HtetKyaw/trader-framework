import { cn } from '@/lib/utils';
import DebounceSearchInput from './DebouncedInput';
import { Input } from './ui/input';
import SearchLineIcon from './svgs/SearchLineIcon';

export type SearchInputProps = {
  setState: (value: string) => void;
  defaultValue: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const SearchInput = (props: SearchInputProps) => {
  const { setState, defaultValue, placeholder, className, disabled } = props;

  return (
    <DebounceSearchInput debounce={500} setState={setState} defaultValue={defaultValue}>
      {(setValue, value) => (
        <div className="relative">
          <Input
            required
            type="text"
            placeholder={placeholder || 'Search'}
            className={cn('border-text-200 w-full rounded-sm focus-visible:ring-0', className)}
            onChange={e => setValue(e.target.value)}
            value={value}
            disabled={disabled}
          />

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <SearchLineIcon className={cn('w-[14px] h-[14px] font-bold stroke-[2px]')} />
          </div>
        </div>
      )}
    </DebounceSearchInput>
  );
};

export default SearchInput;
