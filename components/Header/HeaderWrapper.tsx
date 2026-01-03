import Can from '@/lib/authorization/casl/Can';
import useFeatureFlag from '@/lib/hooks/useFeatureFlag';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import ConnectClusterModal from '../modals/ConnectClusterModal';
import { Button } from '../ui/button';
import { NotificationIcon } from '../svgs/NotificationIcon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { EditProfileIcon } from '../svgs/EditProfileIcon';
import { SignoutIcon } from '../svgs/SignoutIcon';
import { PROFILE_SETTINGS_PATH } from '@/app/(root)/settings/urls';
import { logoutAndRedirect } from '@/lib/authClient';

export type HeaderWrapper = {
  children: React.ReactNode;
  className?: string;
  customActionButton?: React.ReactNode;
};

export const HEADER_HEIGHT = 64;

const HeaderWrapper = (props: HeaderWrapper) => {
  const { children, customActionButton } = props;
  const { isFeatureEnabled } = useFeatureFlag();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const onClickProfile = useCallback(() => router.push(PROFILE_SETTINGS_PATH), [router]);

  return (
    <header
      style={{ height: `${HEADER_HEIGHT}px` }}
      className={cn('flex flex-row justify-between bg-white border-b-[0.5px] border-b-text-200 shadow-sm px-4')}
    >
      {children}
      <section className="flex items-center gap-8">
        {customActionButton ? (
          customActionButton
        ) : (
          <Can do="all" on="clusters">
            <ConnectClusterModal />
          </Can>
        )}

        {isFeatureEnabled('notifications') && (
          <Button variant="ghost" size="icon">
            <NotificationIcon className="w-6 h-6 text-text-950" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="header-profile-trigger">
            <Avatar className="header-profile hover:bg-text-100 transition-colors duration-200">
              {imageLoading && !imageError && (
                <Skeleton className="absolute w-7 h-7 rounded-full bg-text-50 animate-pulse" />
              )}
              <AvatarImage
                className="w-7 h-7 "
                src="/icons/default_avatar.svg"
                alt="User Avatar"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="dropdown-menu">
            <DropdownMenuItem className="dropdown-item cursor-pointer px-3" onClick={onClickProfile}>
              <EditProfileIcon className="w-6 h-6" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="dropdown-item px-3 text-error-500 hover:bg-error-50 hover:text-error-500 cursor-pointer"
              onClick={logoutAndRedirect}
            >
              <SignoutIcon className="w-6 h-6" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  );
};

export default HeaderWrapper;
