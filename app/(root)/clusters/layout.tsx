import Can from '@/lib/authorization/casl/Can';
import React, { ReactNode } from 'react';

const layout = async ({ children }: { children: ReactNode }) => {
  return (
    <Can do="list" on="clusters">
      <div className=" w-full h-full">{children}</div>
    </Can>
  );
};

export default layout;
