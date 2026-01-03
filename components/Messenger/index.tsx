import KlinkWidget from './KlinkWidget';
import IntercomWidget, { INTERCOM_CUSTOM_LAUNCHER_BUTTON_ID } from './IntercomWidget';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { QueryIcon } from '../svgs/QueryIcon';

export const MessengerTypes = {
  intercom: 'intercom',
  klinkcloud: 'klinkcloud',
} as const;
export type MessengerTypeEnum = keyof typeof MessengerTypes;

export type MessengerProps = {
  type: MessengerTypeEnum;
  isCollapsed: boolean;
};

const MessengerRenderTrigger = ({ isCollapsed, onClick }: { isCollapsed: boolean; onClick?: () => void }) => (
  <Button
    id={INTERCOM_CUSTOM_LAUNCHER_BUTTON_ID}
    variant="ghost"
    className={cn(
      'sidebar-button border-sm w-full flex h-9 gap-[6px] justify-center items-center transition-all duration-300 ease-in-out',
      isCollapsed ? 'px-2' : 'px-0'
    )}
    onClick={onClick}
  >
    <QueryIcon className="w-5 h-5 text-text-50" />
  </Button>
);

const Messenger = ({ type, isCollapsed }: MessengerProps) => {
  switch (type) {
    case MessengerTypes.intercom:
      return <IntercomWidget renderTrigger={() => <MessengerRenderTrigger isCollapsed={isCollapsed} />} />;
    case MessengerTypes.klinkcloud:
      return (
        <KlinkWidget
          renderTrigger={({ onClick }) => <MessengerRenderTrigger isCollapsed={isCollapsed} onClick={onClick} />}
        />
      );
  }
};

export default Messenger;
