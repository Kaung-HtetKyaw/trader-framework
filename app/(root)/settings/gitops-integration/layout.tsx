import Can from '@/lib/authorization/casl/Can';

const GitOpsIntegrationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Can do="list" on="personal_access_tokens">
      <Can do="list" on="repositories">
        {children}
      </Can>
    </Can>
  );
};

export default GitOpsIntegrationLayout;
