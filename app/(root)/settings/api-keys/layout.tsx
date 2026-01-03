import Can from '@/lib/authorization/casl/Can';

const SettingsApiKeysLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Can do="list" on="cluster_tokens">
      {children}
    </Can>
  );
};

export default SettingsApiKeysLayout;
