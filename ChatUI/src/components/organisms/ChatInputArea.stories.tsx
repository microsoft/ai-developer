import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ChatInputArea } from './ChatInputArea';
import { ThemeProvider } from '@/context/ThemeContext';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { Box, Typography } from '@mui/material';

// Create a stateful wrapper for Storybook interactions
const StatefulChatInputArea = ({ 
  initialMode = 'standard',
  isLoading = false
}: { 
  initialMode?: AgentMode,
  isLoading?: boolean
}) => {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  const [messages, setMessages] = useState<string[]>([]);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {messages.length > 0 && (
        <Box sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: 'rgba(0, 0, 0, 0.05)', 
          borderRadius: 1,
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Sent messages:</Typography>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ whiteSpace: 'pre-wrap', mb: 1, fontSize: '0.875rem' }}>
              {index + 1}. {msg}
            </Box>
          ))}
        </Box>
      )}
      <ChatInputArea 
        agentMode={mode}
        isLoading={isLoading}
        onSendMessage={(newMessage) => {
          setMessages(prev => [...prev, newMessage]);
          console.log(`Message sent: ${newMessage}`);
        }} 
      />
    </Box>
  );
};

const meta: Meta<typeof ChatInputArea> = {
  component: ChatInputArea,
  title: 'Organisms/ChatInputArea',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Chat input area with status indicators, loading states, and agent mode indicators. Includes the ChatInput component and additional UI elements that show the current agent mode and loading states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    agentMode: {
      control: 'radio',
      options: ['standard', 'multiAgent'],
      description: 'The current agent mode (standard or multiAgent)',
    },
    onSendMessage: { 
      action: 'message sent',
      description: 'Function called when a message is sent from the input',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the component is in a loading state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    sx: {
      description: 'Material UI system props for additional styling',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChatInputArea>;

// Standard mode story
export const StandardMode: Story = {
  args: {
    agentMode: 'standard',
    isLoading: false,
    onSendMessage: (message) => console.log(`Message sent: ${message}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatInputArea in standard mode, ready to accept user input',
      },
    },
  },
};

// Multi-agent mode story
export const MultiAgentMode: Story = {
  args: {
    agentMode: 'multiAgent',
    isLoading: false,
    onSendMessage: (message) => console.log(`Message sent: ${message}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatInputArea in multi-agent mode, showing the multi-agent indicator',
      },
    },
  },
};

// Standard mode loading state
export const StandardModeLoading: Story = {
  args: {
    agentMode: 'standard',
    isLoading: true,
    onSendMessage: (message) => console.log(`Message sent: ${message}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatInputArea in standard mode with loading state, showing loading indicators and disabled input',
      },
    },
  },
};

// Multi-agent mode loading state
export const MultiAgentModeLoading: Story = {
  args: {
    agentMode: 'multiAgent',
    isLoading: true,
    onSendMessage: (message) => console.log(`Message sent: ${message}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatInputArea in multi-agent mode with loading state, showing agent-specific loading messages',
      },
    },
  },
};

// Interactive story that maintains state
export const Interactive: Story = {
  args: {},
  render: () => <StatefulChatInputArea initialMode="standard" />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive ChatInputArea that maintains sent messages and allows real input',
      },
    },
  },
};

// Compare loading states side by side
export const LoadingStatesComparison: Story = {
  args: {},
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Standard Mode - Not Loading</Typography>
        <ChatInputArea 
          agentMode="standard"
          isLoading={false}
          onSendMessage={(message) => console.log(`Message sent: ${message}`)}
        />
      </Box>
      
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Standard Mode - Loading</Typography>
        <ChatInputArea 
          agentMode="standard"
          isLoading={true}
          onSendMessage={(message) => console.log(`Message sent: ${message}`)}
        />
      </Box>
      
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Multi-Agent Mode - Not Loading</Typography>
        <ChatInputArea 
          agentMode="multiAgent"
          isLoading={false}
          onSendMessage={(message) => console.log(`Message sent: ${message}`)}
        />
      </Box>
      
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Multi-Agent Mode - Loading</Typography>
        <ChatInputArea 
          agentMode="multiAgent"
          isLoading={true}
          onSendMessage={(message) => console.log(`Message sent: ${message}`)}
        />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all possible states of the ChatInputArea component',
      },
    },
  },
}; 