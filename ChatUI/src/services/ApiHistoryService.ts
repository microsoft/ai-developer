import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { ChatMode, IHistoryService } from './IHistoryService';

// Define interfaces for API responses
interface ChatHistoryApiResponse {
  id: string;
  title: string;
  lastMessage?: string;
  lastUpdated: string; // Date as string from API
  messageCount: number;
  mode: ChatMode;
}

interface ChatMessageApiResponse {
  id?: string;
  content: string;
  role: string;
  timestamp: string;
  agentIdentifier?: string;
}

/**
 * Implementation of IHistoryService that makes actual API calls
 * Uses environment variables for API endpoints
 */
export class ApiHistoryService implements IHistoryService {
  private historyApiUrl: string;
  
  constructor() {
    // Get API endpoint from environment variables
    this.historyApiUrl = process.env.NEXT_PUBLIC_CHAT_HISTORY_API_URL || 'https://api.example.com/chat-history';
  }

  /**
   * Gets the list of chat histories for a specific mode
   * 
   * @param mode The chat mode ('standard' or 'multiAgent')
   * @returns Promise resolving to a list of chat history entries
   */
  async getChatHistories(mode: ChatMode): Promise<ChatHistory[]> {
    try {
      const response = await fetch(`${this.historyApiUrl}?mode=${mode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get chat histories: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the API response to the expected ChatHistory format
      return data.map((item: ChatHistoryApiResponse) => ({
        id: item.id,
        title: item.title,
        lastMessage: item.lastMessage || '',
        lastUpdated: new Date(item.lastUpdated),
        messageCount: item.messageCount,
        mode: mode
      }));
    } catch (error) {
      console.error('Error fetching chat histories:', error);
      throw new Error('Failed to retrieve chat histories');
    }
  }
  
  /**
   * Gets the messages for a specific chat
   * 
   * @param chatId The ID of the chat to retrieve messages for
   * @returns Promise resolving to a list of chat messages
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.historyApiUrl}/${chatId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get chat messages: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the API response to the expected Message format
      return data.map((item: ChatMessageApiResponse) => ({
        id: item.id || uuidv4(),
        content: item.content,
        role: item.role,
        timestamp: item.timestamp,
        agentIdentifier: item.agentIdentifier
      }));
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw new Error('Failed to retrieve chat messages');
    }
  }
  
  /**
   * Creates a new chat for the specified mode
   * 
   * @param mode The chat mode ('standard' or 'multiAgent')
   * @param title Optional title for the chat
   * @returns Promise resolving to the newly created chat history
   */
  async createChat(mode: ChatMode, title?: string): Promise<ChatHistory> {
    try {
      const response = await fetch(this.historyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode,
          title: title || 'New Chat'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the API response to the expected ChatHistory format
      return {
        id: data.id,
        title: data.title,
        lastMessage: data.lastMessage || '',
        lastUpdated: new Date(data.lastUpdated),
        messageCount: data.messageCount || 0,
        mode: mode
      };
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error('Failed to create new chat');
    }
  }
  
  /**
   * Updates a chat with new messages
   * 
   * @param chatId The ID of the chat to update
   * @param messages The messages to add or update
   * @returns Promise resolving to the updated chat history
   */
  async updateChat(chatId: string, messages: Message[]): Promise<ChatHistory> {
    try {
      const response = await fetch(`${this.historyApiUrl}/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update chat: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map the API response to the expected ChatHistory format
      return {
        id: data.id,
        title: data.title,
        lastMessage: data.lastMessage,
        lastUpdated: new Date(data.lastUpdated),
        messageCount: data.messageCount,
        mode: data.mode
      };
    } catch (error) {
      console.error('Error updating chat:', error);
      throw new Error('Failed to update chat');
    }
  }
  
  /**
   * Deletes a chat history
   * 
   * @param chatId The ID of the chat to delete
   * @param mode The chat mode ('standard' or 'multiAgent')
   * @returns Promise resolving to true if successful
   */
  async deleteChat(chatId: string, mode: ChatMode): Promise<boolean> {
    try {
      const response = await fetch(`${this.historyApiUrl}/${chatId}?mode=${mode}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw new Error('Failed to delete chat');
    }
  }
} 