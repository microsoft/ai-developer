import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ThemeProvider } from '../providers/ThemeProvider';
// Import testing utilities
import { userEvent, within, expect, waitFor } from '@storybook/test';

const meta = {
  title: 'Molecules/ChatInput',
  component: ChatInput,
  decorators: [
    (Story) => (
      <ThemeProvider>
        {/* Wrap story in a div with fixed width for consistent layout */}
        <Box sx={{ width: '100%', maxWidth: '500px', p: 2 }}>
          <Story />
        </Box>
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
        component: 'Chat input component with Material UI integration, multiline support, and theming. This molecule composes atomic components like TextField and Button to create a cohesive input experience. Features keyboard shortcuts, responsive design, and state management.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSendMessage: { 
      action: 'sendMessage',
      description: 'Function called when a message is sent (on button click or Enter key)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the input field when empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field and send button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for styling customization',
    },
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to get input and button elements
const getElements = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const textbox = canvas.getByRole('textbox');
  const sendButton = canvas.getByRole('button', { name: /Send message/i });
  return { canvas, textbox, sendButton };
};

export const Default: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type your message...',
    disabled: false,
  },
  // Removed render function, args are sufficient
  parameters: {
    docs: {
      description: {
        story: 'Default chat input with standard width and placeholder text. Shows the basic composition of TextField and Send button.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const { textbox, sendButton } = getElements(canvasElement);
    await expect(textbox).toBeEnabled();
    await expect(sendButton).toBeDisabled(); // Initially disabled as input is empty

    // Type message
    await userEvent.type(textbox, 'Hello Storybook!');
    await expect(textbox).toHaveValue('Hello Storybook!');
    await expect(sendButton).toBeEnabled(); // Should be enabled now

    // Click send button
    await userEvent.click(sendButton);
    await expect(args.onSendMessage).toHaveBeenCalledWith('Hello Storybook!');
    await expect(textbox).toHaveValue(''); // Input should clear after send
    await expect(sendButton).toBeDisabled(); // Should be disabled again

    // Test Enter key press
    await userEvent.type(textbox, 'Send with Enter');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSendMessage).toHaveBeenCalledWith('Send with Enter');
    await expect(textbox).toHaveValue('');
  },
};

export const Disabled: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Waiting for response...',
    disabled: true,
  },
  // Removed render function
  parameters: {
    docs: {
      description: {
        story: 'Disabled chat input shown during loading states. Both the input field and button are disabled, with appropriate visual styling.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const { textbox, sendButton } = getElements(canvasElement);
    await expect(textbox).toBeDisabled();
    await expect(sendButton).toBeDisabled();
  },
};

export const Mobile: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type message (mobile)...',
    disabled: false,
  },
  // Removed render function
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile view of the chat input component. Shows responsive adaptations for smaller screens including adjusted spacing and proportions.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const { textbox, sendButton } = getElements(canvasElement);
    await expect(textbox).toBeEnabled();
    await expect(sendButton).toBeDisabled();

    await userEvent.type(textbox, 'Mobile test');
    await expect(textbox).toHaveValue('Mobile test');
    await expect(sendButton).toBeEnabled();

    await userEvent.click(sendButton);
    await expect(args.onSendMessage).toHaveBeenCalledWith('Mobile test');
    await expect(textbox).toHaveValue('');
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Ask a question...',
    disabled: false,
  },
  // Removed render function
  parameters: {
    docs: {
      description: {
        story: 'Chat input with custom placeholder text. Demonstrates how the component can be customized to fit different contexts and use cases.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const { textbox, sendButton } = getElements(canvasElement);
    await expect(textbox).toHaveAttribute('placeholder', 'Ask a question...');
    await expect(textbox).toBeEnabled();
    await expect(sendButton).toBeDisabled();

    await userEvent.type(textbox, 'Placeholder test');
    await expect(sendButton).toBeEnabled();
    await userEvent.click(sendButton);
    await expect(args.onSendMessage).toHaveBeenCalledWith('Placeholder test');
  },
};

// Interactive example showing multiline capabilities and internal state
export const MultilineSupport: Story = {
  args: {
    // Args for documentation and controls, render handles actual props
    onSendMessage: action('sendMessage'),
    placeholder: 'Type a multiline message (use Shift+Enter for line breaks)...',
    disabled: false,
  },
  render: (args) => {
    const [messages, setMessages] = useState<string[]>([]);
    
    const handleSendMessage = (message: string) => {
      setMessages((prev) => [...prev, message]);
      args.onSendMessage(message); // Call the action from args
    };
    
    return (
      <Box sx={{ width: '100%' }}> {/* Adjusted width for decorator padding */}
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          Try typing a long message with line breaks (Shift+Enter)
        </Typography>
        
        {messages.length > 0 && (
          <Paper sx={{ 
            mb: 2, 
            p: 2, 
            borderRadius: 1,
            maxHeight: '150px',
            overflow: 'auto'
          }} elevation={1}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sent messages:</Typography>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ whiteSpace: 'pre-wrap', mb: 1, fontSize: '0.875rem' }}>
                {index + 1}. {msg}
              </Box>
            ))}
          </Paper>
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          placeholder={args.placeholder}
          disabled={args.disabled}
        />
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the multiline capabilities and internal state management of the chat input. Try using Shift+Enter to create line breaks. Shows how the component handles state changes and event propagation.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const { textbox, sendButton } = getElements(canvasElement);
    
    // Test Shift+Enter for newline
    await userEvent.type(textbox, 'Line 1{Shift>}{Enter}{/Shift}Line 2');
    await expect(textbox).toHaveValue('Line 1\nLine 2');
    await expect(sendButton).toBeEnabled();

    // Send message
    await userEvent.click(sendButton);
    await expect(args.onSendMessage).toHaveBeenCalledWith('Line 1\nLine 2');
    await expect(textbox).toHaveValue('');

    // Verify message appeared in the list (rendered by the story's state)
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText(/1\. Line 1\nLine 2/)).toBeInTheDocument();
    });
  },
};

