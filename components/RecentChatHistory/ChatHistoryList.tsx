import { ChatSession } from '@/types/chat/types';
import ChatHistoryItemCard from './ChatHistoryItemCard';

export type ChatHistoryListProps = {
  chatSessions: ChatSession[];
  onClick: (chatSession: ChatSession) => void;
};

const ChatHistoryList = (props: ChatHistoryListProps) => {
  const { chatSessions, onClick } = props;

  return (
    <div className="flex flex-col gap-2">
      {chatSessions.map(el => (
        <ChatHistoryItemCard onClick={() => onClick(el)} key={el.id} chatSession={el} />
      ))}
    </div>
  );
};

export default ChatHistoryList;
