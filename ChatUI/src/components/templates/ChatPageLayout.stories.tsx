import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ChatPageLayout } from './ChatPageLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { Box, Typography, Paper, Stack, Divider, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ChatProvider } from '@/context/ChatContext';
import { ServiceProvider } from '@/services/ServiceProvider';
import { ChatHeader } from '@/components/organisms/ChatHeader';
import { ChatInputArea } from '@/components/organisms/ChatInputArea';
import { MessageBubble } from '@/components/molecules/MessageBubble';
import { v4 as uuidv4 } from 'uuid';
import { MessageSquare, History, Send, Bot, UserCircle2 } from 'lucide-react';

// Define Role type locally since it's not exported from ChatMessagePanel
type Role = 'user' | 'assistant' | 'system';

// Mock message data
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    timestamp: '12:34 PM',
  },
  {
    id: '2',
    content: 'I need help with the multi-agent system integration.',
    role: 'user',
    timestamp: '12:35 PM',
  },
  {
    id: '3',
    content: 'I can certainly help with that. The multi-agent system integration requires configuring several components. What specific part are you struggling with?',
    role: 'assistant',
    timestamp: '12:36 PM',
  },
];

// Multi-agent conversation with agent names
const mockMultiAgentMessages: Message[] = [
  {
    id: '1',
    content: 'I need help designing and implementing a new feature for my application.',
    role: 'user',
    timestamp: '12:30 PM',
  },
  {
    id: '2',
    content: "I can help with the technical implementation aspects. What kind of feature are you looking to build?",
    role: 'assistant',
    agentName: 'Engineer',
    timestamp: '12:31 PM',
  },
  {
    id: '3',
    content: "I'll assist with the design and user experience considerations. What problem are you trying to solve for your users?",
    role: 'assistant',
    agentName: 'Designer',
    timestamp: '12:31 PM',
  },
  {
    id: '4',
    content: "I'm building a file sharing feature that needs to support multiple file types and have good UX.",
    role: 'user',
    timestamp: '12:32 PM',
  },
  {
    id: '5',
    content: "For the implementation, I recommend using a modern file upload library like uppy.js which handles drag-and-drop, progress indicators, and multiple file types. You'll need to set up proper MIME type validation on both client and server, and consider chunked uploads for larger files.",
    role: 'assistant',
    agentName: 'Engineer',
    timestamp: '12:33 PM',
  },
  {
    id: '6',
    content: "From a UX perspective, consider implementing the following patterns:\n\n1. A clear drop zone with visual feedback when files are dragged over\n2. Preview thumbnails for images and icons for other file types\n3. Progress indicators for uploads\n4. Ability to cancel uploads in progress\n5. Clear error messages for invalid file types or sizes\n\nKeep the interface clean with subtle animations to indicate state changes.",
    role: 'assistant',
    agentName: 'Designer',
    timestamp: '12:34 PM',
  },
];

// Sample chat histories for the drawer
const sampleChatHistories: ChatHistory[] = [
  {
    id: '1',
    title: 'API Integration Discussion',
    lastMessage: 'Here are the API endpoints you requested...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    messageCount: 12,
    mode: 'standard',
  },
  {
    id: '2',
    title: 'Project Planning',
    lastMessage: 'Let me outline the steps for your project...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messageCount: 8,
    mode: 'standard',
  },
  {
    id: '3',
    title: 'Code Review Session (Multi-Agent)',
    lastMessage: 'Engineer: I recommend refactoring this function. Designer: The alignment looks good.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 15,
    mode: 'multiAgent',
  },
  {
    id: '4',
    title: 'Bug Troubleshooting',
    lastMessage: 'The error might be caused by this line...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    messageCount: 10,
    mode: 'standard',
  },
];

