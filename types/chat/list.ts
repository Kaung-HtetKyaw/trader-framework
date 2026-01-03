import { ChatMessage } from '.';
import { ListRequest } from '../list';
import { ChatSession } from './types';

export type ChatSessionListRequest = ListRequest<ChatSession>;

export type ChatMessageListRequest = ListRequest<ChatMessage, { chatSessionID: string }>;
