import { IChatService } from './IChatService';
import { IHistoryService } from './IHistoryService';
import { MockChatService } from './MockChatService';
import { MockHistoryService } from './MockHistoryService';
import { LocalHistoryService } from './LocalHistoryService';
import { ApiChatService } from './ApiChatService';
import { ApiHistoryService } from './ApiHistoryService';

/**
 * Factory class for creating service instances based on environment variables
 */
export class ServiceFactory {
  /**
   * Creates a chat service instance based on environment variables
   * @returns Instance of IChatService
   */
  static createChatService(): IChatService {
    // Get mode from environment variables
    const mode = this.getStandardChatMode();
    
    if (mode === 'api') {
      return new ApiChatService();
    }
    
    // Default to mock service
    return new MockChatService();
  }
  
  /**
   * Creates a multi-agent chat service instance based on environment variables
   * Currently uses the same MockChatService but could be extended in the future
   * @returns Instance of IChatService
   */
  static createMultiAgentChatService(): IChatService {
    // Get mode from environment variables
    const mode = this.getMultiAgentChatMode();
    
    if (mode === 'api') {
      return new ApiChatService();
    }
    
    // Default to mock service
    return new MockChatService();
  }
  
  /**
   * Creates a history service instance based on environment variables
   * Ensures LocalHistoryService is only instantiated on the client side.
   * @returns Instance of IHistoryService
   */
  static createHistoryService(): IHistoryService {
    // Get mode from environment variables
    const mode = this.getHistoryMode();
    
    if (mode === 'local') {
      // Check if running on the client side before instantiating LocalHistoryService
      if (typeof window !== 'undefined') {
        // Use browser storage implementation
        return new LocalHistoryService();
      } else {
        // Running on the server: Provide a safe fallback (MockHistoryService without sample data)
        // This prevents errors during Server-Side Rendering (SSR)
        console.warn('Local history mode selected during SSR, using non-persistent mock service temporarily.');
        return new MockHistoryService(false); 
      }
    } else if (mode === 'api') {
      return new ApiHistoryService();
    }
    
    // Default fallback: mock service with sample data (e.g., if mode is invalid)
    console.warn(`Invalid NEXT_PUBLIC_CHAT_HISTORY_MODE: ${process.env.NEXT_PUBLIC_CHAT_HISTORY_MODE}. Falling back to mock service.`);
    return new MockHistoryService(true);
  }
  
  /**
   * Get the standard chat API mode from environment variables
   * @returns 'mock' or 'api'
   */
  private static getStandardChatMode(): 'mock' | 'api' {
    const mode = process.env.NEXT_PUBLIC_STANDARD_CHAT_API_MODE;
    return mode === 'api' ? 'api' : 'mock';
  }
  
  /**
   * Get the multi-agent chat API mode from environment variables
   * @returns 'mock' or 'api'
   */
  private static getMultiAgentChatMode(): 'mock' | 'api' {
    const mode = process.env.NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE;
    return mode === 'api' ? 'api' : 'mock';
  }
  
  /**
   * Get the history mode from environment variables
   * @returns 'local' or 'api'
   */
  private static getHistoryMode(): 'local' | 'api' {
    const mode = process.env.NEXT_PUBLIC_CHAT_HISTORY_MODE;
    return mode === 'api' ? 'api' : 'local';
  }
} 