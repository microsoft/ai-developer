import { Message } from '@/components/molecules/ChatMessagePanel';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';

/**
 * Chat mode type defining the available chat types
 */
export type ChatMode = 'standard' | 'multiAgent';

/**
 * Interface defining methods for chat history management
 */
export interface IHistoryService {
  /**
   * Gets the list of chat histories for a specific mode
   * 
   * @param mode The chat mode ('standard' or 'multiAgent')
   * @returns Promise resolving to a list of chat history entries
   */
  getChatHistories(mode: ChatMode): Promise<ChatHistory[]>;
  
  /**
   * Gets the messages for a specific chat
   * 
   * @param chatId The ID of the chat to retrieve messages for
   * @returns Promise resolving to a list of chat messages
   */
  getChatMessages(chatId: string): Promise<Message[]>;
  
  /**
   * Creates a new chat for the specified mode
   * 
   * @param mode The chat mode ('standard' or 'multiAgent')
   * @param title Optional title for the chat
   * @returns Promise resolving to the newly created chat history
   */
  createChat(mode: ChatMode, title?: string): Promise<ChatHistory>;
  
  /**
   * Updates a chat with new messages
   * 
   * @param chatId The ID of the chat to update
   * @param messages The messages to add or update
   * @returns Promise resolving to the updated chat history
   */
  updateChat(chatId: string, messages: Message[]): Promise<ChatHistory>;
  
  /**
   * Deletes a chat history
   * 
   * @param chatId The ID of the chat to delete
   * @param mode The chat mode ('standard' or 'multiAgent')
   * @returns Promise resolving to true if successful
   */
  deleteChat(chatId: string, mode: ChatMode): Promise<boolean>;
} 