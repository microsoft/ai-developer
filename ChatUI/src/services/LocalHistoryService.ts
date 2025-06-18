import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { ChatMode, IHistoryService } from './IHistoryService';

/**
 * Implementation of IHistoryService that uses browser localStorage
 * with separate storage for standard and multi-agent chat histories
 */
export class LocalHistoryService implements IHistoryService {
  private readonly STANDARD_HISTORY_KEY = 'sparkydog-standard-histories';
  private readonly MULTIAGENT_HISTORY_KEY = 'sparkydog-multiagent-histories';
  private readonly MESSAGES_KEY_PREFIX = 'sparkydog-messages-';
  
  constructor() {
    // Ensure localStorage is available (will only run on client side)
    this.ensureLocalStorage();
  }
  
  /**
   * Gets chat histories for the specified mode
   */
  async getChatHistories(mode: ChatMode): Promise<ChatHistory[]> {
    const storageKey = this.getHistoryKey(mode);
    
    try {
      const storedData = localStorage.getItem(storageKey);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error(`Error retrieving chat histories for ${mode} mode:`, error);
      return [];
    }
  }
  
  /**
   * Gets messages for a specific chat
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    try {
      const messagesKey = `${this.MESSAGES_KEY_PREFIX}${chatId}`;
      const storedData = localStorage.getItem(messagesKey);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error(`Error retrieving messages for chat ${chatId}:`, error);
      return [];
    }
  }
  
  /**
   * Creates a new chat for the specified mode
   */
  async createChat(mode: ChatMode, title?: string): Promise<ChatHistory> {
    try {
      const now = new Date();
      const chatId = uuidv4();
      
      // Get existing histories
      const histories = await this.getChatHistories(mode);
      
      // Create new chat history
      const newChat: ChatHistory = {
        id: chatId,
        title: title || `Chat ${histories.length + 1}`,
        lastUpdated: now,
        messageCount: 0,
        mode: mode
      };
      
      // Add to histories and save
      histories.unshift(newChat); // Add to beginning (most recent)
      this.saveHistories(mode, histories);
      
      // Initialize empty messages
      localStorage.setItem(`${this.MESSAGES_KEY_PREFIX}${chatId}`, JSON.stringify([]));
      
      return newChat;
    } catch (error) {
      console.error(`Error creating chat for ${mode} mode:`, error);
      throw error;
    }
  }
  
  /**
   * Updates a chat with new messages
   */
  async updateChat(chatId: string, messages: Message[]): Promise<ChatHistory> {
    try {
      // Find the chat mode by searching in both collections
      let mode: ChatMode = 'standard';
      let histories = await this.getChatHistories(mode);
      let chatIndex = histories.findIndex(chat => chat.id === chatId);
      
      // If not found in standard, check multi-agent
      if (chatIndex === -1) {
        mode = 'multiAgent';
        histories = await this.getChatHistories(mode);
        chatIndex = histories.findIndex(chat => chat.id === chatId);
        
        if (chatIndex === -1) {
          throw new Error(`Chat with ID ${chatId} not found in any mode`);
        }
      }
      
      // Save the messages
      localStorage.setItem(`${this.MESSAGES_KEY_PREFIX}${chatId}`, JSON.stringify(messages));
      
      // Update the chat history
      const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
      
      histories[chatIndex] = {
        ...histories[chatIndex],
        lastMessage: this.truncateMessage(lastMessage, 50),
        lastUpdated: new Date(),
        messageCount: messages.length,
      };
      
      // Sort and save
      this.sortHistories(histories);
      this.saveHistories(mode, histories);
      
      return histories[chatIndex];
    } catch (error) {
      console.error(`Error updating chat ${chatId}:`, error);
      throw error;
    }
  }
  
  /**
   * Deletes a chat
   */
  async deleteChat(chatId: string, mode: ChatMode): Promise<boolean> {
    try {
      // Get histories for the specified mode
      const histories = await this.getChatHistories(mode);
      const initialLength = histories.length;
      
      // Filter out the chat to delete
      const updatedHistories = histories.filter(chat => chat.id !== chatId);
      
      // Save the updated histories
      this.saveHistories(mode, updatedHistories);
      
      // Remove the messages
      localStorage.removeItem(`${this.MESSAGES_KEY_PREFIX}${chatId}`);
      
      return updatedHistories.length !== initialLength;
    } catch (error) {
      console.error(`Error deleting chat ${chatId} from ${mode} mode:`, error);
      return false;
    }
  }
  
  /**
   * Gets the appropriate storage key for the specified mode
   */
  private getHistoryKey(mode: ChatMode): string {
    return mode === 'standard' ? this.STANDARD_HISTORY_KEY : this.MULTIAGENT_HISTORY_KEY;
  }
  
  /**
   * Saves chat histories to localStorage for the specified mode
   */
  private saveHistories(mode: ChatMode, histories: ChatHistory[]): void {
    const storageKey = this.getHistoryKey(mode);
    localStorage.setItem(storageKey, JSON.stringify(histories));
  }
  
  /**
   * Sorts histories by last updated (most recent first)
   */
  private sortHistories(histories: ChatHistory[]): void {
    histories.sort((a, b) => {
      const dateA = a.lastUpdated instanceof Date 
        ? a.lastUpdated 
        : new Date(a.lastUpdated);
        
      const dateB = b.lastUpdated instanceof Date 
        ? b.lastUpdated 
        : new Date(b.lastUpdated);
        
      return dateB.getTime() - dateA.getTime();
    });
  }
  
  /**
   * Truncates a message to the specified length with ellipsis
   */
  private truncateMessage(message: string, maxLength: number): string {
    if (message.length <= maxLength) {
      return message;
    }
    
    return message.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Ensures localStorage is available
   * This will throw an error if localStorage is not available (e.g., in SSR)
   */
  private ensureLocalStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('LocalHistoryService requires localStorage to be available');
    }
  }
} 