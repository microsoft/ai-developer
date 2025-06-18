import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { ChatMode, IHistoryService } from './IHistoryService';

export class MockHistoryService implements IHistoryService {
  private standardChatHistories: ChatHistory[] = [];
  private multiAgentChatHistories: ChatHistory[] = [];
  private chatMessages: Record<string, Message[]> = {};
  
  constructor(initWithSampleData: boolean = false) {
    // Only initialize with sample data if explicitly requested
    if (initWithSampleData) {
      this.initializeSampleData();
    }
  }
  
  /**
   * Gets chat histories for the specified mode
   */
  async getChatHistories(mode: ChatMode): Promise<ChatHistory[]> {
    // Return a copy to prevent external modification
    return mode === 'standard'
      ? [...this.standardChatHistories]
      : [...this.multiAgentChatHistories];
  }
  
  /**
   * Gets messages for a specific chat
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    const messages = this.chatMessages[chatId] || [];
    // Return a copy to prevent external modification
    return [...messages];
  }
  
  /**
   * Creates a new chat for the specified mode
   */
  async createChat(mode: ChatMode, title?: string): Promise<ChatHistory> {
    const now = new Date();
    const chatId = uuidv4();
    
    const historyCollection = mode === 'standard'
      ? this.standardChatHistories
      : this.multiAgentChatHistories;
    
    const newChat: ChatHistory = {
      id: chatId,
      title: title || `Chat ${historyCollection.length + 1}`,
      lastUpdated: now,
      messageCount: 0,
      mode: mode
    };
    
    if (mode === 'standard') {
      this.standardChatHistories.push(newChat);
    } else {
      this.multiAgentChatHistories.push(newChat);
    }
    
    this.chatMessages[chatId] = [];
    
    // Sort by most recent
    this.sortChatHistories(mode);
    
    return newChat;
  }
  
  /**
   * Updates a chat with new messages
   */
  async updateChat(chatId: string, messages: Message[]): Promise<ChatHistory> {
    // Find the chat in both collections
    let chatIndex = this.standardChatHistories.findIndex(chat => chat.id === chatId);
    let historyCollection = this.standardChatHistories;
    let mode: ChatMode = 'standard';
    
    // If not found in standard, check multi-agent
    if (chatIndex === -1) {
      chatIndex = this.multiAgentChatHistories.findIndex(chat => chat.id === chatId);
      historyCollection = this.multiAgentChatHistories;
      mode = 'multiAgent';
      
      if (chatIndex === -1) {
        throw new Error(`Chat with ID ${chatId} not found`);
      }
    }
    
    // Update the messages
    this.chatMessages[chatId] = messages;
    
    // Update the chat history entry
    const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
    
    historyCollection[chatIndex] = {
      ...historyCollection[chatIndex],
      lastMessage: this.truncateMessage(lastMessage, 50),
      lastUpdated: new Date(),
      messageCount: messages.length,
    };
    
    // Sort by most recent
    this.sortChatHistories(mode);
    
    return historyCollection[chatIndex];
  }
  
