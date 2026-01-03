'use client';

import { getColumns, OrganizationMemberWithIndex } from './columns';
import usePaginator from '@/lib/hooks/usePaginator';
import { createPaginationState } from '@/lib/hooks/usePaginator';
import useListSettings from '@/lib/hooks/useListSettings';
import { ListViews } from '@/types/list';
import useQueryParams from '@/lib/hooks/useQueryParams';
import OrganizationMemmberDataTable from './data-table';
import { useMemo } from 'react';
import { OrganizationMemberListParams } from '@/types';
import { useListOrganizationUserAndInvitedQuery } from '@/store/api/organizationApi';
import useGetRolesHierarchy from '@/lib/hooks/useGetRolesHierarchy';

const OrganizationMemberTable = () => {
  const { params } = useQueryParams<OrganizationMemberListParams>();

  const { settings } = useListSettings(ListViews.ORGANIZATION_MEMBER_LIST);

  const paginate = usePaginator();

  const paginationState = createPaginationState(settings.rowNumber, {
    page: parseInt(params.page as string) || 1,
    limit: settings.rowNumber,
  });

  const { pageInfo } = paginate({
    pageInfo: {
      total: 100,
      currentPage: parseInt(params.page as string) || 1,
      limit: settings.rowNumber,
    },
    paginationState,
    queryParams: {
      page: parseInt(params.page as string) || 1,
      search: params.search || '',
    },
    shouldResetPageOnSearch: true,
  });

  const { data: users = [], isFetching, isLoading } = useListOrganizationUserAndInvitedQuery();
  const { data: roles, isLoading: isLoadingRoles, isHigherRole } = useGetRolesHierarchy();

  const indexedData: OrganizationMemberWithIndex[] = useMemo(() => {
    return users.map((user, index) => ({
      ...user,
      index: index + 1,
    }));
  }, [users]);

  const roleData = useMemo(() => roles?.map(role => role.name) || [], [roles]);

  const columns = useMemo(() => getColumns(indexedData, roleData, isHigherRole), [indexedData, roleData, isHigherRole]);

  if (isLoadingRoles || !roleData) return null;

  return (
    <div className="flex flex-col gap-3">
      <OrganizationMemmberDataTable
        columns={columns}
        data={indexedData}
        isFetching={isFetching}
        listSettings={settings}
        pageInfo={pageInfo}
        fetchNextPage={() => {}}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrganizationMemberTable;
