import { Message } from '@/components/molecules/ChatMessagePanel';
import { AgentMode } from '@/components/molecules/AgentToggle';

export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

/**
 * Interface defining methods for chat interactions
 */
export interface IChatService {
  /**
   * Sends a conversation history to the appropriate chat endpoint based on agent mode
   * 
   * @param messages The complete conversation history
   * @param agentMode The current agent mode (standard or multi-agent)
   * @returns Promise resolving to the assistant response message(s)
   *          Returns a single Message for standard mode, or an array of Messages for multi-agent mode.
   */
  sendMessage(messages: ChatMessage[], agentMode: AgentMode): Promise<Message | Message[]>;
  
  /**
   * Aborts any ongoing request
   */
  abortRequest(): void;
} 