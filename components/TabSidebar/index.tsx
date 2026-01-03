'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Divider from '../Divider';

type MenuItem = {
  label: string;
  getHref: () => string;
  isActive: (pathname: string) => boolean;
  enabled?: boolean;
};

export type TabSidebarMenu = {
  label?: string;
  items: MenuItem[];
};

type TabSidebarProps = {
  menus: TabSidebarMenu[];
  manageMenus: TabSidebarMenu[];
  isLoading: boolean;
};

const TabSidebar = ({ menus, manageMenus, isLoading }: TabSidebarProps) => {
  const pathname = usePathname();

  // TODO: show skeleton loader
  if (isLoading) {
    return null;
  }

  return (
    <div className=" flex flex-col justify-between relative w-64 shrink-0 py-4 border-r border-gray-200 bg-white">
      <div>
        {menus.map((item, index) => (
          <div key={item.label || index}>
            <div className={cn('flex  border-text-200 flex-col gap-2')}>
              {item.label && <p className="body-2 font-bold text-text-950 px-2 h-6  ">{item.label}</p>}
              <div className="flex flex-col gap-2">
                {item.items
                  .filter(el => el.enabled)
                  .map(menuItem => (
                    <Link
                      prefetch
                      key={menuItem.label}
                      href={menuItem.getHref()}
                      className={cn(
                        'flex body-2 transition-all duration-300 text-black relative z-0 cursor-pointer items-center  justify-between px-2 h-9 ',
                        menuItem.isActive(pathname) &&
                          'before:content-[" "] px-4 before:w-[calc(100%+0.5px)] before:z-[-1] before:bg-white before:h-full before:absolute before:inset-0 before:border-[1px]  before:rounded-sm before:rounded-r-none before:border-r-0 before:border-gray-200',
                        'hover:before:content-[" "] hover:px-4 hover:before:w-[calc(100%+0.5px)] hover:before:z-[-1] hover:before:bg-white hover:before:h-full hover:before:absolute hover:before:inset-0 hover:before:border-[1px] hover:before:rounded-sm hover:before:rounded-r-none hover:before:border-r-0 hover:before:border-gray-200',
                        'relative z-10'
                      )}
                    >
                      <p className="body-2">{menuItem.label} </p>
                      {menuItem.isActive(pathname) && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </Link>
                  ))}
              </div>
            </div>

            {index !== menus.length - 1 && (
              <div className={cn('pr-4 py-4')}>
                <Divider />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="my-4">
        {manageMenus.map((item, index) => (
          <div key={item.label || index}>
            <div className={cn('flex  border-text-200 flex-col gap-2')}>
              {item.label && <p className="body-2 font-bold text-text-950 px-2 h-6  ">{item.label}</p>}
              <div className="flex flex-col gap-2">
                {item.items
                  .filter(el => el.enabled)
                  .map(menuItem => (
                    <Link
                      prefetch
                      key={menuItem.label}
                      href={menuItem.getHref()}
                      className={cn(
                        'flex body-2 transition-all duration-300 text-black relative z-0 cursor-pointer items-center  justify-between px-2 h-9 ',
                        menuItem.isActive(pathname) &&
                          'before:content-[" "] px-4 before:w-[calc(100%+0.5px)] before:z-[-1] before:bg-white before:h-full before:absolute before:inset-0 before:border-[1px]  before:rounded-sm before:rounded-r-none before:border-r-0 before:border-gray-200',
                        'hover:before:content-[" "] hover:px-4 hover:before:w-[calc(100%+0.5px)] hover:before:z-[-1] hover:before:bg-white hover:before:h-full hover:before:absolute hover:before:inset-0 hover:before:border-[1px] hover:before:rounded-sm hover:before:rounded-r-none hover:before:border-r-0 hover:before:border-gray-200',
                        'relative z-10'
                      )}
                    >
                      <p className="body-2">{menuItem.label} </p>
                      {menuItem.isActive(pathname) && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </Link>
                  ))}
              </div>
            </div>

            {index !== manageMenus.length - 1 && (
              <div className={cn('pr-4 py-4')}>
                <Divider />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSidebar;
