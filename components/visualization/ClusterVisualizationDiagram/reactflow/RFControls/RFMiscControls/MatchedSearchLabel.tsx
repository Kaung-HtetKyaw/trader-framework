export type MatchedSearchLabelProps = {
  label: string;
  searchTerm: string;
};

const MatchedSearchLabel: React.FC<MatchedSearchLabelProps> = ({ label, searchTerm }) => {
  if (!searchTerm) {
    return <span>{label}</span>;
  }

  const lowerLabel = label.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();
  const matchIndex = lowerLabel.indexOf(lowerSearchTerm);

  if (matchIndex === -1) {
    return <span>{label}</span>;
  }

  const beforeMatch = label.substring(0, matchIndex);
  const match = label.substring(matchIndex, matchIndex + searchTerm.length);
  const afterMatch = label.substring(matchIndex + searchTerm.length);

  return (
    <>
      {beforeMatch && <span>{beforeMatch}</span>}
      <span className="text-secondary-500">{match}</span>
      {afterMatch && <span>{afterMatch}</span>}
    </>
  );
};

export default MatchedSearchLabel;
