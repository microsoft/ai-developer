import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessagePanel, Message } from './ChatMessagePanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { Box, useMediaQuery, useTheme, Typography, Paper, Stack, Divider, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './MessageBubble';
import { MessageSquare, Type } from 'lucide-react';
import { userEvent, within, expect, waitFor } from '@storybook/test';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof ChatMessagePanel> = {
  component: ChatMessagePanel,
  title: 'Molecules/ChatMessagePanel',
  parameters: {
    layout: 'fullscreen',
    a11y: {
      element: '#storybook-root',
      config: { rules: [] },
      options: {},
    },
    docs: {
      description: {
        component: 'Container for displaying chat messages with responsive layout and empty state handling. This molecule composes atomic components to create a complete chat interface with features like auto-scrolling, multi-agent conversations, text size controls, and responsive design adaptations.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Box sx={{ height: '600px', display: 'flex', flexDirection: 'column', border: '1px dashed grey' }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    messages: {
      control: 'object',
      description: 'Array of message objects to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    sx: {
      description: 'Material UI system props for additional styling',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the panel is in a loading state (affects auto-scroll behavior)',
    },
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

const markdownContent = `
# Heading 1
## Heading 2

This is a paragraph with **bold** and *italic* text.

* List item 1
* List item 2
  * Nested item 2.1
  * Nested item 2.2
* List item 3

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Hello, \${name}!\`;
}
\`\`\`

> This is a blockquote

| Name | Role | Department |
|------|------|------------|
| John | Developer | Engineering |
| Lisa | Designer | Design |

[Link to example.com](https://example.com)
`;

const basicUserMessage: Message = {
  id: uuidv4(),
  content: 'Hello! How can you help me?',
  role: 'user',
  timestamp: '1m ago',
};

const basicAssistantMessage: Message = {
  id: uuidv4(),
  content: "I'm an AI assistant, and I can help you with various tasks such as answering questions, generating content, providing recommendations, and more. Just let me know what you need!",
  role: 'assistant',
  timestamp: 'Just now',
};

const conversationMessages: Message[] = [
  {
    id: uuidv4(),
    content: 'Hello! I have a question about JavaScript.',
    role: 'user',
    timestamp: '5m ago',
  },
  {
    id: uuidv4(),
    content: "Sure, I'd be happy to help with JavaScript. What would you like to know?",
    role: 'assistant',
    timestamp: '4m ago',
  },
  {
    id: uuidv4(),
    content: 'How do I create a Promise in JavaScript?',
    role: 'user',
    timestamp: '3m ago',
  },
  {
    id: uuidv4(),
    content: 'In JavaScript, you can create a Promise using the Promise constructor. Here\'s an example:\n\n```javascript\nconst myPromise = new Promise((resolve, reject) => {\n  // Asynchronous operation\n  const success = true;\n  \n  if (success) {\n    resolve("Operation completed successfully");\n  } else {\n    reject("Operation failed");\n  }\n});\n\n// Using the Promise\nmyPromise\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n```\n\nThe Promise constructor takes a function with two parameters: resolve and reject. You call resolve when the asynchronous operation is successful, and reject when it fails.',
    role: 'assistant',
    timestamp: '2m ago',
  },
  {
    id: uuidv4(),
    content: 'Thank you! That was very helpful.',
    role: 'user',
    timestamp: '1m ago',
  },
  {
    id: uuidv4(),
    content: "You're welcome! If you have any more questions about JavaScript or anything else, feel free to ask.",
    role: 'assistant',
    timestamp: 'Just now',
  },
];

const multiAgentMessages: Message[] = [
  {
    id: uuidv4(),
    content: 'Hello! I need help with a project that requires both coding and design advice.',
    role: 'user',
    timestamp: '5m ago',
  },
  {
    id: uuidv4(),
    content: "I'm Engineer, and I can help with the technical aspects of your project. What kind of coding help do you need?",
    role: 'assistant',
    agentName: 'Engineer',
    timestamp: '4m ago',
  },
  {
    id: uuidv4(),
    content: "I'm Designer, and I can provide guidance on the visual and UX aspects. What's the design context for this project?",
    role: 'assistant',
    agentName: 'Designer',
    timestamp: '4m ago',
  },
  {
    id: uuidv4(),
    content: "I'm building a portfolio website and I need help with responsive layout coding and a clean design.",
    role: 'user',
    timestamp: '3m ago',
  },
  {
    id: uuidv4(),
    content: "For responsive layouts, I recommend using a CSS Grid or Flexbox approach rather than older methods. Here's a basic structure you could use:\n\n```css\n.portfolio-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 2rem;\n}\n\n@media (max-width: 768px) {\n  .portfolio-container {\n    grid-template-columns: 1fr;\n  }\n}\n```\n\nThis will create a multi-column layout that adjusts to a single column on smaller screens.",
    role: 'assistant',
    agentName: 'Engineer',
    timestamp: '2m ago',
  },
  {
    id: uuidv4(),
    content: "For a portfolio design, I recommend:\n\n1. **Consistent white space** - Use padding and margins consistently (try a 8px or 16px base unit)\n2. **Limited color palette** - 2-3 primary colors plus 1-2 accent colors\n3. **Typography hierarchy** - 2 fonts maximum (one for headings, one for body text)\n4. **High-quality images** - Optimize all portfolio images for web (compress without losing quality)\n\nMinimalism works well for portfolios as it lets your work be the focus rather than the site design itself.",
    role: 'assistant',
    agentName: 'Designer',
    timestamp: '2m ago',
  },
];

export const EmptyPanel: Story = {
  args: {
    messages: [],
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state showing a message prompting the user to start a conversation. This provides a helpful initial state with clear guidance for users.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Start chatting/i)).toBeInTheDocument();
    await expect(canvas.getByTestId('message-square-icon')).toBeInTheDocument();
  },
};

export const WithUserMessage: Story = {
  args: {
    messages: [basicUserMessage],
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the appearance of a single user message with timestamp. Demonstrates message alignment and styling for user messages.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(basicUserMessage.content)).toBeInTheDocument();
    await expect(canvas.queryByText(/Agent:/i)).not.toBeInTheDocument();
  },
};