// Using a mock object for each state rather than trying to extend the component props
const mockStateCases = {
  empty: {
    messages: [],
    chatHistories: [],
    activeChatId: null,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  withMessages: {
    messages: mockMessages,
    chatHistories: [],
    activeChatId: null,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  withHistory: {
    messages: [],
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  full: {
    messages: mockMessages,
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  loading: {
    messages: mockMessages,
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: true,
  },
  multiAgent: {
    messages: mockMultiAgentMessages,
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[2].id,
    agentMode: 'multiAgent' as AgentMode,
    isLoading: false,
  },
  error: {
    messages: [
      ...mockMessages,
      {
        id: '4',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        role: 'system',
        timestamp: '12:37 PM',
      }
    ],
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  }
};

type MockStateKey = keyof typeof mockStateCases;

// Create wrapper components for each state to avoid TypeScript issues
const EmptyStateWrapper = () => (
  <MockChatProvider mockState="empty">
    <ChatPageLayout />
  </MockChatProvider>
);

const WithMessagesWrapper = () => (
  <MockChatProvider mockState="withMessages">
    <ChatPageLayout />
  </MockChatProvider>
);

const WithHistoryWrapper = () => (
  <MockChatProvider mockState="withHistory">
    <ChatPageLayout />
  </MockChatProvider>
);

const FullExampleWrapper = () => (
  <MockChatProvider mockState="full">
    <ChatPageLayout />
  </MockChatProvider>
);

const LoadingStateWrapper = () => (
  <MockChatProvider mockState="loading">
    <ChatPageLayout />
  </MockChatProvider>
);

const MultiAgentModeWrapper = () => (
  <MockChatProvider mockState="multiAgent">
    <ChatPageLayout />
  </MockChatProvider>
);

const ErrorStateWrapper = () => (
  <MockChatProvider mockState="error">
    <ChatPageLayout />
  </MockChatProvider>
);

const MobileViewWrapper = () => (
  <MockChatProvider mockState="full">
    <ChatPageLayout />
  </MockChatProvider>
);

const TabletViewWrapper = () => (
  <MockChatProvider mockState="full">
    <ChatPageLayout />
  </MockChatProvider>
);

// Create a mock provider that wraps the children with proper context
const MockChatProvider = ({ 
  mockState, 
  children 
}: { 
  mockState: MockStateKey, 
  children: React.ReactNode 
}) => {
  // Get the mock state data
  const stateData = mockStateCases[mockState];
  const [messages, setMessages] = useState(stateData.messages);
  const [isLoading, setIsLoading] = useState(stateData.isLoading);
  const [agentMode, setAgentMode] = useState<AgentMode>(stateData.agentMode);

  // Create a value object that matches ChatContextType
  const mockContextValue = {
    // Spread the state data from our mock cases
    ...stateData,
    messages,
    isLoading,
    agentMode,
    // Add mock functions with the right return types
    sendMessage: async (content: string) => {
      console.log('Message sent:', content);
      setIsLoading(true);
      
      // Simulate loading state for 1.5 seconds
      setTimeout(() => {
        const newUserMessage = {
          id: uuidv4(),
          content,
          role: 'user' as Role,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        const newAssistantMessage = {
          id: uuidv4(),
          content: `This is a simulated response to: "${content}"`,
          role: 'assistant' as Role,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages(prev => [...prev, newUserMessage, newAssistantMessage]);
        setIsLoading(false);
      }, 1500);
      
      return Promise.resolve();
    },
    createNewChat: async (title?: string) => {
      console.log('New chat created:', title);
      setMessages([]);
      return Promise.resolve('new-chat-id');
    },
    selectChat: async (chatId: string) => {
      console.log('Chat selected:', chatId);
      // Simulate loading messages for that chat
      setIsLoading(true);
      setTimeout(() => {
        setMessages(mockMessages);
        setIsLoading(false);
      }, 1000);
      return Promise.resolve();
    },
    deleteChat: async (chatId: string) => {
      console.log('Chat deleted:', chatId);
      return Promise.resolve();
    },
    setAgentMode: (mode: AgentMode) => {
      console.log('Agent mode set:', mode);
      setAgentMode(mode);
    },
    abortRequest: () => {
      console.log('Request aborted');
      setIsLoading(false);
    },
    clearMessages: () => {
      console.log('Messages cleared');
      setMessages([]);
    },
  };

  return (
    <ThemeProvider>
      <ServiceProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </ServiceProvider>
    </ThemeProvider>
  );
};

// Using a mock wrapper component to provide proper context
const ChatProviderDecorator = (Story: React.ComponentType) => (
  <ThemeProvider>
    <ServiceProvider>
      <ChatProvider>
        <Story />
      </ChatProvider>
    </ServiceProvider>
  </ThemeProvider>
);

const meta: Meta<typeof ChatPageLayout> = {
  component: ChatPageLayout,
  title: 'Templates/ChatPageLayout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main layout template for the chat application. Combines all organism components (ChatHeader, ChatHistoryPanel, ChatMessagePanel, ChatInputArea) into a complete chat interface with responsive behavior for different screen sizes. This template manages the overall application layout, navigation patterns, and state coordination between components.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [ChatProviderDecorator],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class names for custom styling',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChatPageLayout>;

export const Empty: Story = {
  render: () => <EmptyStateWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Empty chat page with no messages or history. This represents the initial state when a user first arrives at the application. Shows the empty state message in the central panel prompting the user to start a conversation.',
      },
    },
  },
};

export const WithExistingConversation: Story = {
  render: () => <WithMessagesWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page with an existing conversation but no history. This demonstrates the state when messages exist in the current chat but no previous conversations are available. The history panel will show the empty state.',
      },
    },
  },
};

export const WithChatHistory: Story = {
  render: () => <WithHistoryWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page with chat history but no active messages. Shows how the history panel displays past conversations, allowing the user to select one. The main chat panel shows the empty state since no messages are loaded yet.',
      },
    },
  },
};

