'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import React, { useMemo } from 'react';

// TODO: Refactor this component to be loosely coupled with Cluster Pages and have high cohesion with future Pages
const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);
  const clusterName = useSelector((state: RootState) => state.cluster.selectedClusterName);
  const allClusters = useSelector((state: RootState) => state.cluster.allClusters);

  const isClustersPage = pathSegments[0] === 'clusters';

  const isClusterListPage = useMemo(() => {
    return isClustersPage && pathSegments.length === 1;
  }, [isClustersPage, pathSegments]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!!(isClusterListPage && allClusters?.length > 0) ? (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary-950 font-normal">Clusters</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          allClusters?.length > 0 && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/clusters" className="text-text-400 hover:text-primary-950">
                  Clusters
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        )}

        {clusterName && (
          <>
            <BreadcrumbSeparator>
              <Slash className="text-text-400 w-3 h-3 rotate-[-20deg]" strokeWidth={2} />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary-950 font-normal">{clusterName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