export const WithUserAndAssistantMessages: Story = {
  args: {
    messages: [basicUserMessage, basicAssistantMessage],
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic conversation with one user message and an assistant response. Shows the message bubble alignment and styling differences between user and assistant messages.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(basicUserMessage.content)).toBeInTheDocument();
    await expect(canvas.getByText(basicAssistantMessage.content)).toBeInTheDocument();
  },
};

export const Conversation: Story = {
  args: {
    messages: conversationMessages,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete conversation flow with multiple back-and-forth messages. Demonstrates the auto-scrolling behavior, message spacing, and code formatting within messages.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(conversationMessages[0].content)).toBeInTheDocument();
    await expect(canvas.getByText(conversationMessages[conversationMessages.length - 1].content)).toBeInTheDocument();
    await expect(canvas.getByText(/new Promise/)).toBeInTheDocument();

    const textSizeButton = canvas.getByRole('button', { name: /Text Size:/i });
    await userEvent.click(textSizeButton);
    
    const menu = await canvas.findByRole('menu');
    const smallOption = within(menu).getByRole('menuitem', { name: 'Small' });
    const largeOption = within(menu).getByRole('menuitem', { name: 'Large' });
    const mediumOption = within(menu).getByRole('menuitem', { name: 'Medium' });

    await userEvent.click(smallOption);
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /Text Size: small/i })).toBeInTheDocument();
    });

    await userEvent.click(textSizeButton);
    await userEvent.click(largeOption);
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /Text Size: large/i })).toBeInTheDocument();
    });
    
    await userEvent.click(textSizeButton);
    await userEvent.click(mediumOption);
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /Text Size: medium/i })).toBeInTheDocument();
    });
  },
};

export const MultiAgentConversation: Story = {
  args: {
    messages: multiAgentMessages,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-agent conversation with color-coded messages for different agents. Shows how agent names are displayed and how message styling adapts to create visual distinction between different assistants.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Engineer')).toBeInTheDocument();
    await expect(canvas.getByText('Designer')).toBeInTheDocument();
    await expect(canvas.getByText(/CSS Grid or Flexbox/)).toBeInTheDocument();
    await expect(canvas.getByText(/Consistent white space/)).toBeInTheDocument();
  },
};

export const LoadingState: Story = {
  args: {
    messages: conversationMessages.slice(0, 3),
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the panel state while loading a response. The isLoading prop affects auto-scroll behavior, ensuring the panel scrolls immediately to the bottom as new content streams in, rather than using smooth scrolling.',
      },
    },
  },
};

export const WithMarkdownContent: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Can you show me some markdown examples?',
        role: 'user',
        timestamp: '2m ago',
      },
      {
        id: uuidv4(),
        content: markdownContent,
        role: 'assistant',
        timestamp: '1m ago',
      },
    ],
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates rendering of various markdown elements including headings, lists, code blocks, and tables within message bubbles.',
      },
    },
  },
};