export const FullExample: Story = {
  render: () => <FullExampleWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Complete chat page with messages and history. This represents the typical state during active use of the application, with both current messages and past conversation history available.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => <LoadingStateWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page in loading state while waiting for a response. Shows the loading indicator animation in both the chat panel and input area. The input is disabled during this state to prevent multiple simultaneous requests.',
      },
    },
  },
};

export const MultiAgentMode: Story = {
  render: () => <MultiAgentModeWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page in multi-agent mode. Demonstrates how the interface adapts when multiple AI assistants (with different roles/specialties) are responding to user queries. Each assistant message includes an agent name and distinct visual styling.',
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => <ErrorStateWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page showing an error message. Demonstrates how the system responds when encountering an API error or other failure condition. System messages are displayed with distinct styling to differentiate them from user and assistant messages.',
      },
    },
  },
};

export const MobileView: Story = {
  render: () => <MobileViewWrapper />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Chat page optimized for mobile view. Shows how the component adapts to small screens with a temporary drawer (hidden by default), optimized spacing, and compact controls. The chat history drawer can be toggled with the drawer button.',
      },
    },
  },
};

export const TabletView: Story = {
  render: () => <TabletViewWrapper />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Chat page optimized for tablet view. Demonstrates the intermediate responsive state with a persistent drawer that can be toggled on/off. Font sizes and spacing are optimized for the medium-sized viewport.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    // This is a render function component that can use hooks
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    
    return (
      <MockChatProvider mockState="full">
        <Box sx={{ 
          position: 'absolute', 
          bottom: '70px', 
          right: isMobile ? '10px' : '20px',
          zIndex: 1000,
          maxWidth: '300px',
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 1,
          opacity: 0.9,
        }}>
          <Typography variant="subtitle2" gutterBottom>Interactive Demo</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            This demo allows full interaction:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.8rem' }}>
            <li>Select chats from the drawer</li>
            <li>Toggle the chat drawer</li>
            <li>Switch between agent modes</li>
            <li>Type and send messages</li>
            <li>Create a new chat</li>
            <li>Toggle the theme</li>
          </Box>
        </Box>
        <ChatPageLayout />
      </MockChatProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive demonstration of the chat interface with realistic state management. Users can experiment with all functionality including sending messages, toggling modes, and navigating between chats.',
      },
    },
  },
};

