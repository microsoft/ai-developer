import React, { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Mock implementation of ServiceProvider for Storybook

// Create mock service interfaces
const mockChatService = {
  sendMessage: async (messages, agentMode) => {
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

const mockHistoryService = {
  getChatHistories: async (mode) => {
    return [];
  },
  getChatMessages: async (chatId) => {
    return [];
  },
  createChat: async (mode, title) => {
    return {
      id: 'new-chat-id',
      title: title || 'New Chat',
      lastMessage: '',
      lastUpdated: new Date(),
      messageCount: 0,
      mode
    };
  },
  updateChat: async (chatId, messages) => {
    return {
      id: chatId,
      title: 'Updated Chat',
      lastMessage: messages.length > 0 ? messages[messages.length - 1].content : '',
      lastUpdated: new Date(),
      messageCount: messages.length,
      mode: 'standard'
    };
  },
  deleteChat: async (chatId, mode) => {
    return true;
  }
};

// Create mock ServiceFactory
export const ServiceFactory = {
  createChatService: () => mockChatService,
  createHistoryService: () => mockHistoryService
};

// Create context
const ServiceContext = createContext({
  chatService: mockChatService,
  historyService: mockHistoryService
});

// Create the useServices hook
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

// Create ServiceProvider component
export const ServiceProvider = ({ children }) => {
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

// Export types that might be imported
export const initialChatService = mockChatService;
export const initialHistoryService = mockHistoryService;

// Mock classes that might be referenced
export class MockHistoryService {
  // Empty mock class
}

// Export any additional items needed
export default ServiceProvider; 