  /**
   * Deletes a chat
   */
  async deleteChat(chatId: string, mode: ChatMode): Promise<boolean> {
    const historyCollection = mode === 'standard'
      ? this.standardChatHistories
      : this.multiAgentChatHistories;
    
    const initialLength = historyCollection.length;
    
    if (mode === 'standard') {
      this.standardChatHistories = this.standardChatHistories.filter(chat => chat.id !== chatId);
    } else {
      this.multiAgentChatHistories = this.multiAgentChatHistories.filter(chat => chat.id !== chatId);
    }
    
    delete this.chatMessages[chatId];
    
    return historyCollection.length !== initialLength;
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
   * Sorts chat histories by last updated (most recent first)
   */
  private sortChatHistories(mode: ChatMode): void {
    const historyCollection = mode === 'standard'
      ? this.standardChatHistories
      : this.multiAgentChatHistories;
    
    historyCollection.sort((a, b) => {
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
   * Initializes the service with sample data
   */
  private initializeSampleData(): void {
    // Create sample standard chats
    const sampleStandardChats: ChatHistory[] = [
      {
        id: uuidv4(),
        title: 'Standard: Welcome Chat',
        lastMessage: 'Hello! How can I help you today?',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        messageCount: 1,
        mode: 'standard'
      },
      {
        id: uuidv4(),
        title: 'Standard: Project Discussion',
        lastMessage: 'Let me outline the steps for your project...',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        messageCount: 3,
        mode: 'standard'
      },
      {
        id: uuidv4(),
        title: 'Standard: Markdown Demo',
        lastMessage: 'Here are examples of Markdown formatting...',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        messageCount: 2,
        mode: 'standard'
      },
    ];
    
    // Create sample multi-agent chats
    const sampleMultiAgentChats: ChatHistory[] = [
      {
        id: uuidv4(),
        title: 'Multi-Agent: Collaboration',
        lastMessage: 'We have analyzed your requirements...',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        messageCount: 2,
        mode: 'multiAgent'
      },
      {
        id: uuidv4(),
        title: 'Multi-Agent: Markdown Features',
        lastMessage: 'Each agent uses different markdown styles...',
        lastUpdated: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
        messageCount: 4,
        mode: 'multiAgent'
      },
    ];
    
    // Add standard chats and initialize message arrays
    for (const chat of sampleStandardChats) {
      this.standardChatHistories.push(chat);
      
      // Add sample messages for each chat
      if (chat.title === 'Standard: Welcome Chat') {
        this.chatMessages[chat.id] = [
          {
            id: uuidv4(),
            content: 'Hello! How can I help you today?',
            role: 'assistant',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ];
      } else if (chat.title === 'Standard: Project Discussion') {
        this.chatMessages[chat.id] = [
          {
            id: uuidv4(),
            content: 'I need help planning my software project.',
            role: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: 'I\'d be happy to help you plan your software project. Could you tell me more about what you\'re building?',
            role: 'assistant',
            timestamp: new Date(Date.now() - 1000 * 60 * 33).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: 'Let me outline the steps for your project...',
            role: 'assistant',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      } else if (chat.title === 'Standard: Markdown Demo') {
        this.chatMessages[chat.id] = [
          {
            id: uuidv4(),
            content: 'Can you show me how markdown formatting works?',
            role: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 17).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: `# Markdown Formatting Demo

## Text Formatting

You can make text **bold**, *italic*, or ***both***. You can also add ~~strikethrough~~ to text.

## Lists

### Unordered Lists
* Item 1
* Item 2
  * Nested Item 2.1
  * Nested Item 2.2
* Item 3

### Ordered Lists
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

## Code

Inline code: \`const greeting = "Hello, World!";\`

Code blocks:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Call the function
console.log(greet('User'));
\`\`\`

## Quotes

> This is a blockquote.
> 
> It can span multiple lines and include other Markdown elements.

## Links and Images

[Visit our documentation](https://example.com/docs)

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | Yes | With multiple levels |
| Lists | Yes | Ordered and unordered |
| Code | Yes | Inline and blocks |
| Tables | Yes | With alignment options |

## Task Lists

- [x] Implement Markdown support
- [ ] Add advanced formatting options
- [ ] Create comprehensive documentation

---

This message demonstrates the Markdown capabilities supported in our chat system.`,
            role: 'assistant',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
    }
    
    // Add multi-agent chats and initialize message arrays
    for (const chat of sampleMultiAgentChats) {
      this.multiAgentChatHistories.push(chat);
      
      if (chat.title === 'Multi-Agent: Collaboration') {
        this.chatMessages[chat.id] = [
          {
            id: uuidv4(),
            content: 'Can you analyze my project from different perspectives?',
            role: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: 'We have analyzed your requirements from multiple angles and can offer a comprehensive evaluation...',
            role: 'assistant',
            agentIdentifier: 'Evaluator',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      } else if (chat.title === 'Multi-Agent: Markdown Features') {
        this.chatMessages[chat.id] = [
          {
            id: uuidv4(),
            content: 'Show me how different agents can use markdown formatting',
            role: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: `# Documentation Overview

## What is Markdown?

Markdown is a lightweight markup language designed to be easy to write and read. It was created with the goal of being:

* **Readable** - The syntax doesn't interfere with readability
* **Publishable** - Plain text can be converted to richly formatted HTML
* **Simple** - Minimal syntax that's easy to learn and remember

> Markdown is widely used in documentation, README files, forum posts, and chat applications.`,
            role: 'assistant',
            agentIdentifier: 'Documentation',
            timestamp: new Date(Date.now() - 1000 * 60 * 11).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: `\`\`\`javascript
// Here's a simple React component that renders Markdown
import React from 'react';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const MarkdownRenderer = ({ content }) => {
  const htmlContent = micromark(content, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]
  });
  
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default MarkdownRenderer;
\`\`\`

You can install the dependencies with:

\`\`\`bash
npm install micromark micromark-extension-gfm
\`\`\``,
            role: 'assistant',
            agentIdentifier: 'Developer',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: uuidv4(),
            content: `## Design Considerations for Markdown Rendering

| Element | Recommendation | Rationale |
|---------|----------------|-----------|
| Code blocks | Use syntax highlighting | Improves readability of code |
| Blockquotes | Subtle left border | Visually separates quoted content |
| Headings | Clear hierarchy | Establishes visual structure |
| Lists | Proper indentation | Shows relationships between items |

For text sizing:

1. **Use relative units** (em/rem) for better accessibility
2. **Implement a density control** for user preferences
3. **Test across devices** to ensure readability

![Example of good markdown styling](https://example.com/markdown-styling.png)`,
            role: 'assistant',
            agentIdentifier: 'Designer',
            timestamp: new Date(Date.now() - 1000 * 60 * 8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
    }
    
    // Sort the chat histories
    this.sortChatHistories('standard');
    this.sortChatHistories('multiAgent');
  }
} 