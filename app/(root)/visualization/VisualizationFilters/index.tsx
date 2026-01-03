'use client';
import React, { useMemo, useCallback } from 'react';
import VisualizationFilterBar from './VisualizationFilterBar';
import useQueryParams from '@/lib/hooks/useQueryParams';
import { ListObjectSelectionField, VisualizationListFilterParams } from '@/types/visualization/list';
import {
  useGetClusterByIdQuery,
  useGetClusterGroupsQuery,
  useGetClustersQuery,
  useGetK8sObjectsQuery,
  useGetNamespacesQuery,
} from '@/store/api/clusterApi';
import { useParams, useRouter } from 'next/navigation';
import { K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { getClusterVisualizationPath } from '../../clusters/urls';

export const VISUALIZATION_FILTER_BAR_ID = 'visualization-filter-bar';

export const K8S_OBJECT_FIELDS: ListObjectSelectionField[] = [
  'id',
  'namespace',
  'name',
  'kind',
  'healthStatus',
  'clusterID',
  'apiVersion',
  'spec',
  'createdAt',
];

export const K8S_OBJECT_FILTER_FIELDS: ListObjectSelectionField[] = ['id', 'name', 'namespace', 'kind'];

const Index = () => {
  const router = useRouter();
  const { params, changeParam, changeMultipleParams, resetParams } = useQueryParams<VisualizationListFilterParams>({
    listKeys: [
      'group',
      'cluster',
      'namespace',
      'clusterWideObject',
      'kind',
      'excludedClusterWideObject',
      'excludedNamespace',
      'excludedKind',
    ],
  });

  const { data: clusterGroups = [], isSuccess: groupLoaded } = useGetClusterGroupsQuery();
  const { id: selectedClusterId } = useParams<{ id: string }>();

  // handle the case when we come from a cluster info page
  const { data: clusterFromId } = useGetClusterByIdQuery(
    { id: selectedClusterId!, includeStats: false },
    {
      skip: !selectedClusterId,
    }
  );

  const computedGroupId = useMemo(() => {
    if (params.group) {
      return Array.isArray(params.group) ? params.group[0] : params.group;
    }
    return clusterFromId?.clusterGroupID;
  }, [params.group, clusterFromId]);

  // handle the case when we manually select a group
  const selectedGroupId = useMemo(() => {
    if (computedGroupId && !clusterGroups.some(g => g.id === computedGroupId)) {
      return undefined;
    }
    return computedGroupId;
  }, [computedGroupId, clusterGroups]);

  const { data: clusters = [] } = useGetClustersQuery(selectedGroupId ? { clusterGroupID: selectedGroupId } : {}, {
    skip: !selectedGroupId,
  });

  const { data: namespaces = [] } = useGetNamespacesQuery(
    { clusterID: selectedClusterId! },
    {
      skip: !selectedClusterId,
    }
  );

  const { data: objectsData } = useGetK8sObjectsQuery(
    {
      filter: {
        clusterID: selectedClusterId!,
      },
      fields: K8S_OBJECT_FILTER_FIELDS,
    },
    { skip: !selectedClusterId }
  );

  const clusterData = useMemo(() => objectsData?.items || [], [objectsData]);
  const clusterWideObjects = useMemo(() => clusterData.filter(el => !el.namespace), [clusterData]);

  const objectKindOptions = useMemo(() => {
    const kinds = clusterData.map(obj => obj.kind);
    return Array.from(new Set(kinds)).map(kind => ({
      label: kind,
      value: kind,
    }));
  }, [clusterData]);

  const groupOptions = useMemo(() => {
    return clusterGroups.map(group => ({
      label: group.name,
      value: group.id,
    }));
  }, [clusterGroups]);

  const clusterOptions = useMemo(() => {
    return clusters.map(cluster => ({
      label: cluster.name,
      value: cluster.id,
    }));
  }, [clusters]);

  const namespaceOptions = useMemo(() => {
    return namespaces.map(ns => ({
      label: ns.name,
      value: ns.name,
    }));
  }, [namespaces]);

  const clusterWideObjectOptions = useMemo(() => {
    return clusterWideObjects
      .filter(el => el.kind !== K8sObjectTypes.Namespace)
      .map(obj => ({
        label: obj.name,
        value: obj.id,
      }));
  }, [clusterWideObjects]);

  const initialData = useMemo(() => {
    if (!selectedGroupId) return [];
    return clusters
      .filter(c => c.clusterGroupID === selectedGroupId)
      .map(cluster => ({
        groupID: cluster.clusterGroupID,
        clusterID: cluster.id,
      }));
  }, [clusters, selectedGroupId]);

  const handleSelectGroup = useCallback(
    (groupId: string) => {
      changeParam('group', groupId);
    },
    [changeParam]
  );

  const handleSelectCluster = useCallback(
    (clusterId: string) => {
      router.push(getClusterVisualizationPath(clusterId));
    },
    [router]
  );

  return (
    <div id={VISUALIZATION_FILTER_BAR_ID}>
      <VisualizationFilterBar
        initialData={initialData}
        params={params}
        changeMultipleParams={changeMultipleParams}
        resetParams={resetParams}
        groupOptions={groupOptions}
        clusterOptions={clusterOptions}
        isFetching={!groupLoaded}
        onSelectGroup={handleSelectGroup}
        onSelectCluster={handleSelectCluster}
        selectedGroupId={selectedGroupId}
        selectedClusterId={selectedClusterId}
        namespaceOptions={namespaceOptions}
        clusterWideObjectOptions={clusterWideObjectOptions}
        objectKindOptions={objectKindOptions}
      />
    </div>
  );
};

export default Index;
