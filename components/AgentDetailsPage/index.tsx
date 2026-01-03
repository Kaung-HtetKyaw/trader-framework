'use client';

import React from 'react';
import CustomAgentDetailsPage from './CustomAgentDetailsPage';
import { AgentTypeEnum, AgentTypes } from '@/types/agent';
import BuiltInAgentDetailsPage from './BuiltInAgentDetailsPage';

export type AgentDetailsPageProps = {
  type: AgentTypeEnum;
};

const AgentDetailsPage = ({ type }: AgentDetailsPageProps) => {
  switch (type) {
    case AgentTypes.builtIn:
      return <BuiltInAgentDetailsPage />;
    case AgentTypes.custom:
      return <CustomAgentDetailsPage />;
    default:
      return null;
  }
};

export default AgentDetailsPage;
