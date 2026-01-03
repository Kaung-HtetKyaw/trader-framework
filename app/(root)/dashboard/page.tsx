'use client';
import React from 'react';
import ClusterGroupList from './ClusterGroupList';
import useFeatureFlag from '@/lib/hooks/useFeatureFlag';

const Dashboard = () => {
  const { isFeatureEnabled } = useFeatureFlag();

  if (!isFeatureEnabled('dashboard')) return null;

  return <ClusterGroupList />;
};

export default Dashboard;
