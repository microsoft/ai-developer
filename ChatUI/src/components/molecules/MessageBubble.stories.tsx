import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MessageBubble } from './MessageBubble';
import { Message, ToolCall } from './ChatMessagePanel';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ChatProvider, ChatContextType, useChatContext } from '@/context/ChatContext';
import { actions } from '@storybook/addon-actions';
// Import testing utilities
import { userEvent, within, expect, findByText } from '@storybook/test';

// Helper to create a wrapper that provides ChatContext with specific values
const WithChatContextWrapper = ({ children, contextValue }: { children: React.ReactNode, contextValue: Partial<ChatContextType> }) => {
  const initialContext = useChatContext(); // Get initial context to merge with overrides
  return (
    <ChatContext.Provider value={{ ...initialContext, ...contextValue }}>
      {children}
    </ChatContext.Provider>
  );
};

const withChatContext = (contextValue: Partial<ChatContextType>) => (
  (Story: React.FC) => (
    <ThemeProvider>
      <ChatProvider>
        <WithChatContextWrapper contextValue={contextValue}>
          <Story />
        </WithChatContextWrapper>
      </ChatProvider>
    </ThemeProvider>
  )
);

// This story uses ThemeProvider decorator to handle proper theme context
const meta: Meta<typeof MessageBubble> = {
  component: MessageBubble,
  title: 'Molecules/MessageBubble',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ChatProvider> { /* Default providers */}
          <Box sx={{ p: 2, maxWidth: '600px', width: '100%' }}>
            <Story />
          </Box>
        </ChatProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    // Add accessibility addon parameters
    a11y: {
      element: '#storybook-root',
      config: { rules: [] },
      options: {},
    },
    docs: {
      description: {
        component: 'Message bubble component that displays chat messages with proper styling based on the sender (user or assistant). Supports multi-agent messages with distinct colors per agent. This molecule component composes atoms together to create a complete message display with avatar, content area, and timestamp.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      description: 'The complete Message object with content, role, timestamp, and optional agent information',
      control: 'object',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for styling customization',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Helper functions to create message objects for consistent story usage
const createUserMessage = (content: string, timestamp = '12:34 PM'): Message => ({
  id: 'user-msg-' + Date.now() + Math.random(),
  content,
  role: 'user',
  timestamp,
});

const createAssistantMessage = (
  content: string, 
  timestamp = '12:35 PM', 
  agentName?: string,
  toolCall?: ToolCall[]
): Message => ({
  id: 'assistant-msg-' + Date.now() + Math.random(),
  content,
  role: 'assistant',
  timestamp,
  ...(agentName && { agentName }),
  ...(toolCall && { toolCall }),
});

const createToolMessage = (content: string, toolCallId: string, timestamp = '12:36 PM'): Message => ({
  id: 'tool-msg-' + Date.now() + Math.random(),
  content,
  role: 'tool',
  timestamp,
  toolCallId,
});

// --- Basic Role Stories ---

export const UserMessage: Story = {
  args: {
    message: createUserMessage('This is a user message. It should display on the right side with a user-themed background.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A message sent by the user, displayed on the right side with user theme colors. Shows composition of avatar, message bubble, and timestamp elements.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for user avatar (assuming it might have a specific test id or class)
    await expect(canvas.getByTestId('user-avatar')).toBeInTheDocument(); 
    // Check content
    await expect(canvas.getByText(/This is a user message/)).toBeInTheDocument();
  },
};

export const AssistantMessage: Story = {
  args: {
    message: createAssistantMessage('This is a response from the assistant. It shows on the left side with an assistant-themed background.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A message from the AI assistant, displayed on the left side with assistant theme colors. Shows the standard layout for assistant responses.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for assistant avatar 
    await expect(canvas.getByTestId('assistant-avatar')).toBeInTheDocument(); 
    // Check content
    await expect(canvas.getByText(/This is a response from the assistant/)).toBeInTheDocument();
  },
};

// --- Content Type Stories ---

export const WithMarkdownContent: Story = {
  args: {
    message: createAssistantMessage('# Markdown Support\n\nThe MessageBubble supports **rich** *formatting* through markdown:\n\n- Lists\n- **Bold text**\n- *Italic text*\n- `Code snippets`\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n\n> Blockquotes are also supported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the MessageBubble\'s markdown rendering capabilities, showcasing how it composes with the MarkdownRenderer atom component.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for specific markdown elements
    await expect(canvas.getByRole('heading', { name: /Markdown Support/i })).toBeInTheDocument();
    await expect(canvas.getByText('rich', { selector: 'strong' })).toBeInTheDocument();
    await expect(canvas.getByText('formatting', { selector: 'em' })).toBeInTheDocument();
    await expect(canvas.getByText('Code snippets', { selector: 'code' })).toBeInTheDocument();
    await expect(canvas.getByText(/const hello = "world"/)).toBeInTheDocument(); // Check code block content
  },
};

export const LongMessage: Story = {
  args: {
    message: createAssistantMessage('This is a much longer message that demonstrates how the bubble handles multiple lines of text. It should wrap appropriately and maintain readability. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the message bubble handles long text with proper wrapping. Tests edge case handling and overflow management.',
      },
    },
  },
  // No specific play function needed, primarily visual test
};

// --- Edge Case Stories ---

export const WithoutTimestamp: Story = {
  args: {
    message: {
      ...createUserMessage('This message has no timestamp displayed.'),
      timestamp: '', // Empty timestamp
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Message with no timestamp displayed, showing how the component handles optional elements gracefully.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/This message has no timestamp/)).toBeInTheDocument();
    // Check that timestamp element is NOT present (might need specific selector/test-id)
    await expect(canvas.queryByTestId('message-timestamp')).not.toBeInTheDocument();
  },
};

// --- Agent Stories ---

export const AgentMessage: Story = {
  args: {
    message: createAssistantMessage('This message is from a specific agent and uses a distinct color based on the agent name.', '12:36 PM', 'ResearchAgent'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Message from a specific agent with a distinct color based on the agent name. Shows how the component manages different visual styles for various agents.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check if the agent name is displayed
    await expect(canvas.getByText('ResearchAgent')).toBeInTheDocument();
  },
};

export const MultiAgentConversation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a conversation with multiple agents, each with a distinct color. Shows how the component maintains consistent color assignments throughout a conversation.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[
        createUserMessage('Can you help me understand quantum computing?', '10:00 AM'),
        createAssistantMessage('Quantum computing uses quantum bits or qubits which can exist in multiple states simultaneously, unlike classical bits.', '10:01 AM', 'PhysicsExpert'),
        createAssistantMessage('This allows quantum computers to perform certain calculations much faster than classical computers.', '10:02 AM', 'ComputerScientist'),
        createUserMessage('What are some practical applications of quantum computing?', '10:03 AM'),
        createAssistantMessage('Quantum computing shows promise for cryptography, drug discovery, and optimization problems.', '10:04 AM', 'ApplicationsExpert'),
        createAssistantMessage('For example, it could significantly speed up the simulation of molecular interactions for new medicines.', '10:05 AM', 'MedicalExpert'),
      ].map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
        />
      ))}
    </Box>
  )
};

