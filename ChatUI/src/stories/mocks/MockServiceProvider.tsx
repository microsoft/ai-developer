import React, { createContext, useContext, ReactNode } from 'react';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { IChatService, ChatMessage } from '@/services/IChatService';
import { IHistoryService, ChatMode } from '@/services/IHistoryService';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { v4 as uuidv4 } from 'uuid';

// Mock services for use in Storybook
const mockChatService: IChatService = {
  sendMessage: async (messages: ChatMessage[], agentMode: AgentMode) => {
    // Return a single message for standard mode
    if (agentMode === 'standard') {
      return {
        id: uuidv4(),
        role: 'assistant',
        content: 'This is a mock response from the chat service.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    
    // Return multiple messages for multiAgent mode
    return [
      {
        id: uuidv4(),
        role: 'assistant',
        content: 'This is a response from Agent 1.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: { agentName: 'Research Agent' }
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: 'This is a response from Agent 2.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: { agentName: 'Code Agent' }
      }
    ];
  },
  abortRequest: () => {
    console.log('Request aborted');
  }
};

const mockHistoryService: IHistoryService = {
  getChatHistories: async (mode: ChatMode) => {
    return [];
  },
  getChatMessages: async (chatId: string) => {
    return [];
  },
  createChat: async (mode: ChatMode, title?: string) => {
    return {
      id: 'new-chat-id',
      title: title || 'New Chat',
      lastMessage: '',
      lastUpdated: new Date(),
      messageCount: 0,
      mode
    };
  },
  updateChat: async (chatId: string, messages: Message[]) => {
    // Return a mock updated chat history
    return {
      id: chatId,
      title: 'Updated Chat',
      lastMessage: messages.length > 0 ? messages[messages.length - 1].content : '',
      lastUpdated: new Date(),
      messageCount: messages.length,
      mode: 'standard' as ChatMode
    };
  },
  deleteChat: async (chatId: string, mode: ChatMode) => {
    // Return success
    return true;
  }
};

// Create a mock that uses the same name as the real ServiceContext
// This tricks the useServices hook into finding our mock implementation
const ServiceContext = createContext<{
  chatService: IChatService;
  historyService: IHistoryService;
}>({
  chatService: mockChatService,
  historyService: mockHistoryService
});

// This hook name must match the real one
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

// Create a mock service provider component
export const MockServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ServiceContext.Provider
      value={{
        chatService: mockChatService,
        historyService: mockHistoryService
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}; 