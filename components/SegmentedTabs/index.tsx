import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import HorizontalScrollContainer from '../HorizontalScrollContainer';

export type SegmentedMenuItem = {
  label: string;
  isActive: (pathname: string) => boolean;
  onClick?: (pathname: string) => void;
  getHref?: () => string;
  enabled?: boolean;
  children?: SegmentedMenuItem[];
};

export type SegmentedTabsProps = {
  menus: SegmentedMenuItem[];
  children: ReactNode;
  minWidth?: number;
};

const SegmentedTabs = (props: SegmentedTabsProps) => {
  const { menus, children, minWidth } = props;
  const pathname = usePathname();

  const activeMenu = useMemo(() => {
    return menus.find(item => item.isActive(pathname));
  }, [menus, pathname]);

  return (
    <div className="bg-white rounded-xl py-3 w-full">
      <HorizontalScrollContainer className="overflow-y-hidden flex flex-col gap-4">
        <div>
          <div
            style={{ minWidth: minWidth || '100%' }}
            className="flex flex-row px-4 border-b-[1px] border-text-200 w-full gap-1"
          >
            {menus.map((item, index) => (
              <div key={item.label || index}>
                {item.getHref ? (
                  <Link
                    prefetch
                    key={item.label}
                    href={item.getHref()}
                    className={cn(
                      'relative block py-3 px-4 border-[0px] border-b-[0px] group border-text-200 rounded-lg rounded-bl-[0px] rounded-br-[0px] hover:bg-text-50 hover:text-text-700 transition-colors duration-200 ',
                      item.isActive(pathname) && 'border-[1px]'
                    )}
                  >
                    <p
                      className={cn(
                        'body-1 text-text-500 text-nowrap  capitalize',
                        item.isActive(pathname) && 'text-secondary-500 font-bold'
                      )}
                    >
                      {item.label}{' '}
                    </p>
                    <div
                      className={cn(
                        'absolute block bottom-[-2px] left-0 w-full h-[10px] bg-white group-hover:bg-text-50 hover:bg-text-50 transition-colors duration-200',
                        !item.isActive(pathname) && 'hidden'
                      )}
                    ></div>
                  </Link>
                ) : (
                  <div
                    onClick={() => item.onClick?.(pathname)}
                    className={cn(
                      ' cursor-pointer relative group block py-3 px-4 border-[0px] border-b-[0px] border-text-200 rounded-lg rounded-bl-[0px] rounded-br-[0px] hover:bg-text-50 hover:text-text-700 transition-colors duration-200 ',
                      item.isActive(pathname) && 'border-[1px]'
                    )}
                  >
                    <p
                      className={cn(
                        'body-1 text-text-500 text-nowrap capitalize',
                        item.isActive(pathname) && 'text-secondary-500 font-bold'
                      )}
                    >
                      {item.label}{' '}
                    </p>
                    <div
                      className={cn(
                        'absolute block bottom-[-2px] left-0 w-full h-[10px] bg-white group-hover:bg-text-50 hover:bg-text-50 transition-colors duration-200',
                        !item.isActive(pathname) && 'hidden'
                      )}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {!!activeMenu?.children?.length && (
          <div className="flex flex-row px-4">
            {activeMenu?.children?.map(el =>
              el.getHref ? (
                <Link key={el.label} href={el.getHref()}>
                  <div
                    className={cn(
                      "relative cursor-pointer h-9 px-4 flex items-center justify-center rounded-lg rounded-bl-none rounded-br-none transition-colors duration-200 hover:bg-text-50 before:hidden before:absolute before:bottom-0 before:left-0 before:content-['']  before:h-[2px] before:w-full before:bg-secondary-500 before:rounded-br-[0px] before:border-r-0 before:border-b-[2px] before:border-transparent",
                      el.isActive(pathname) && 'before:bg-secondary-500 before:block'
                    )}
                  >
                    <span
                      className={cn(
                        ' cursor-pointer block body-2 text-text-700 text-nowrap',
                        el.isActive(pathname) && 'text-secondary-500 font-bold'
                      )}
                    >
                      {el.label}
                    </span>
                  </div>
                </Link>
              ) : (
                <div
                  key={el.label}
                  className={cn(
                    "relative cursor-pointer h-9 px-4 flex items-center justify-center rounded-lg rounded-bl-none rounded-br-none transition-colors duration-200 hover:bg-text-50 before:hidden before:absolute before:bottom-0 before:left-0 before:content-['']  before:h-[2px] before:w-full before:bg-secondary-500 before:rounded-br-[0px] before:border-r-0 before:border-b-[2px] before:border-transparent",
                    el.isActive(pathname) && 'before:bg-secondary-500 before:block'
                  )}
                >
                  <span
                    className={cn(
                      ' cursor-pointer block body-2 text-text-700 text-nowrap',
                      el.isActive(pathname) && 'text-secondary-500 font-bold'
                    )}
                  >
                    {el.label}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </HorizontalScrollContainer>

      {children}
    </div>
  );
};

export default SegmentedTabs;
