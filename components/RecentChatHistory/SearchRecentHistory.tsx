import SearchInput from '../SearchInput';

export type SearchRecentHistoryProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  disabled?: boolean;
};

const SearchRecentHistory = (props: SearchRecentHistoryProps) => {
  const { searchQuery, onSearchChange, disabled } = props;

  return (
    <div className="my-1">
      <SearchInput
        setState={onSearchChange}
        defaultValue={searchQuery}
        placeholder="Search your previous chats with the current cluster "
        className="h-9"
        disabled={disabled}
      />
    </div>
  );
};

export default SearchRecentHistory;