export const ComponentComposition: Story = {
  render: () => (
    <Box sx={{ p: 3, maxWidth: '1200px' }}>
      <Typography variant="h5" gutterBottom>ChatPageLayout Composition</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          The ChatPageLayout template composes these organism and molecule components:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <li><strong>ChatHeader (Organism)</strong> - Top navigation bar with mode toggles and controls</li>
          <li><strong>ChatHistoryPanel (Organism)</strong> - Drawer containing past conversation list</li>
          <li><strong>ChatMessagePanel (Molecule)</strong> - Main content area displaying conversation</li>
          <li><strong>ChatInputArea (Organism)</strong> - Bottom input area for sending messages</li>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>Component Hierarchy</Typography>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
          <pre style={{ margin: 0, fontSize: '0.85rem', overflow: 'auto' }}>
{`ChatPageLayout (Template)
├── ChatHeader (Organism)
│   ├── AgentToggle (Molecule)
│   ├── ThemeToggle (Molecule)
│   └── Button (Atom)
├── ChatHistoryPanel (Organism)
│   └── List of history items (Molecules)
├── ChatMessagePanel (Molecule)
│   └── MessageBubble components (Molecule)
└── ChatInputArea (Organism)
    ├── ChatInput (Molecule)
    └── Button (Atom)`}
          </pre>
        </Box>
        
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Key Features:</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li><strong>Integrated State Management</strong> - Coordinates state across all components</li>
              <li><strong>Responsive Design</strong> - Adapts layout, sizing, and behavior across device sizes</li>
              <li><strong>Context Integration</strong> - Leverages ThemeProvider, ChatProvider, and ServiceProvider</li>
              <li><strong>Accessibility Support</strong> - Maintains proper focus management and keyboard navigation</li>
              <li><strong>Error Handling</strong> - Gracefully manages error states with recovery options</li>
              <li><strong>Persistent Preferences</strong> - Maintains user preferences for theme and text size</li>
            </Box>
          </Box>
        </Stack>
      </Paper>
      
      <Typography variant="h6" gutterBottom>Component Snapshots</Typography>
      <Stack spacing={4} divider={<Divider />}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>ChatHeader (Organism)</Typography>
          <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
            <ChatHeader 
              agentMode="standard" 
              onAgentModeToggle={() => {}} 
              onNewChat={() => {}} 
            />
          </Paper>
          <Typography variant="body2">
            Provides navigation controls, mode toggles, and top-level actions.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>Message Bubbles (Molecule)</Typography>
          <Paper sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }} elevation={1}>
            <MessageBubble
              message={{
                id: '1',
                content: 'Hello! How can I help you today?',
                role: 'assistant',
                timestamp: '12:34 PM',
              }}
            />
            <MessageBubble
              message={{
                id: '2',
                content: 'I need help with implementing a new feature.',
                role: 'user',
                timestamp: '12:35 PM',
              }}
            />
          </Paper>
          <Typography variant="body2">
            Display individual messages with appropriate styling based on role.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>Chat Input Area (Organism)</Typography>
          <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
            <ChatInputArea 
              onSendMessage={() => {}} 
              agentMode="standard"
              isLoading={false}
            />
          </Paper>
          <Typography variant="body2">
            Allows users to compose and send messages with feedback states.
          </Typography>
        </Box>
      </Stack>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Send size={20} />
          <Typography variant="subtitle2">Data Flow Visualization</Typography>
        </Stack>
        <Typography variant="body2" paragraph sx={{ mt: 1 }}>
          The ChatPageLayout orchestrates data flow between components:
        </Typography>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
          <pre style={{ margin: 0, fontSize: '0.85rem', overflow: 'auto' }}>
{`1. User inputs message → ChatInputArea → ChatContext.sendMessage()
2. ChatContext updates messages state and loading state
3. Message state flows to ChatMessagePanel for display
4. New chat created → Added to ChatHistoryPanel
5. Theme toggle → ThemeContext → Updates all components
6. Agent mode toggle → ChatContext → Updates UI components`}
          </pre>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Demonstrates how the ChatPageLayout template is composed of organisms, molecules, and atoms. Shows the component hierarchy, data flow, and key features of the template architecture.',
      },
    },
  },
};