export const ComponentComposition: Story = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>ChatMessagePanel Composition</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatMessagePanel molecule is composed of several key elements:
        </Typography>
        <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem', mb: 3 }}>
          <li>MUI Box: Main container providing layout and styling</li>
          <li>MessageBubble (Molecule): Renders individual messages</li>
          <li>Empty State: Displays placeholder content when no messages</li>
          <li>Text Size Control: IconButton and Menu for adjusting text density</li>
          <li>Auto-Scroll Logic: Uses React refs and useEffect for smooth scrolling</li>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>Displays conversation history</li>
            <li>Handles empty states gracefully</li>
            <li>Supports user, assistant, and multi-agent messages</li>
            <li>Integrates Markdown rendering via MessageBubble</li>
            <li>Responsive design for various screen sizes</li>
            <li>Auto-scrolling for new messages</li>
            <li>Text size adjustment for user preference</li>
          </Box>
        </Stack>
      </Paper>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Example Panel:</Typography>
      <Paper elevation={1} sx={{ height: '300px', overflow: 'hidden' }}>
        <ChatMessagePanel messages={conversationMessages.slice(0, 2)} />
      </Paper>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Shows how the ChatMessagePanel molecule is composed of other components and highlights its key features and responsibilities within the chat interface.',
      },
    },
  },
};

export const TextSizeControl: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 2 }} elevation={1}>
        <Typography variant="subtitle2">Small Text Size Panel</Typography>
        <ChatMessagePanel 
          messages={[
            {
              id: uuidv4(),
              content: 'This is a user message with small text.',
              role: 'user',
              timestamp: '1m ago',
            },
            {
              id: uuidv4(),
              content: 'This is an assistant response with small text.',
              role: 'assistant',
              timestamp: 'Just now',
            },
          ]}
        />
      </Paper>
      <Paper sx={{ p: 2 }} elevation={1}>
        <Typography variant="subtitle2">Medium Text Size Panel</Typography>
        <ChatMessagePanel 
          messages={[
            {
              id: uuidv4(),
              content: 'This is a user message with medium text.',
              role: 'user',
              timestamp: '1m ago',
            },
            {
              id: uuidv4(),
              content: 'This is an assistant response with medium text.',
              role: 'assistant',
              timestamp: 'Just now',
            },
          ]}
        />
      </Paper>
      <Paper sx={{ p: 2 }} elevation={1}>
        <Typography variant="subtitle2">Large Text Size Panel</Typography>
        <ChatMessagePanel 
          messages={[
            {
              id: uuidv4(),
              content: 'This is a user message with large text.',
              role: 'user',
              timestamp: '1m ago',
            },
            {
              id: uuidv4(),
              content: 'This is an assistant response with large text.',
              role: 'assistant',
              timestamp: 'Just now',
            },
          ]}
        />
      </Paper>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the text size control functionality. Note that the ChatMessagePanel internally manages the text size state; this story shows messages rendered within panels, but the actual size change is interactive via the control button (top right) or tested in the `Conversation` story\'s play function.',
      },
    },
  },
};

export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the ChatMessagePanel adapts to different screen sizes. The component adjusts padding, font sizes, and spacing to optimize the layout for mobile devices.',
      },
    },
  },
  render: (args) => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
    
    const messages = [
      {
        id: uuidv4(),
        content: "How does the layout change on different devices?",
        role: 'user' as Role,
        timestamp: '12:30 PM',
      },
      {
        id: uuidv4(),
        content: "The ChatMessagePanel uses responsive design to adapt to different screen sizes. On mobile devices, it has reduced padding and spacing to maximize the available area for messages.",
        role: 'assistant' as Role,
        timestamp: '12:31 PM',
      },
      {
        id: uuidv4(),
        content: "What other responsive features does it have?",
        role: 'user' as Role,
        timestamp: '12:32 PM',
      },
      {
        id: uuidv4(),
        content: "The panel also adjusts font sizes, avatar sizes, and message bubble widths based on the screen size. It maintains proper readability and touch targets on small screens while providing more comfortable spacing on larger displays.",
        role: 'assistant' as Role,
        timestamp: '12:33 PM',
      },
    ];
    
    return (
      <Box
        sx={{
          border: '1px dashed grey',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ChatMessagePanel messages={messages} />
        <Paper
          sx={{ 
            position: 'absolute', 
            bottom: '10px', 
            right: '10px', 
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10,
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
            Current viewport: {isMobile ? 'Mobile' : 'Desktop'}
          </Typography>
          <Typography variant="caption" component="div" sx={{ fontSize: '10px', opacity: 0.8 }}>
            Key Responsive Adaptations:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '10px', opacity: 0.8 }}>
            <li>Reduced padding and margins</li>
            <li>Smaller avatar sizes</li>
            <li>Adjusted font sizes</li>
            <li>Wider message bubbles</li>
          </Box>
        </Paper>
      </Box>
    );
  },
}; 