// Theme integration demonstration
export const ThemeVariations: Story = {
  args: {
    // Args for documentation and controls
    onSendMessage: action('sendMessage'),
    placeholder: 'Type your message...',
    disabled: false,
  },
  render: (args) => (
    <Box sx={{ 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="subtitle2">Regular state:</Typography>
      <ChatInput 
        onSendMessage={args.onSendMessage} // Use action from args
        placeholder={args.placeholder}
      />
      
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Disabled state:</Typography>
      <ChatInput 
        onSendMessage={args.onSendMessage}
        placeholder="Waiting for response..."
        disabled
      />
      
      {/* Removed pre-filled example as it wasn't accurate */}
      
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', mt: 2 }}>
        Try toggling the theme in Storybook to see how the component adapts
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component adapts to the current theme in various states. Demonstrates the theme integration capabilities of the component across different modes and states.',
      },
    },
  },
  // No play function needed for theme variations (visual test)
};

// Interaction patterns demonstration
export const InteractionPatterns: Story = {
  args: {
    // Args for documentation and controls
    onSendMessage: action('sendMessage'),
    placeholder: 'Type to test interactions...',
    disabled: false,
  },
  render: (args) => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [events, setEvents] = useState<string[]>([]);

    const logEvent = (type: string, value: string) => {
      setEvents((prev) => [...prev, `${type}: ${value}`]);
      action(type)(value);
    };

    const handleSendMessage = (message: string) => {
      logEvent('sendMessage', message);
      setInputMessage(''); // Clear local state for input
    };

    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          Events are logged below. Test typing, sending via button, and sending via Enter key.
        </Typography>
        <ChatInput 
          onSendMessage={handleSendMessage}
          placeholder={args.placeholder}
          disabled={args.disabled}
        />
        <Paper sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 1,
            maxHeight: '150px',
            overflow: 'auto'
          }} elevation={1}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Event Log:</Typography>
          {events.length === 0 && <Typography variant="caption">(No events yet)</Typography>}
          {events.map((evt, index) => (
            <Box key={index} sx={{ mb: 0.5, fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {evt}
            </Box>
          ))}
        </Paper>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates key interaction patterns: typing, sending via button, and sending via Enter key. Events are logged below the input field.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const { textbox, sendButton } = getElements(canvasElement);
    const canvas = within(canvasElement);

    // Test typing
    await userEvent.type(textbox, 'Test Typing');
    await expect(textbox).toHaveValue('Test Typing');
    await expect(sendButton).toBeEnabled();

    // Test button send
    await userEvent.click(sendButton);
    await waitFor(() => { // Wait for state update and log to appear
      expect(canvas.getByText(/sendMessage: Test Typing/)).toBeInTheDocument();
    });
    await expect(textbox).toHaveValue(''); // Input should clear
    await expect(sendButton).toBeDisabled();

    // Test Enter send
    await userEvent.type(textbox, 'Test Enter');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(canvas.getByText(/sendMessage: Test Enter/)).toBeInTheDocument();
    });
    await expect(textbox).toHaveValue('');
  },
}; 