export const ResponsiveAdaptations: Story = {
  render: () => {
    // This is a render function component that can use hooks
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    
    return (
      <Box sx={{ p: 3, maxWidth: '800px' }}>
        <Typography variant="h6" gutterBottom>Responsive Design Adaptations</Typography>
        
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="body2" paragraph>
            The ChatPageLayout uses a responsive design system that adapts to different screen sizes:
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">Current viewport:</Typography>
              <Paper sx={{ px: 2, py: 0.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="body2">
                  {isSmallMobile ? 'Mobile (Small)' : isMobile ? 'Mobile/Tablet' : 'Desktop'}
                </Typography>
              </Paper>
            </Box>
            
            <Divider />
            
            <Typography variant="subtitle2">Breakpoint Adaptations:</Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li><strong>Desktop ({'>'}900px)</strong>: Persistent drawer, full spacing, standard controls</li>
              <li><strong>Tablet (600-900px)</strong>: Persistent drawer (narrower), reduced padding</li>
              <li><strong>Mobile ({'<'}600px)</strong>: Temporary drawer, compact controls, optimized spacing</li>
              <li><strong>Small Mobile ({'<'}360px)</strong>: Further reduced sizing, minimal UI elements</li>
            </Box>
          </Stack>
        </Paper>
        
        <Stack spacing={3}>
          <Paper sx={{ p: 2 }} elevation={1}>
            <Typography variant="subtitle2" gutterBottom>Desktop Layout:</Typography>
            <Box sx={{ 
              p: 1, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1,
              height: '200px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box sx={{ height: '40px', width: '100%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2 }}>
                <Typography variant="caption" sx={{ flexGrow: 1 }}>Header</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <UserCircle2 size={16} />
                  <Bot size={16} />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', height: 'calc(100% - 40px)' }}>
                <Box sx={{ width: '280px', height: '100%', borderRight: '1px solid', borderColor: 'divider', p: 1 }}>
                  <Typography variant="caption">History Panel</Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ flexGrow: 1, p: 1 }}>
                    <Typography variant="caption">Message Panel</Typography>
                  </Box>
                  <Box sx={{ height: '50px', borderTop: '1px solid', borderColor: 'divider', p: 1 }}>
                    <Typography variant="caption">Input Area</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 2 }} elevation={1}>
            <Typography variant="subtitle2" gutterBottom>Mobile Layout:</Typography>
            <Box sx={{ 
              p: 1, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1,
              height: '200px',
              width: '120px',
              mx: 'auto',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Box sx={{ height: '30px', width: '100%', bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', px: 1 }}>
                <History size={12} />
                <Typography variant="caption" sx={{ flexGrow: 1, fontSize: '0.6rem', ml: 0.5 }}>Header</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <UserCircle2 size={12} />
                  <Bot size={12} />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 30px)' }}>
                <Box sx={{ flexGrow: 1, p: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Message Panel</Typography>
                </Box>
                <Box sx={{ height: '30px', borderTop: '1px solid', borderColor: 'divider', p: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Input</Typography>
                </Box>
              </Box>
              
              {/* Overlay drawer (temporary) */}
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                height: '100%', 
                width: '80%', 
                bgcolor: 'background.paper', 
                boxShadow: 2,
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                opacity: 0.9,
              }}>
                <Typography variant="caption" sx={{ fontSize: '0.6rem', mb: 0.5 }}>
                  History Drawer (Temporary)
                </Typography>
                <Box sx={{ height: '10px', width: '90%', bgcolor: 'action.hover', mb: 0.5, borderRadius: 0.5 }} />
                <Box sx={{ height: '10px', width: '90%', bgcolor: 'primary.light', mb: 0.5, borderRadius: 0.5 }} />
                <Box sx={{ height: '10px', width: '90%', bgcolor: 'action.hover', mb: 0.5, borderRadius: 0.5 }} />
              </Box>
            </Box>
          </Paper>
        </Stack>
        
        <Paper sx={{ p: 2, mt: 3 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Responsive Considerations:</Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>Drawer automatically switches between persistent and temporary</li>
            <li>Header controls adapt with compact versions on small screens</li>
            <li>Input area maintains usability with touch-friendly sizing</li>
            <li>Scrolling behavior optimized for touch devices</li>
            <li>Font sizes and spacing scale proportionally</li>
            <li>Touch targets maintain minimum 44px hit areas</li>
          </Box>
        </Paper>
      </Box>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Detailed exploration of the responsive design system used by the ChatPageLayout. Shows how the layout, components, and spacing adapt to different viewport sizes from desktop to mobile.',
      },
    },
  },
};

export const UserFlowsDemo: Story = {
  render: () => (
    <Box sx={{ p: 3, maxWidth: '800px' }}>
      <Typography variant="h6" gutterBottom>User Flow Demonstrations</Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatPageLayout supports these key user flows:
        </Typography>
      </Paper>
      
      <Stack spacing={3}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>New Conversation Flow:</Typography>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <ol style={{ marginTop: 0, paddingLeft: '1.5rem' }}>
              <li>User clicks "New Chat" button in header</li>
              <li>System clears current conversation</li>
              <li>Empty message panel is displayed</li>
              <li>User types and sends first message</li>
              <li>System creates new chat in history</li>
              <li>Assistant responds to message</li>
            </ol>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Switch Chat Flow:</Typography>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <ol style={{ marginTop: 0, paddingLeft: '1.5rem' }}>
              <li>User opens drawer (if on mobile)</li>
              <li>User selects a chat from history</li>
              <li>System loads messages for selected chat</li>
              <li>Message panel updates with conversation</li>
              <li>Drawer closes automatically on mobile</li>
              <li>User can continue the conversation</li>
            </ol>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Change Agent Mode Flow:</Typography>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <ol style={{ marginTop: 0, paddingLeft: '1.5rem' }}>
              <li>User clicks agent toggle in header</li>
              <li>System switches between standard/multi-agent mode</li>
              <li>Input area updates with appropriate placeholder</li>
              <li>User sends message in new mode</li>
              <li>System responds with appropriate agent formatting</li>
            </ol>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Error Recovery Flow:</Typography>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <ol style={{ marginTop: 0, paddingLeft: '1.5rem' }}>
              <li>User sends a message</li>
              <li>System encounters error during processing</li>
              <li>Error message displayed in chat</li>
              <li>Input area returns to enabled state</li>
              <li>User can retry with modified request</li>
            </ol>
          </Box>
        </Paper>
      </Stack>
      
      <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <MessageSquare size={18} />
          <Typography variant="subtitle2">Accessibility Considerations</Typography>
        </Stack>
        <Typography variant="body2" paragraph>
          The ChatPageLayout implements these accessibility features:
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <li>Proper focus management during navigation/actions</li>
          <li>ARIA landmarks for screen reader navigation</li>
          <li>Keyboard navigation support for all interactions</li>
          <li>Sufficient color contrast in both themes</li>
          <li>Text scaling without layout breaking</li>
          <li>Loading states announced to screen readers</li>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Demonstrates the key user flows supported by the ChatPageLayout, including creating new chats, switching between conversations, changing agent modes, and handling errors. Also highlights accessibility considerations.',
      },
    },
  },
};