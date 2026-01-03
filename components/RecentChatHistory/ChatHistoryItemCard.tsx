import { useMemo } from 'react';
import ClockLineIcon from '../svgs/ClockLineIcon';
import { format } from 'date-fns';
import CustomEllipsis from '../CustomEllipsis';
import { ChatSession } from '@/types/chat/types';

export type ChatHistoryItemCardProps = {
  chatSession: ChatSession;
  onClick: () => void;
};

const ChatHistoryItemCard = (props: ChatHistoryItemCardProps) => {
  const { chatSession, onClick } = props;
  const formattedTime = useMemo(() => format(chatSession.createdAt, 'MMM d, HH:mm'), [chatSession.createdAt]);

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 p-4 cursor-pointer border border-text-200 rounded-[12px] hover:bg-secondary-50 "
    >
      <CustomEllipsis className="text-[14px] font-[500] text-text-950" text={chatSession.title} maxLength={30} />

      <div className="flex gap-1 items-center">
        <ClockLineIcon />
        <p className="text-text-600 text-[12px]">{formattedTime}</p>
      </div>
    </div>
  );
};

export default ChatHistoryItemCard;
