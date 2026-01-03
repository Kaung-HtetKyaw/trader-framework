'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { AGENT_PATHNAME } from '@/app/(root)/agents/urls';
import { useMemo } from 'react';
import { AddIconSquare } from './svgs/AddIconSquare';

const CreateAgentButton = () => {
  const pathname = usePathname();
  const router = useRouter();

  const shouldShowButton = useMemo(() => {
    return pathname === AGENT_PATHNAME;
  }, [pathname]);

  const handleClick = () => {
    router.push('/agents/create');
  };

  if (!shouldShowButton) return null;

  return (
    <Button
      onClick={handleClick}
      className="flex flex-row justify-center items-center h-9 bg-secondary-500 text-white rounded-m"
    >
      <span>Create Agent</span>
      <AddIconSquare className="w-4 h-4 ml-2 text-text-50" style={{ strokeWidth: '1' }} />
    </Button>
  );
};

export default CreateAgentButton;