// --- Tool Call Stories ---

const sampleToolCall: ToolCall[] = [
  {
    id: 'tool_123',
    functionName: 'searchWeb',
    arguments: { query: 'latest AI advancements' }
  }
];

export const AssistantWithToolCallHidden: Story = {
  args: {
    message: createAssistantMessage(
      'Okay, I will search the web for the latest AI advancements.',
      '1:00 PM',
      undefined,
      sampleToolCall
    ),
  },
  decorators: [withChatContext({ showToolMessages: false })], // Wrap with context override
  parameters: {
    docs: {
      description: {
        story: 'Assistant message that made a tool call, but the tool indicator is hidden because showToolMessages context is false.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Okay, I will search the web/)).toBeInTheDocument();
    // Check that the tool icon/indicator is NOT present
    await expect(canvas.queryByTestId('tool-call-indicator')).not.toBeInTheDocument();
  },
};

export const AssistantWithToolCallVisible: Story = {
  args: {
    message: createAssistantMessage(
      'Okay, I will search the web for the latest AI advancements.',
      '1:00 PM',
      undefined,
      sampleToolCall
    ),
  },
  decorators: [withChatContext({ showToolMessages: true })], // Wrap with context override
  parameters: {
    docs: {
      description: {
        story: 'Assistant message that made a tool call, and the tool indicator IS visible because showToolMessages context is true.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Okay, I will search the web/)).toBeInTheDocument();
    // Check that the tool icon/indicator IS present
    await expect(canvas.getByTestId('tool-call-indicator')).toBeInTheDocument();
  },
};

export const ToolMessageHidden: Story = {
  args: {
    message: createToolMessage(
      '{\"results\": [\"Result 1\", \"Result 2\"]}',
      'tool_123',
      '1:01 PM'
    ),
  },
  decorators: [withChatContext({ showToolMessages: false })],
  parameters: {
    docs: {
      description: {
        story: 'A TOOL role message containing results, which is hidden because showToolMessages context is false.'
      }
    }
  },
  // Play function: Check that the component renders nothing
  play: async ({ container }) => {
    await expect(container.firstChild).toBeNull();
  },
};

export const ToolMessageVisible: Story = {
  args: {
    message: createToolMessage(
      '{\"results\": [\"Result 1\", \"Result 2\"]}',
      'tool_123',
      '1:01 PM'
    ),
  },
  decorators: [withChatContext({ showToolMessages: true })],
  parameters: {
    docs: {
      description: {
        story: 'A TOOL role message containing results, which IS visible because showToolMessages context is true. Shows special styling for tool messages.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check for tool avatar/icon
    await expect(canvas.getByTestId('tool-avatar')).toBeInTheDocument();
    // Check for the "Tool" label
    await expect(canvas.getByText('Tool')).toBeInTheDocument();
    // Check for the preformatted content
    await expect(canvas.getByText(/"Result 1"/)).toBeInTheDocument();
  },
};

// --- Responsive Stories ---

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the message bubble adapts to smaller mobile screens. The component uses responsive design to adjust padding, font size, and avatar size based on screen width.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%' }}> {/* Use 100% width within decorator padding */}
      <MessageBubble 
        message={createUserMessage('This is how a message looks on mobile screens with reduced padding and smaller avatar.')} 
      />
      <Box mt={2}>
        <MessageBubble 
          message={createAssistantMessage('The assistant response also adapts to the smaller screen size.')} 
        />
      </Box>
    </Box>
  ),
};

export const ResponsiveConversation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows how a conversation adapts to different screen sizes. Demonstrates the responsive behavior across mobile, tablet, and desktop viewports.',
      },
    },
  },
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    return (
      <Box sx={{ 
        width: '100%', 
        mx: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? 2 : 4 
      }}>
        {[
          createUserMessage('Hello! How does this look on different devices?', '10:00 AM'),
          createAssistantMessage('The MessageBubble component is fully responsive. On mobile devices, it uses smaller font sizes, reduced padding, and smaller avatars.', '10:01 AM'),
          createUserMessage('That\'s great! What about tablets?', '10:02 AM'),
          createAssistantMessage('On tablets, the component adjusts to provide a balanced experience between mobile and desktop views.', '10:03 AM'),
          createUserMessage('And on desktop?', '10:04 AM'),
          createAssistantMessage('Desktop views have optimal spacing and sizing for comfortable reading. The component also handles window resizing smoothly.', '10:05 AM'),
        ].map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
          />
        ))}
      </Box>
    );
  },
};