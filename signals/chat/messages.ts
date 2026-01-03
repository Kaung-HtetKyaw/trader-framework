import { signal } from '@preact/signals-react';
import type { UIChatMessage } from '@/types/chat/types';

type ChatMessagesSignal = {
  messages: UIChatMessage[];
  chatSessionID?: string;
  loading: boolean;
  loadedFromHistory: boolean;
};

const chatMessages = signal<ChatMessagesSignal>({
  messages: [],
  chatSessionID: undefined,
  loading: false,
  loadedFromHistory: false,
});

const initChatMessages = (messages: UIChatMessage[], fromHistory = false) => {
  chatMessages.value = {
    ...chatMessages.value,
    messages,
    loadedFromHistory: fromHistory,
  };
};

const addChatMessage = (message: UIChatMessage) => {
  chatMessages.value = {
    ...chatMessages.value,
    messages: [...chatMessages.value.messages, message],
    loadedFromHistory: false, // New messages are not from history
  };
};

const updateLastChatMessage = (updates: Partial<UIChatMessage>) => {
  chatMessages.value = {
    ...chatMessages.value,
    messages: chatMessages.value.messages.map((msg, idx, arr) =>
      idx === arr.length - 1 ? { ...msg, ...updates } : msg
    ),
  };
};

const setChatMessages = (messages: UIChatMessage[]) => {
  chatMessages.value = {
    ...chatMessages.value,
    messages,
    loadedFromHistory: false,
  };
};

const filterChatMessages = (predicate: (msg: UIChatMessage) => boolean) => {
  chatMessages.value = {
    ...chatMessages.value,
    messages: chatMessages.value.messages.filter(predicate),
  };
};

const resetChatMessages = () => {
  chatMessages.value = {
    ...chatMessages.value,
    messages: [],
    chatSessionID: undefined,
    loadedFromHistory: false,
  };
};

const setChatSessionID = (sessionID: string) => {
  chatMessages.value = {
    ...chatMessages.value,
    chatSessionID: sessionID,
  };
};

const setChatMessagesLoading = (loading: boolean) => {
  chatMessages.value = {
    ...chatMessages.value,
    loading,
  };
};

export {
  chatMessages,
  initChatMessages,
  addChatMessage,
  updateLastChatMessage,
  setChatMessages,
  filterChatMessages,
  resetChatMessages,
  setChatSessionID,
  setChatMessagesLoading,
};
