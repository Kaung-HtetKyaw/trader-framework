'use client';
import Container from '@/components/Container';
import AgentFormTabs from '@/components/AgentFormTabs';
import Can from '@/lib/authorization/casl/Can';
import React from 'react';

const Page = () => {
  return (
    <Can do="create" on="agents">
      <Container className="m-3 h-full">
        <AgentFormTabs agent={null} />
      </Container>
    </Can>
  );
};

export default Page;
