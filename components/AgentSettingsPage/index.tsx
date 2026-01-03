'use client';
import React from 'react';
import BuiltInAgentsSection from './BuiltInAgentsSection';
import CustomAgentsSection from './CustomAgentsSection';
import { useAgents } from '@/lib/hooks/useAgents';

const AgentSettingsPage = () => {
  const { buildInAgents, customAgents } = useAgents();

  return (
    <div className="flex flex-col h-full bg-background-50 overflow-auto">
      <BuiltInAgentsSection
        agents={buildInAgents.data}
        isLoading={buildInAgents.isLoading}
        error={buildInAgents.error}
      />
      <CustomAgentsSection agents={customAgents.data} isLoading={customAgents.isLoading} error={customAgents.error} />
    </div>
  );
};

export default AgentSettingsPage;
